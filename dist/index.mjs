var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// index.ts
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2["FILE"] = "FILE";
  FileType2["FOLDER"] = "FOLDER";
  return FileType2;
})(FileType || {});
var FileHierarchyFetcher = class {
  constructor(options) {
    this._attributes = {
      webkitdirectory: true,
      directory: true
    };
    this.getNestedData = (element) => {
      const nestedFiles = /* @__PURE__ */ new Map();
      const flatDirectories = [];
      const pushToFlat = (directory) => {
        flatDirectories.push(__spreadValues({
          orignalWebkitPath: directory.orignalWebkitPath,
          type: directory.type,
          path: directory.path
        }, !!directory.file ? { file: directory.file } : {}));
      };
      for (let file of element.files || []) {
        const paths = file.webkitRelativePath.split("/");
        let currentBranch = nestedFiles;
        let directory = null;
        for (let i = 0; i < paths.length; i++) {
          const path = paths[i];
          if (!currentBranch.has(path)) {
            const isFile = i === paths.length - 1;
            const value = __spreadValues({
              path: `${(directory == null ? void 0 : directory.path) && `${directory.path}/` || ""}${path}${isFile && "" || "/"}`.replace("//", "/"),
              orignalWebkitPath: file.webkitRelativePath,
              type: isFile ? "FILE" /* FILE */ : "FOLDER" /* FOLDER */,
              children: /* @__PURE__ */ new Map()
            }, isFile ? { file } : {});
            pushToFlat(value);
            currentBranch.set(path, value);
          }
          directory = currentBranch.get(path) || null;
          if (directory == null ? void 0 : directory.children)
            currentBranch = directory.children;
        }
      }
      return { nestedFiles, flatDirectories };
    };
    this._attributes = (options == null ? void 0 : options.attributes) ? __spreadValues(__spreadValues({}, this._attributes), options.attributes) : this._attributes;
  }
  getFiles() {
    return new Promise((resolve, reject) => {
      try {
        const file = document.createElement("input");
        file.type = "file";
        for (const key in this._attributes) {
          file.setAttribute(key, this._attributes[key]);
        }
        file.onchange = (e) => resolve(this.getNestedData(e.target));
        file.click();
      } catch (e) {
        reject(e);
      }
    });
  }
};
export {
  FileHierarchyFetcher,
  FileType
};
