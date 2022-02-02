export {};

interface AnalyzeResult {
  exist: boolean;
  isRoot: boolean;
  name: string;
  object: FSNode | null;
  parentExists: boolean;
  parentObject: FSNode;
  parentPath: string;
  path: string;
}

interface NodeOps {
  getattr: (node: any) => {};
  lookup: (parent: any, name: any) => {};
  mknod: (parent: any, name: any, mode: any, dev: any) => {};
  readdir: (node: any) => {};
  rename: (old_node: any, new_dir: any, new_name: any) => {};
  rmdir: (parent: any, name: any) => {};
  setattr: (node: any, attr: any) => {};
  symlink: (parent: any, newname: any, oldpath: any) => {};
  unlink: (parent: any, name: any) => {};
}

interface FSNode {
  contents: Record<string, FSNode>;
  id: number;
  mode: number;
  mount: {};
  name: string;
  name_next: string;
  node_ops: NodeOps;
  parent: FSNode;
  rdev: number;
  stream_ops: {
    llseek: (stream: any, offset: any, whence: any) => {};
  };
  timestamp: number;
  isDevice: boolean;
  isFolder: boolean;
  read: boolean;
  write: boolean;
}

interface FileSystem {
  analyzePath: (path: string) => AnalyzeResult;
}

declare const FS: FileSystem;
