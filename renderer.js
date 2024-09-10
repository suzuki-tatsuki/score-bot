const { ipcRenderer } = require('electron');

// ボタンのクリックイベント
document.getElementById('edit-excel').addEventListener('click', () => {
    ipcRenderer.send('edit-excel');
});

// 処理完了の通知を受け取る
ipcRenderer.on('excel-done', (event, message) => {
    document.getElementById('status').textContent = message;
});
