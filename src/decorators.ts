import * as vscode from "vscode"
import { Runner } from "./runner"
import { TreeNode, TreeNodeJSON } from "./types"

const decorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'green',
  border: '2px solid white',
})


export const createDecoratorsTracker = (context: vscode.ExtensionContext, newTreeEmitter: Runner["resultsEmitter"]) => {
  let tree: undefined | TreeNodeJSON

  newTreeEmitter.event(newTree => {
    tree = newTree
    updateDecorators()
  })

  let decorations = []

  const updateDecorators = () => {
    if(!tree) return
    console.log("devo", tree)


    function setSpans(node: TreeNode, depth: number) {
      console.log(node, depth)
      if (node.start && node.end && node.start.file === node.end.file && node.start.char && node.end.char) {
        spans.push([node.start.file, node.start.char, node.end.char, depth])
      }

      node.children.forEach(child => {
        setSpans(child, depth + 1)
      });
    }

    let spans: [file: string, startOffset: number, endOffset: number, depth: number][] = []
    console.log(1)
    tree.forEach(t => setSpans(t.repo, 0))
    console.log(2)

    spans.forEach(span => {
      console.log({ span })
    })

    console.log({ spans })
    console.log("wah?")
    
  }

  vscode.window.onDidChangeActiveTextEditor((event) => {
    const file = event?.document.fileName
    if (!file || !tree) return
    console.log("changed file")
    updateDecorators()
  })

  console.log("made")
  

  return {
    
  }
}
