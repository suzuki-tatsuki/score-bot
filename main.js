const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const XLSX = require('xlsx');

let mainWindow;

// エクセルに挿入する行を管理するための変数
let row = 1;

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

// 初期起動処理
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 全てのウィンドウが閉じられたらアプリを終了する
app.on('window-all-closed', () => {
	app.quit();
});

// IPC通信でボタンのクリックイベントを受け取り、Excelファイルを書き換える
ipcMain.on('edit-excel', (event, arg) => {
	console.log("start ipcMain");
    const filePath = 'data.xlsx'; // 読み込みたいExcelファイルのパス

    // 既存のExcelファイルを読み込み
    let workbook = XLSX.readFile(filePath);

    // シートを取得
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // 追加データを作成
    let newData = [["0本場", 8000, -2000, -2000, -4000]];

    // 既存シートに新しいデータを追加
    XLSX.utils.sheet_add_aoa(worksheet, newData, { origin: { r: row, c: 0 }});
	row++;	// 次に書き換える行を更新する

    // ファイルに上書き保存
    XLSX.writeFile(workbook, filePath);

    // 処理が完了したことを通知
    event.reply('excel-updated', 'Excelファイルが更新されました');
});
