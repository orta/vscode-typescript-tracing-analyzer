import * as vscode from "vscode"
import { Runner } from "./runner"
import { TreeNode } from "./types"

const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'green',
  border: '2px solid white',
})


export const createDecoratorsTracker = (context: vscode.ExtensionContext, newTreeEmitter: Runner["resultsEmitter"]) => {
  let tree: undefined | TreeNode
  newTreeEmitter.event(newTree => tree = newTree)

  let decorations = []
  vscode.window.onDidChangeActiveTextEditor((event) => {
    const file = event?.document.fileName
    if (!file || !tree) return
    console.log("changed file")

    let spans: [file: string, startOffset: number, endOffset: number, depth: number][] = []
    setSpans(tree, 0)

    function setSpans(node: TreeNode, depth: number) {
      if (node.start && node.end && node.start.file === node.end.file && node.start.char && node.end.char) {
        spans.push([node.start.file, node.start.char, node.end.char, depth])
      }
      node.children.forEach(child => {
        setSpans(child, depth + 1)
      });
    }
  })

  
  

  return {
    
  }
}
