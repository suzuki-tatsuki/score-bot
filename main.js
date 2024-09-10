const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const XLSX = require('xlsx');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ipcRendererを使うための設定
            nodeIntegration: true, // これを有効にしないと、requireが使えない
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

	// ウィンドウを閉じたらアプリを終了
    mainWindow.on('closed', function () {
        mainWindow = null; // メモリリーク防止のため、ウィンドウオブジェクトを破棄
        if (process.platform !== 'darwin') {
            app.quit(); // WindowsやLinuxの場合にアプリ全体を終了
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
	app.quit();
});

// IPC通信でボタンのクリックイベントを受け取り、Excelファイルを書き換える
ipcMain.on('edit-excel', (event, arg) => {
    // 新しいExcelファイルの作成
    let workbook = XLSX.utils.book_new();
    
    // シートデータを作成
    let data = [
        ['ID', 'Name', 'Score'],
        [1, 'Alice', 90],
        [2, 'Bob', 85],
        [3, 'Charlie', 78]
    ];

    let worksheet = XLSX.utils.aoa_to_sheet(data);

    // ワークブックにシートを追加
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Excelファイルとして保存
    XLSX.writeFile(workbook, path.join(__dirname, 'output.xlsx'));

    // 処理が完了したことをレンダラープロセスに通知
    event.reply('excel-done', 'Excelファイルに書き込みました');
});
