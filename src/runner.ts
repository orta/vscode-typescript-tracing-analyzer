import * as vscode from "vscode"
import * as cp from 'child_process';
import type { TreeNode } from "./types";

import {example} from "./vendor/example1"

const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out);
        });
    });

export const createRunner = () => {
  const emitter = new vscode.EventEmitter<TreeNode>();

  return {
    resultsEmitter: emitter,
    runOnFolder: (folderUri: vscode.Uri) => {
      // execShell("")
      emitter.fire(example)
    }
 }
}

export type Runner = ReturnType<typeof createRunner>
