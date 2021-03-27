// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();
  const start = document.getElementById('start');
  start.onclick = () => vscode.postMessage({ type: 'start' });

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
        case 'step2': {
          document.getElementById("step1").remove()
          document.getElementById("step2").style.display = "block"
          break
        }

        case 'step3': {
          document.getElementById("step2").remove()
          document.getElementById("step3").style.display = "block"
          break
        }
      }
  });

  vscode.postMessage({ type: 'ready' });  
}());
