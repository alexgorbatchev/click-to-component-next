# <ClickToComponent /> Next (aka fork)

[![npm](https://img.shields.io/npm/v/click-to-react-component-next)](https://www.npmjs.com/package/click-to-react-component-next)
[![Release](https://github.com/alexgorbatchev/click-to-component-next/actions/workflows/release.yml/badge.svg)](https://github.com/alexgorbatchev/click-to-component-next/actions/workflows/release.yml)

<kbd>Option+Click</kbd> or <kbd>Alt+Click</kbd> a Component in the browser to **instantly** goto the source in your editor.

![Next.js Demo](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/next.gif)

## Features

- <kbd>Option+Click</kbd> or <kbd>Alt+Click</kbd> opens the immediate Component's source
- <kbd>Option+RightClick</kbd> or <kbd>Alt+RightClick</kbd> opens a context menu with the parent Components' `props`, `fileName`, `columnNumber`, and `lineNumber`

  > ![props](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/props.png)

- Works with frameworks like [Next.js](https://nextjs.org/),
  [Create React App](https://create-react-app.dev/),
  & [Vite](https://github.com/vitejs/vite/tree/main/packages/plugin-react)
  that use [@babel/plugin-transform-react-jsx-source](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source)
- Works with [RSBuild](https://rsbuild.dev/) with [plugin-react](https://rsbuild.dev/guide/framework/react) out of the box
- Supports `vscode` & `vscode-insiders` & `webstorm` & `cursor` [URL handling](https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls)
- Automatically **tree-shaken** from `production` builds
- Keyboard navigation in context menu (e.g. <kbd>←</kbd>, <kbd>→</kbd>, <kbd>⏎</kbd>)
- More context & faster than using React DevTools:

  > ![React DevTools](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/devtools.png)

## Installation

<details>
<summary>npm</summary>

```shell
npm install click-to-react-component-next
```

</details>

<details>
<summary>pnpm</summary>

```shell
pnpm add click-to-react-component-next
```

</details>

<details>
<summary>yarn</summary>

```shell
yarn add click-to-react-component-next
```

</details>

Even though `click-to-react-component-next` is added to `dependencies`, [tree-shaking](https://esbuild.github.io/api/#tree-shaking) will remove `click-to-react-component-next` from `production` builds.

## Usage

<details>
<summary>Create React App</summary>

[/src/index.js](https://github.com/alexgorbatchev/click-to-component-next/blob/main/apps/cra/src/index.js#L11)

```diff
+import { ClickToComponent } from 'click-to-react-component-next';
 import React from 'react';
 import ReactDOM from 'react-dom/client';
 import './index.css';
@@ -8,7 +7,6 @@ import reportWebVitals from './reportWebVitals';
 const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(
   <React.StrictMode>
+    <ClickToComponent />
     <App />
   </React.StrictMode>
 );
```

> ![Create React App Demo](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/cra.gif)

</details>

<details>
<summary>Next.js</summary>

[pages/\_app.tsx](https://github.com/alexgorbatchev/click-to-component-next/blob/main/apps/next/pages/_app.tsx#L8)

```diff
+import { ClickToComponent } from 'click-to-react-component-next'
 import type { AppProps } from 'next/app'
 import '../styles/globals.css'

 function MyApp({ Component, pageProps }: AppProps) {
   return (
     <>
+      <ClickToComponent />
       <Component {...pageProps} />
     </>
   )
```

> ![Next.js Demo](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/next.gif)

</details>

<details>
<summary>Vite</summary>

```diff
+import { ClickToComponent } from "click-to-react-component-next";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
+   <ClickToComponent />
  </React.StrictMode>
);
```

> ![Vite Demo](https://raw.githubusercontent.com/alexgorbatchev/click-to-component-next/main/.github/vite.gif)

</details>

<details>
<summary>Docusaurus</summary>

    npm install @babel/plugin-transform-react-jsx-source

babel.config.js:

```js
module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    ...(process.env.BABEL_ENV === 'development'
      ? ['@babel/plugin-transform-react-jsx-source']
      : []),
  ],
}
```

src/theme/Root.js:

```js
import { ClickToComponent } from 'click-to-react-component-next'
import React from 'react'

// Default implementation, that you can customize
export default function Root({ children }) {
  return (
    <>
      <ClickToComponent />
      {children}
    </>
  )
}
```

</details>

### `editor`

By default, the `editor` is set to [`vscode`](https://code.visualstudio.com/).

But you can choose between `webstorm`, `cursor` and `vscode-insider` too.

```diff
-<ClickToComponent />
+<ClickToComponent editor="vscode-insiders" />
```

If you are using another editor, you can use the `getEditorUrl` prop to define your own editor.

### `getEditorUrl`

If you want to define your own editor, you can use the `getEditorUrl` prop to define your own editor.
This function will be called with the `path`, `line`, and `column` of the target file.

```tsx
<ClickToComponent
  getEditorUrl={(path, line, column) => {
    return `my-editor://open?file=${path}&line=${line}&column=${column}`
  }}
/>
```

## Run Locally

Clone the project

```shell
gh repo clone alexgorbatchev/click-to-component-next
```

Go to the project directory

```shell
cd click-to-component
```

Install dependencies

```shell
pnpm install
```

Run one of the examples:

<details>
<summary>Create React App</summary>

```shell
cd apps/cra
pnpm start
```

</details>

<details>
<summary>Next.js</summary>

```shell
cd apps/next
pnpm dev
```

</details>
