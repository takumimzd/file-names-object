# file-names-object

A simple CLI tool to generate an object of public directory file paths for TypeScript.

### Usage

```
yarn fno --dirPath <directory-path> --outputPath <output-file-path>
```

### Option

- --dirPath, -d: The directory to scan for files (required).
- --outputPath, -o: The file where the paths should be saved (required).


### Result

````
export const fileNames = {
  "demo/demo2/index.ts": "/demo/demo2/index.ts",
  "demo/index.ts": "/demo/index.ts",
  "index.js": "/index.js"
} as const

````

### npm
https://www.npmjs.com/package/file-names-object
