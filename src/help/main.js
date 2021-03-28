// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
  const vscode = acquireVsCodeApi();
  const start = document.getElementById('start');
  
  let settings = {
    threshold: 50000,
    minDuration: 10000,
    minPercentage: 0.6
  }
  
  start.onclick = () => vscode.postMessage({ type: 'run' });
  document.getElementById('rerun').onclick = () => vscode.postMessage({ type: 're-run', settings });

  const threshold = document.getElementById('thresholdDuration');
  const thresholdLabel = document.getElementById('thresholdDurationLabel');
  threshold.oninput = () => {
    settings.threshold = Number(threshold.value) * 1000
    thresholdLabel.innerHTML = `Threshold: <strong>${threshold.value}</strong>ms<br/>(10ms - 100ms):`
  }

  const minDuration = document.getElementById('minDuration');
  const minDurationLabel = document.getElementById('minDurationLabel');
  minDuration.oninput = () => {
    settings.minDuration = Number(minDuration.value) * 100
    minDurationLabel.innerHTML = `Min Span Duration: <strong>${minDuration.value / 100}</strong>ms<br/>(0.5ms - 1.5ms):`
  }

  const minPercentage = document.getElementById('minPercentage');
  const minPercentageLabel = document.getElementById('minPercentageLabel');
  minPercentage.oninput = () => {
    settings.minPercentage = Number(minPercentage.value) / 100
    minPercentageLabel.innerHTML = `minPercentageLabel: <strong>${minPercentage.value}%</strong><br/>(20% - 100%):`
  }


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
