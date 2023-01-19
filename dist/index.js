"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var pkg_demo_exports = {};
__export(pkg_demo_exports, {
  FileHierarchyFetcher: () => FileHierarchyFetcher,
  FileType: () => FileType
});
module.exports = __toCommonJS(pkg_demo_exports);
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
        for (let path of paths) {
          if (!currentBranch.has(path)) {
            const isFile = path.includes(".");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileHierarchyFetcher,
  FileType
});
