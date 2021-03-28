import * as vscode from 'vscode';
import * as path from 'path';
import { Runner } from '../runner';
import { TreeNode } from '../types';

export class ResultsProvider implements vscode.TreeDataProvider<TreeNode> {

	private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | null> = new vscode.EventEmitter<TreeNode | null>();
	readonly onDidChangeTreeData: vscode.Event<TreeNode | null> = this._onDidChangeTreeData.event;
	private tree: TreeNode | undefined;

	constructor(private context: vscode.ExtensionContext, runEventEmitter: Runner["resultsEmitter"]) {
		runEventEmitter.event((e) => this.updateWithRootTreeNode(e))
	}

	updateWithRootTreeNode(node: TreeNode) {
		console.log("updateWithRootTreeNode")
		this.tree = node
		this._onDidChangeTreeData.fire(null)
	}

	getChildren(node: TreeNode): Thenable<TreeNode[]> {
		if (!node) {
			if (this.tree) {
				return Promise.resolve([this.tree])
			} else {
				return Promise.resolve([])
			}
		} else {
			let kids = node.children
			if (kids.length === 1 && kids[0].children.length === 1 && kids[0].start?.file && node.type !== "hot-spots") {
				kids = [{ ...kids[0], terseMessage: "Go", children: [] }, kids[0]]
			}
			return Promise.resolve(kids)
		}
	}

	getTreeItem(node: TreeNode): vscode.TreeItem {
    const hasChildren = node.children.length
    const collapsed = hasChildren ? true ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
    const treeItem: vscode.TreeItem = new vscode.TreeItem(node.terseMessage, collapsed);
		treeItem.description = node.time

		if (node.start) {
			const fileUri = vscode.Uri.parse('file://' + node.start.file)
			treeItem.resourceUri = fileUri

			const suffix = node.start.char ? ` at position ${node.start.char}` : ""
			treeItem.command = {
				command: 'vscode.open',
				title: `Open ${path.basename(node.start.file)}${suffix}`,
				arguments: [fileUri, node.start.char]
			};
		}
    return treeItem;
	}
}
