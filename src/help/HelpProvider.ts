import * as vscode from 'vscode';
import * as fs from 'fs';
import type { Runner } from '../runner';

export class HelpProvider implements vscode.WebviewViewProvider {
	constructor(private readonly _extensionUri: vscode.Uri, private runner: Runner) { }

	public resolveWebviewView( webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		webviewView.webview.onDidReceiveMessage(async data => {
			switch (data.type) {
				case 'ready': {
					const root = vscode.workspace.workspaceFolders![0].uri
					const tsTrace = vscode.Uri.joinPath(root, 'tsTrace');
					if (fs.existsSync(tsTrace.fsPath)) {
						webviewView.webview.postMessage({ command: 'step2' });
						this.runner.runOnFolder(tsTrace)
					}
					break
				}

				case 'start': {
						const root = vscode.workspace.workspaceFolders![0].uri
				  	const uri = await vscode.window.showOpenDialog({ canSelectMany:false, canSelectFolders:true, canSelectFiles: false, defaultUri: root })
						if (!uri) return

						webviewView.webview.postMessage({ command: 'step2' });
						this.runner.runOnFolder(uri[0])
						break;
					}
			}
		});
		this.runner.resultsEmitter.event(() => {
			webviewView.webview.postMessage({ command: 'step3' });
		})


		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'help', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'help', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'help', 'vscode.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
			</head>
			<body>
				<div id='step1'>
					<h3>Welcome to the tsc tracing analyzer</h3>
					<br/>
					<p>To get started you need to run TypeScript 4.2's new CLI flag <code>--generateTrace [path]</code> and tell this extension where that folder is.</code></p>
					<br/>
					<button id='start'>Open trace folder</button>
				</div>
				
				<div id='step2'>
					<h3>Starting analysis</h3>
					<br/>
					<p>Depending on your project size, this could take a while...</p>
					<br/>
				</div>

				<div id='step3'>
					<h3>Analysis done</h3>
					<br/>
					<p>See below for information</p>
					<br/>
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

