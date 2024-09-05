const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const xlsx = require('xlsx');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 1000,
		webPreferences: {
			preload: path.join(__dirname, 'renderer.js'),
			nodeIntegration: false,
			contextIsolation: true,
		}
	});

	win.loadFile('index.html');

	// ウィンドウが閉じられたときにアプリケーションを終了する
	win.on('closed', () => {
		console.log("メインウィンドウが閉じられたのでアプリを終了します");
		app.quit();
	});
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		console.log("全てのウィンドウが閉じられたのでアプリを終了します");
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
		console.log("アプリ用ウィンドウが作られました");
	}
});

// IPC通信でExcelファイルの読み込みと保存を実行
ipcMain.handle('read-and-update-xlsx', (event, args) => {
	console.log("ipcMainが実行されました");
	const workbook = xlsx.readFile('data.xlsx');
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];
	const data = xlsx.utils.sheet_to_json(worksheet);

	// データを編集
	data.push({ Name: 'New Name', Age: 30, City: 'New City' });
	console.debug("データがpushされました");

	const newWorksheet = xlsx.utils.json_to_sheet(data);
	workbook.Sheets[sheetName] = newWorksheet;

	// ファイルの保存
	xlsx.writeFile(workbook, 'data_update.xlsx');

	return 'ファイルが更新され、保存されました。';
});
