enum FileType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}
type Directory = {
  path: string;
  children?: Filehierarchy;
  type: FileType;
  orignalWebkitPath: string;
  file?: File;
};
type Filehierarchy = Map<String, Directory>;
class FileHierarchyFetcher {
  private _attributes: Record<string, any> = {
    webkitdirectory: true,
    directory: true,
  };
  /**
   *
   * @param options ?: Partial<{ _attributes: Record<string, any>; }> input element attributes
   */
  constructor(
    options?: Partial<{
      _attributes: Record<string, any>;
    }>
  ) {
    this._attributes = options?._attributes
      ? { ...this._attributes, ...options._attributes }
      : this._attributes;
  }
  /**
   *
   * @returns Promise<{ nestedFiles: Filehierarchy; flatDirectories: Array<Directory>; }> return files/folders hierarchy
   */
  public getFiles(): Promise<{
    nestedFiles: Filehierarchy;
    flatDirectories: Array<Directory>;
  }> {
    return new Promise((resolve, reject) => {
      try {
        const file: HTMLInputElement = document.createElement("input");
        file.type = "file";
        for (const key in this._attributes) {
          file.setAttribute(key, this._attributes[key]);
        }
        file.onchange = (e: Event) =>
          resolve(this.getNestedData(e.target as HTMLInputElement));
        file.click();
      } catch (e) {
        reject(e);
      }
    });
  }
  // public flatDirectories(filehierarchy: Filehierarchy): Array<Directory> {
  //   const directories: Array<Directory> = [];
  //   const pushToDirectory = (directory: Directory) => {
  //     directories.push({
  //       orignalWebkitPath: directory.orignalWebkitPath,
  //       type: directory.type,
  //       path: directory.path,
  //       ...(!!directory.file ? { file: directory.file } : {}),
  //     });
  //   };
  //   for (const [, directory] of filehierarchy) {
  //     pushToDirectory(directory);
  //     let children = [directory.children];
  //     while (children.length) {
  //       let currentChildren = children.pop();
  //       for (const [_, dir] of currentChildren!) {
  //         pushToDirectory(dir);
  //         if (dir.children?.size) children.push(dir.children);
  //       }
  //     }
  //   }
  //   return directories;
  // }

  private getNestedData = (
    element: HTMLInputElement
  ): { nestedFiles: Filehierarchy; flatDirectories: Array<Directory> } => {
    const nestedFiles: Filehierarchy = new Map();
    const flatDirectories: Array<Directory> = [];
    const pushToFlat = (directory: Directory) => {
      flatDirectories.push({
        orignalWebkitPath: directory.orignalWebkitPath,
        type: directory.type,
        path: directory.path,
        ...(!!directory.file ? { file: directory.file } : {}),
      });
    };
    for (let file of element.files || []) {
      const paths = file.webkitRelativePath.split("/");
      let currentBranch: Filehierarchy = nestedFiles;
      let directory: Directory | null = null;
      for (let path of paths) {
        if (!currentBranch.has(path)) {
          const isFile = path.includes(".");
          const value = {
            path: `${(directory?.path && `${directory.path}/`) || ""}${path}${
              (isFile && "") || "/"
            }`.replace("//", "/"),
            orignalWebkitPath: file.webkitRelativePath,
            type: isFile ? FileType.FILE : FileType.FOLDER,
            children: new Map(),
            ...(isFile ? { file: file } : {}),
          };
          pushToFlat(value);
          currentBranch.set(path, value);
        }
        directory = currentBranch.get(path) || null;
        if (directory?.children) currentBranch = directory.children;
      }
    }
    return { nestedFiles, flatDirectories };
  };
}
export { FileHierarchyFetcher, FileType, Filehierarchy, Directory };
