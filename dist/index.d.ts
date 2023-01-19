declare enum FileType {
    FILE = "FILE",
    FOLDER = "FOLDER"
}
type Directory = {
    path: string;
    children?: Filehierarchy;
    type: FileType;
    orignalWebkitPath: string;
    file?: File;
};
type Filehierarchy = Map<String, Directory>;
declare class FileHierarchyFetcher {
    private _attributes;
    /**
     *
     * @param options ?: Partial<{ _attributes: Record<string, any>; }> input element attributes
     */
    constructor(options?: Partial<{
        _attributes: Record<string, any>;
    }>);
    /**
     *
     * @returns Promise<{ nestedFiles: Filehierarchy; flatDirectories: Array<Directory>; }> return files/folders hierarchy
     */
    getFiles(): Promise<{
        nestedFiles: Filehierarchy;
        flatDirectories: Array<Directory>;
    }>;
    private getNestedData;
}

export { Directory, FileHierarchyFetcher, FileType, Filehierarchy };
