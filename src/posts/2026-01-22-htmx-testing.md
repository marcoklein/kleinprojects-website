---
tags: [htmx]
title: Testing HTMX 2 with Happy Dom
date: 2026-01-22
---

I have a long running e2e test setup with Playwright that takes around 30 seconds to complete on my local computer and around two minutes in CI. Since I have adopted HTMX I am trying to find a better approach for testing HTMX interactivity without having to work in a real, slow browser environment.

The ~400 other unit tests execute in under a second - why can't I also run interactive tests via HTMX in under a second?

So I gave (Happy Dom](https://github.com/capricorn86/happy-dom) a shot as it's supposed to be faster then the other popular JSDOM alternatives. However, I hit some limitations in the process. First off, Happy Dom does not implement the [XPathEvaluator](https://developer.mozilla.org/de/docs/Web/API/XPathEvaluator) that HTMX 2 needs:

```js
ReferenceError: XPathEvaluator is not defined
      at <anonymous> (/.../public/libs/htmx-2.0.7.min.js:1:24685)
```

Since I was not using XPaths at all I mocked the XPathEvaluator implementation with a stub (see code appendix).

In the test itself, I just apply the html to the Happy Dom document like this:

```ts
document.body.innerHTML = html;
```

However, I faced a second issue with an `TypeError: window[PropertySymbol.dispatchError] is not a function.` error which turns out as a Happy Dom limitation due to the `onclick` listeners that are directly assigned in some places:

```html
<button onclick="window.scrollTo({top: 0, behavior: 'smooth'})"></button>
```

I had to refactor those instances, in my case to [hyperscript](https://hyperscript.org/) which looks like this:

```html
<button _="on click go to the top of the body smoothly"></button>
```

And then it works! With bun the initial test ran in around _20ms_ and the existing Playwright test in around `2000ms` making the non-browser version around 100x faster on first sight.

To not execute too many scripts I added an allow-list of scripts that I wanted to execute (see code appendix).

## Conclusion

I am happy that I am able to test HTMX interactions without having to spin up a full browser. Going forward I hope this can guide someone into a better testing setup for HTMX applications.

I'll now wander off to migrate more tests into that new setup.

## Code Appendix

**This is the code for the stub:**

```ts
class XPathEvaluatorPolyfill {
  createExpression(expression: string): XPathExpression {
    return new XPathExpressionPolyfill(expression);
  }
}

class XPathExpressionPolyfill {
  constructor(private expression: string) {}

  evaluate(
    contextNode: Node,
    type: number,
    result: XPathResult | null,
  ): XPathResult {
    // For now, return an empty result since HTMX primarily uses CSS selectors
    // and only uses XPath for advanced attribute queries
    return new XPathResultPolyfill([]) as unknown as XPathResult;
  }
}

class XPathResultPolyfill {
  resultType = 5;
  private index = 0;

  // Add required XPathResult properties (unused but needed for interface)
  booleanValue = false;
  invalidIteratorState = false;
  numberValue = 0;
  singleNodeValue = null;
  stringValue = '';
  snapshotLength = 0;

  ANY_TYPE = 0;
  NUMBER_TYPE = 1;
  STRING_TYPE = 2;
  BOOLEAN_TYPE = 3;
  UNORDERED_NODE_ITERATOR_TYPE = 4;
  ORDERED_NODE_ITERATOR_TYPE = 5;
  UNORDERED_NODE_SNAPSHOT_TYPE = 6;
  ORDERED_NODE_SNAPSHOT_TYPE = 7;
  ANY_UNORDERED_NODE_TYPE = 8;
  FIRST_ORDERED_NODE_TYPE = 9;

  constructor(private nodes: Node[]) {
    this.snapshotLength = nodes.length;
  }

  iterateNext(): Node | null {
    if (this.index < this.nodes.length) {
      return this.nodes[this.index++];
    }
    return null;
  }

  snapshotItem(index: number): Node | null {
    return this.nodes[index] || null;
  }
}

// Adding to global
globalThis.XPathEvaluator = XPathEvaluatorPolyfill;
```

**Happy Dom setup as global registration:**

```ts
// Whitelist of scripts that should be loaded during tests
// Scripts not in this list will be blocked to prevent errors from missing browser APIs
const SCRIPT_WHITELIST = ['htmx', 'hyperscript'];

// Helper to check if a script path matches the whitelist
const isScriptAllowed = (pathname: string): boolean => {
  return SCRIPT_WHITELIST.some(allowed => pathname.includes(allowed));
};

// App is a mocked implementation of the web server (in this case Hono with Bun)
const app = createApplication();

GlobalRegistrator.register({
  settings: {
    enableJavaScriptEvaluation: true,
    suppressInsecureJavaScriptEnvironmentWarning: true,
    disableCSSFileLoading: true,
    disableJavaScriptFileLoading: false,
    handleDisabledFileLoadingAsSuccess: true,
    fetch: {
      virtualServers: [
        {
          url: 'http://test.local/libs/',
          directory: './public/libs',
        },
      ],
      interceptor: {
        beforeAsyncRequest: async ({ request, window }) => {
          const url = new URL(request.url);

          if (url.pathname.startsWith('/libs/')) {
            if (isScriptAllowed(url.pathname)) {
              // Let virtualServers handle it
              return undefined;
            } else {
              // Return empty response to prevent script execution errors
              return new window.Response('', {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/javascript' },
              });
            }
          }

          // Build headers object from happy-dom's headers
          const headersObj: Record<string, string> = {};
          request.headers.forEach((value: string, key: string) => {
            headersObj[key] = value;
          });

          // Forward request to Hono app using URL string
          const honoResponse = await app.request(url.pathname, {
            method: request.method,
            headers: headersObj,
            body: request.body as unknown as BodyInit,
          });

          // Convert Hono Response to happy-dom Response
          const responseText = await honoResponse.text();

          const responseHeaders: Record<string, string> = {};
          honoResponse.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          const happyDomResponse = new window.Response(responseText, {
            status: honoResponse.status,
            statusText: honoResponse.statusText,
            headers: responseHeaders,
          });

          return happyDomResponse;
        },
      },
    },
  },
});
```
