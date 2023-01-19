# files-hierarchy

## A simple library for fetching file and folder hierarchy from the local system. The library uses the HTML input element to select files and folders, and returns the hierarchy in the form of a nested map and a flat array. The library also allows customizing the attributes of the input element, such as setting the multiple and webkitdirectory attribute.

## Features

### Fetch file and folder hierarchy using the HTML input element

### Returns both nested and flat hierarchy

### Customizable input element attributes

### TypeScript support

## Usage

```
yarn add files-hierarchy
```

#### or

```
npm i files-hierarchy
```

```js
import { FileHierarchyFetcher } from "file-hierarchy-fetcher";
const fetcher = new FileHierarchyFetcher({
  attributes: {
    multiple: true,
  },
});
fetcher.getFiles().then((data) => {
  console.log(data.nestedFiles);
  console.log(data.flatDirectories);
});

/**flatted directories
 *  {
   "orignalWebkitPath": ".github/workflows/chromatic.yml",
   "type": "FOLDER",
   "path": ".github/",
  },
  {
   "orignalWebkitPath": ".github/workflows/chromatic.yml",
   "type": "FOLDER",
   "path": ".github/workflows/"
  },
  {
   "orignalWebkitPath": ".github/workflows/chromatic.yml",
   "type": "FILE",
   "path": ".github/workflows/chromatic.yml/",
   "file": {}
  }
 ]
 **/
```
