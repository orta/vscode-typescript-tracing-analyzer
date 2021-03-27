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
			return Promise.resolve(node.children)
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
