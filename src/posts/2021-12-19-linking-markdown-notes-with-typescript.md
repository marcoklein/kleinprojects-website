---
title: Linking Markdown Notes with TypeScript
date: 2021-12-19
tags: [notes]
---

Linked note taking brings the advantage of connecting knowledge in an intuitive, connected matter as opposed to traditional, section-based note taking approaches. This approach gained traction through new networked note taking applications like [RoamResearch](https://roamresearch.com/), [Obsidian](https://obsidian.md/), and [Logseq](https://logseq.com/). They pursue the concept of _linked_ notes - that means that instead of dividing notes into sections, they are all in a flat directory and define structure by relations to other notes.

In this post we are using Markdown to stick to an easily editable text format without vendor lock-in. We could even drop these plain files into a Git folder for effortless backups and versioning. For linking markdown notes we are going to use the [widely adopted Wikilink format](https://en.wikipedia.org/wiki/Help:Link) (e.g. `[[wikilink]]`). These link arbitrary documents without the need of specifying the exact location.

I did not find too many resources and guides on how you could implement algorithms by yourself to interlink Markdown notes with the power of `[[wikilinks]]`. That is why this post dives into an implementation to

1. [Setup a base project](#Setup) ([Source on GitHub](https://github.com/marcoklein/linked-markdown-notes)) to work with examples
2. [Read markdown files](#Reading-Markdown-Files) from your folder to have data to analyze
3. [Parse the files](#Parsing-Markdown-Files) to find all wikilinks for further mapping
4. [Extract titles](#Extracting-Document-Titles) to that we can map our links
5. [Build a master mapping table](#Building-Master-Mappings) to quickly interlink our notes
6. [Map links to document paths](#Mapping-Links-to-Document-Paths) for an example on using our master mappings

I assume knowledge of TypeScript but it is not necessary in order to grasp the concept and process.

**Objective: Building a basis to link any markdown notes through a mapping data structure that gives you direct access to _path_, _title_, and _links_ of documents.**

## Setup

At first, we are going to setup our environment and base project. Ensure you have a recent installation of [Node.js](https://nodejs.org). If not head over to their [download page](https://nodejs.org/en/download/) grab the latest version and install it.
We use the package manager [yarn](https://yarnpkg.com/) for dependency management. However, you could also install everything via [npm](https://www.npmjs.com/) if preferred. So, go ahead and install yarn.

```bash
npm install --global yarn
```

Let's create a new folder for our project and initialize an empty yarn project with default options.

> You could also find all code on [GitHub](https://github.com/marcoklein/linked-markdown-notes).

```bash
mkdir linked-markdown-notes
cd linked-markdown-notes
yarn init -y
```

Add required dependencies for running the project.

```shell
yarn add --dev typescript ts-node @types/node @types/fs-extra
yarn add remark-parse remark-wiki-link unist-util-visit-parents
```

We are using [ECMAScript Modules (ESM)](https://www.typescriptlang.org/docs/handbook/esm-node.html), therefore add the `"type": "module"` option to your `package.json` and create a `start` script for running our project:

```json
{
  "name": "linked-markdown-notes",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm src/index.js"
  }
}
```

Create a new `tsconfig.json` file for our [TypeScript](https://www.typescriptlang.org/) configuration:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "remark-wiki-link": ["./typings/remark-wiki-link.d.ts"]
    }
  }
}
```

As the code base of `remark-wiki-link` is JavaScript and the package ships no types we have to create a new type definition file and reference it in the `tsconfig.json`.
For this we just create a new file under `typings/remark-wiki-link.d.ts` with the content

```ts
declare module 'remark-wiki-link';
```

Either use an already existing folder with markdown files or create a new `test/resources` folder that contains some sample markdown files. In this post, all examples and code will work with the latter one. If you want to follow it, the create 4 files in that folder:

`test/resources/Dog.md`

```
# Dog
There is a dog.
```

`test/resources/Cat.md`

```
# Cat
Cat plays with [[Dog]].
```

`test/resources/Farm.md`

```
# Farm
Farm has a [[Dog]], a [[Horse]], and a [[Cow]].
```

`test/resources/Home.md`

```
# Home
Home has a [[Cat]] and [[Dog]].
```

The content of the files make no real sense, but we will need these examples as a basis to test the `[[wikilinks]]`.
Eventually, our folder structure should look this:

```
test/
  resources/
    Dog.md
    Cat.md
    Home.md
    Farm.md
typings/
  remark-wiki-link.d.ts
package.json
tsconfig.json
```

**With our basic setup we are now ready to dive into the actual implementation.**

## Reading Markdown Files

Let's write some code for reading our files that we want to link. For that create a new file under `src/index.ts` as application entry. Add the following function to read markdown files of a specific directory:

```ts
import fs from 'node:fs/promises';
import path from 'path';

interface FileSystemDocument {
  path: string;
  content: string;
}

/**
 * Reads all markdown files of a directory.
 *
 * @param directoryPath Directory to read.
 * @returns Path and content of markdown files within the directory.
 */
async function readMarkdownFiles(
  directoryPath: string
): Promise<FileSystemDocument[]> {
  // read files in folder
  const dirents = await fs.readdir(directoryPath, { withFileTypes: true });
  // filter files from folder
  const files = dirents
    // only consider files that have a markdown extension
    .filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.md')
    // return path of file
    .map(dirent => path.join(directoryPath, dirent.name));
  // read file contents
  const filesWithContentPromises = files.map(
    async (filePath): Promise<FileSystemDocument> => ({
      path: filePath,
      // read content of file
      content: (await fs.readFile(filePath)).toString('utf-8'),
    })
  );
  // resolve asynchronous file loading
  return Promise.all(filesWithContentPromises);
}

// call function with our test repository
const files = await readMarkdownFiles('./test/resources');
// prints results
files.forEach(({ path }) => console.log(`Read file path: ${path}`));
```

Run the code snippet and examine its result:

```bash
yarn start
```

It should have printed a list of markdown files in your `test/resources` folder:

```bash
Read file path: test/resources/Cat.md
Read file path: test/resources/Dog.md
Read file path: test/resources/Farm.md
Read file path: test/resources/Home.md
```

**Nice. We are set with our files. Now we can really start with file parsing and linking...**

## Parsing Markdown Files

As a second step we have to find all wikilink occurrences that we can use for lining our files. Therefore, we are going to parse the Markdown content and analyze the syntax tree.

We use the library [remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse) for markdown parsing with the [remark-wiki-link](https://github.com/landakram/remark-wiki-link) extension for parsing wikilinks of the format `[[...]]`. We start with the creation of a `WikiLinkNode` type that we need for the `remark-wiki-plugin`. Afterwards, we we create a `SyntaxTree` type we can use as the root type of our parser. Additionally, let us import `visit` - an utility to traverse the syntax tree - see [tree traversal article in TypeScript](https://unifiedjs.com/learn/recipe/tree-traversal-typescript/) for more information about that.

```ts
// ... other imports
import MDAST from 'mdast';
import UNIST from 'unist';
// gonna need visit for our next function
import { visit } from 'unist-util-visit';

interface WikiLinkNode extends UNIST.Node {
  type: 'wikiLink';
  value: string;
  data: {
    alias: string;
    permalink: string;
  };
}
type SyntaxTree = mdast.Root | WikiLinkNode;
```

[Unist](https://github.com/syntax-tree/unist) and [mdast](https://github.com/syntax-tree/mdast) are syntax tree structures, which `remark-parse` uses for parsing markdown.
In the next step, we add two more functions to parse all document links and build a mapping table from all documents and links. Let's start with a function to parse wikilinks from our syntax tree. For this we are going to use the `visit` utility we imported in the previous snippet:

```ts
function parseDocumentLinks(parsedDocumentContent: SyntaxTree) {
  const documentLinks: string[] = [];
  visit(parsedDocumentContent, 'wikiLink', wikiLinkNode => {
    const value = wikiLinkNode.value;
    const alias = wikiLinkNode.data.alias;
    // if a link contains a ":" the remark-wiki-link plugin would parse it as an alias
    // as we are not using the alias feature we re-construct the full link content
    // LIMITATION: this approach does not recognize links that have the same name and alias
    // e.g. name:name - keep that in mind when using this snippet
    const linkName = `${wikiLinkNode.value}${
      value !== alias ? ':' + alias : ''
    }`;
    documentLinks.push(linkName);
  });
  return documentLinks;
}
```

The function returns an array of wikilinks that it finds in the syntax tree. Now, we can add our function for building the document to map links:

```ts
function buildDocumentsLinkMap(files: FileSystemDocument[]) {
  // call the unified parser
  const documentParser = unified().use(remarkParse).use(remarkWikiLink);
  // end result
  const documentLinksMap: { [key: string]: string[] } = {};
  files.forEach(({ path, content }) => {
    // parse each content and put its links into the result map
    const parsedDocumentContent = documentParser.parse(content);
    documentLinksMap[path] = parseDocumentLinks(parsedDocumentContent);
  });
  return documentLinksMap;
}
// print the result
console.log('Document links map: ', buildDocumentsLinkMap(files));
```

Running our program will now yield something like this:

```bash
Read file path: test/resources/Cat.md
Read file path: test/resources/Dog.md
Read file path: test/resources/Farm.md
Read file path: test/resources/Home.md
Documents links map: {
  'test/resources/Cat.md': [ 'Dog' ],
  'test/resources/Dog.md': [],
  'test/resources/Farm.md': [ 'Dog', 'Horse', 'Cow' ],
  'test/resources/Home.md': [ 'Cat', 'Dog' ]
}
```

**Voilà, we successfully parsed our markdown files, extracted links, and created a mapping table. With this mapping table we can easily match documents and links. The next sections discuss how we can implement that mapping.**

## Extracting Document Titles

Our links have to map against some sort of name or title. In our case, we are using the document name of each file as the matching target (you could also use e.g. the first heading in you markdown file). It is only important to create a map of titles that the `documentsLinksMap` can use for linking.
Therefore, we add a new function for extracting document titles:

```ts
function buildDocumentsTitleMap(files: FileSystemDocument[]) {
  const documentTitleMap: { [key: string]: string } = {};
  files.forEach(({ path }) => {
    // extract document title
    const title = /([^\/]+)\.md$/.exec(path)?.[1];
    // verify a consistent mapping
    if (!title) throw new Error(`Could not extract title from path: ${path}`);
    if (documentTitleMap[title] !== undefined)
      throw new Error(
        `Title "${title}" already exists for path "${documentTitleMap[title]}".`
      );
    documentTitleMap[title] = path;
  });
  return documentTitleMap;
}

console.log('Documents title map: ', buildDocumentsTitleMap(files));
```

The regex `([^\/]+)\.md$` returns the title of a document and the first matching group contains the title. Additionally, the function contains two additional checks to guarantee uniqueness of titles.
A run with `yarn start` now prints:

```bash
Read file path: test/resources/Cat.md
Read file path: test/resources/Dog.md
Read file path: test/resources/Farm.md
Read file path: test/resources/Home.md
Documents links map:  {
  'test/resources/Cat.md': [ 'Dog' ],
  'test/resources/Dog.md': [],
  'test/resources/Farm.md': [ 'Dog', 'Horse', 'Cow' ],
  'test/resources/Home.md': [ 'Cat', 'Dog' ]
}
Documents title map:  {
  Cat: 'test/resources/Cat.md',
  Dog: 'test/resources/Dog.md',
  Farm: 'test/resources/Farm.md',
  Home: 'test/resources/Home.md'
}
```

**Well done, with the `documentsLinksMap` and the `documentsTitleMap` we can now interlink our markdown files.**

## Building Master Mappings

You might already wonder how we could actually visualize all the links by using the mapping tables. Thus, for our final mapping we create mappings based on our two original mapping tables and combine them all! They will enable any future algorithms to directly find mappings for links.
Let us add a function that creates our master mapping tables:

```ts
function buildMasterMappings(
  documentTitleToPathMap: { [title: string]: string },
  documentPathToLinksMap: { [path: string]: string[] }
) {
  // create interim mapping tables to easily map entries
  const documentPathToTitleMap: { [path: string]: string } = {};
  Object.entries(documentTitleToPathMap).forEach(
    ([title, path]) => (documentPathToTitleMap[path] = title)
  );
  const documentTitleToLinksMap: { [title: string]: string[] } = {};
  Object.entries(documentPathToLinksMap).forEach(
    ([path, links]) =>
      // map document title to links
      (documentTitleToLinksMap[documentPathToTitleMap[path]] = links)
  );
  // return all mappings
  return {
    documentTitleToPathMap,
    documentPathToLinksMap,
    documentPathToTitleMap,
    documentTitleToLinksMap,
  };
}

console.log(
  'Master mappings: ',
  buildMasterMappings(
    buildDocumentsTitleMap(files),
    buildDocumentsLinkMap(files)
  )
);
```

A re-run of our project with `yarn start` will now yield

```bash
... (output from above)
Master mappings:  {
  documentTitleToPathMap: {
    Cat: 'test/resources/Cat.md',
    Dog: 'test/resources/Dog.md',
    Farm: 'test/resources/Farm.md',
    Home: 'test/resources/Home.md'
  },
  documentPathToLinksMap: {
    'test/resources/Cat.md': [ 'Dog' ],
    'test/resources/Dog.md': [],
    'test/resources/Farm.md': [ 'Dog', 'Horse', 'Cow' ],
    'test/resources/Home.md': [ 'Cat', 'Dog' ]
  },
  documentPathToTitleMap: {
    'test/resources/Cat.md': 'Cat',
    'test/resources/Dog.md': 'Dog',
    'test/resources/Farm.md': 'Farm',
    'test/resources/Home.md': 'Home'
  },
  documentTitleToLinksMap: {
    Cat: [ 'Dog' ],
    Dog: [],
    Farm: [ 'Dog', 'Horse', 'Cow' ],
    Home: [ 'Cat', 'Dog' ]
  }
}
```

**Do You see where this is getting? Hence, we got mappings into all directions with all document titles, paths, and links. Now we just have to use it.**

## Mapping Links to Document Paths

We could utilize these master mappings in various use cases. To look into one in particular, we implement a function to map links to the respective file path:

(Note, that some links don't have a matching target document - our function considers this case as well)

```ts
// we build a global master mapping table
// so we can reuse it later
const globalMasterMapping = buildMasterMappings(
  buildDocumentsTitleMap(files),
  buildDocumentsLinkMap(files)
);

function findDocumentPathOfLink(
  masterMapping: ReturnType<typeof buildMasterMappings>,
  linkName: string
) {
  const linkPath = masterMapping.documentTitleToPathMap[linkName];
  return {
    // return true, if the path exists
    // if false, there is no document for the link name
    existing: linkPath !== undefined,
    path: linkPath,
  };
}
```

Eventually, let us print some results of that function:

```ts
console.log(
  'Path for link Home: ',
  findDocumentPathOfLink(globalMasterMapping, 'Home')
);
console.log(
  'Path for link Farm: ',
  findDocumentPathOfLink(globalMasterMapping, 'Farm')
);
console.log(
  'Path for link Farm: ',
  findDocumentPathOfLink(globalMasterMapping, 'Cow')
);
```

A run with `yarn start` now logs:

```bash
Path for link Home:  { existing: true, path: 'test/resources/Home.md' }
Path for link Farm:  { existing: true, path: 'test/resources/Farm.md' }
Path for link Farm:  { existing: false, path: undefined }
```

**This case shows us how easy it is to utilize the master mapping to quickly find paths for linked notes.**

## Limitations and Outlook

This post covered a basic implementation for processing linked Markdown notes. Feel free to take it as an inspiration and let me know if you do something cool with it.

Finally, I want to close with some questions worth asking when looking at you map of notes:
for sorting documents by the amount of links. Additionally, there are many more cases that I am currently working on that all need this base of interconnected notes:

1. Are all notes connected with each other, or are there outsiders? This might be an indication for lost notes.
2. What links do not have a mapping target? This would be links pointing to non-existent documents.
3. Which links point to a specific document (also known as backlinks)?
4. What notes are the most important ones? E.g. you could sort with the [PageRank Algorithm](https://en.wikipedia.org/wiki/PageRank)

**Enjoy working with your set of networked notes.**

Cheers, Marco

---

_Find code for this article on [GitHub](https://github.com/marcoklein/linked-markdown-notes)_
