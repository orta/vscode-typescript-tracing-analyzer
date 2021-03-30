export type TreeNodeJSON = Array<{
  trace: string;
  configFilePath: string;
  repo: TreeNode;
}>;

export type TreeNode = {
  type: string;
  time?: string;
  message: string;
  terseMessage: string;
  start?: {
    file: string;
    char?: number;
  };
  end?: {
    file: string;
    char?: number;
  };
  children: TreeNode[];
};
