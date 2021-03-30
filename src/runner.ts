import * as vscode from "vscode"
import * as cp from 'child_process';
import * as path from 'path';
import * as os from 'os';
import type { TreeNode, TreeNodeJSON } from "./types";

import { existsSync, readFileSync } from "fs";

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
  const emitter = new vscode.EventEmitter<TreeNodeJSON>();
  let lastFolder: undefined | vscode.Uri

  const run = async (tsTrace: vscode.Uri, settings: any) => {
    const tmpDir = path.join(os.tmpdir(), 'ts-analyze-trace.json')
    const tracePath = "/Users/ortatherox/dev/typescript/ts-analyze-trace/bin/ts-analyze-trace"
    try {
      const opts: string[] = []
      Object.keys(settings).forEach(key => {
        opts.push(`--${key}`, settings[key])
      })
      const cmd = `node ${tracePath} ${tsTrace.fsPath} --json ${tmpDir} ${opts.join(" ")}`
      await execShell(cmd)
    } catch (error) {
      console.log(error)
    }

    if (existsSync(tmpDir)) {
      const json = JSON.parse(readFileSync(tmpDir, "utf8"))
      console.log(json)
      lastFolder = tsTrace 
      emitter.fire(json)
    }
  }

  return {
    resultsEmitter: emitter,
    runOnFolder: async (folderUri: vscode.Uri) => {
      run(folderUri, {})

    },
    rerun: (settings: any) => {
      if (lastFolder) run(lastFolder,  settings)
    }
 }
}

export type Runner = ReturnType<typeof createRunner>
