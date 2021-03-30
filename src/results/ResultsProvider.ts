import * as vscode from "vscode";
import * as path from "path";
import { Runner } from "../runner";
import { TreeNode, TreeNodeJSON } from "../types";

export class ResultsProvider implements vscode.TreeDataProvider<TreeNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | null> = new vscode.EventEmitter<TreeNode | null>();
  readonly onDidChangeTreeData: vscode.Event<TreeNode | null> = this._onDidChangeTreeData.event;
  private root: TreeNodeJSON | undefined;

  constructor(private context: vscode.ExtensionContext, runEventEmitter: Runner["resultsEmitter"]) {
    runEventEmitter.event((e) => this.updateWithRootTreeNodes(e));
  }

  updateWithRootTreeNodes(node: TreeNodeJSON) {
    this.root = node;
    this._onDidChangeTreeData.fire(null);
  }

  getChildren(node: TreeNode): Thenable<TreeNode[]> {
    if (!node) {
      if (this.root) {
        return Promise.resolve(this.root.map(t => t.repo));
      } else {
        return Promise.resolve([]);
      }
    } else {
      let kids = Array.isArray(node) ? node : node.children;
      if (kids.length === 1 && kids[0].children.length === 1 && kids[0].start?.file && node.type !== "hot-spots") {
        kids = [{ ...kids[0], terseMessage: "Go", children: [] }, kids[0]];
      }
      return Promise.resolve(kids);
    }
  }

  getTreeItem(node: TreeNode): vscode.TreeItem {
    if (Array.isArray(node)) {
      const collapsed = vscode.TreeItemCollapsibleState.Expanded;
      const treeItem: vscode.TreeItem = new vscode.TreeItem("Project", collapsed);
      return treeItem;
    }

    const hasChildren = node.children.length;
    const collapsed = hasChildren ? true ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
    const treeItem: vscode.TreeItem = new vscode.TreeItem(node.terseMessage, collapsed);
    treeItem.description = node.time;

    if (node.start) {
      const fileUri = vscode.Uri.parse("file://" + node.start.file);
      treeItem.resourceUri = fileUri;

      const suffix = node.start.char ? ` at position ${node.start.char}` : "";
      treeItem.command = {
        command: "vscode.open",
        title: `Open ${path.basename(node.start.file)}${suffix}`,
        arguments: [fileUri, node.start.char],
      };
    }
    return treeItem;
  }
}
