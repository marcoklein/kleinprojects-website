---
title: Scoping a Hobby Project - Personal Learnings
date: 2022-04-16
tags: [project]
---


<p>This post is meant to be a small self-reflection for a personal note taking application called Noteberry.</p>
<p>Noteberry is a hobby project I have been working on during evenings or weekends for the past months (think I started 1.5 years ago in around December 2020). It should have been <em>"a toolbox for working with block-based linked markdown notes"</em> (<a aria-label-position="top" aria-label="https://github.com/marcoklein/noteberry" rel="noopener" class="external-link" href="https://github.com/marcoklein/noteberry" target="_blank">GitHub Repo</a>). It was meant to be an application to deal with my local markdown notes.</p>
<p>However, I escalated a little too much in scope and built first of all an editor with VIM support to support easy editing. Then I continued developing a parser for markdown with wikilinks (<code>[[wikilink]]</code>) and so on... I realised, that there were already applications that would implement exactly the thing that I was trying to develop (like <a aria-label-position="top" aria-label="http://logseq.com" rel="noopener" class="external-link" href="http://logseq.com" target="_blank">LogSeq</a>, <a aria-label-position="top" aria-label="http://obsidian.md" rel="noopener" class="external-link" href="http://obsidian.md" target="_blank">Obsidian</a> or <a aria-label-position="top" aria-label="https://github.com/srid/neuron" rel="noopener" class="external-link" href="https://github.com/srid/neuron" target="_blank">Neuron</a>. And I also realised that they have either spent a very long time developing it or have a whole team behind it.</p>
<p>Recreating any of these applications wasn't my first intention when starting the project. I just wanted to deal with my local markdown files. However, over the past couple of months scope was increasing unexpectedly because my goal for Noteberry was not clear.</p>
<p>Despite of this, I learned a lot of technical things:</p>
<ul>
<li>Work with syntax parsing and build a parser with <a aria-label-position="top" aria-label="https://remark.js.org/" rel="noopener" class="external-link" href="https://remark.js.org/" target="_blank">Remark</a> to parse markdown files (published a small article about it <a aria-label-position="top" aria-label="https://kleinprojects.com/linking-markdown-notes-with-typescript/" rel="noopener" class="external-link" href="https://kleinprojects.com/linking-markdown-notes-with-typescript/" target="_blank">here</a>)</li>
<li>Develop an editor extension with <a aria-label-position="top" aria-label="https://codemirror.net/6/" rel="noopener" class="external-link" href="https://codemirror.net/6/" target="_blank">CodeMirror 6</a> to create a text editor with VIM support</li>
<li>Setup a monorepo with <a aria-label-position="top" aria-label="https://lerna.js.org/" rel="noopener" class="external-link" href="https://lerna.js.org/" target="_blank">Lerna</a> to manage and publish all packages from one repository</li>
<li>Setup a working CI/CD Flow with <a aria-label-position="top" aria-label="https://pages.github.com/" rel="noopener" class="external-link" href="https://pages.github.com/" target="_blank">GitHub Pages</a> to test publish without any more effort</li>
<li>Learn how the new NodeJS <a aria-label-position="top" aria-label="https://nodejs.org/api/esm.html" rel="noopener" class="external-link" href="https://nodejs.org/api/esm.html" target="_blank">Ecma Script Modules (ESM)</a> work with <a aria-label-position="top" aria-label="https://www.typescriptlang.org/" rel="noopener" class="external-link" href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> to write modern and fast code</li>
</ul>
<p>Nonetheless, I realised that I have not produced something that I can actually <strong>use</strong>. I have rather deepened my knowledge about the above topics.</p>
<p>For my future projects I am taking this question with me:</p>
<blockquote>
<p>What is the problem that I am trying to solve?</p>
</blockquote>
<p>And then will not directly solve it but rather look for existing solutions:</p>
<blockquote>
<p>What solutions already exist to solve it?</p>
</blockquote>
<p>I was neither aware of Obsidian nor LogSeq when starting out but the thing that I was trying to built was just too large to solve it with a one person show in a timely manner, so:</p>
<blockquote>
<p>Can I produce results in a timely manner?</p>
</blockquote>
<p>With these questions I should have a good foundation for scoping future (hobby) projects.</p>
<p>Nonetheless, development and implementing stuff should also be fun and I will not only create projects to solve specific issues. I will also keep that in mind :)</p>
    
