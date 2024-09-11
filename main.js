const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const XLSX = require('xlsx');

let mainWindow;

// エクセルに挿入する行を管理するための変数
let row = 1;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
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

function cul_keiten(winner1, winner2, winner3, winner4){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0);
	// DEBUG: 複数人テンパイがいる時の処理を見直すべき
	// 誰と誰がテンパイだったのか
  if(n != 0){
	let tensu = 3000 / n;
	console.log("player" + n + ", " + tensu + "点");
  }else{
	console.log("ノーテン");
  }
}

function cul_tumo(winner1, winner2, winner3, winner4, kyotaku, honba, kyoku, han, hu){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0);
  let m = (winner1 ? 1 : 0) + (winner2 ? 2 : 0) + (winner3 ? 3 : 0) + (winner4 ? 4 : 0);
  let tensu;
  let kachiten;
  let maketen;
  let tensu_oya;
  let tensu_ko;

  if( n != 1 ){
	console.log("正しく選択されていません");
  }else if( m == kyoku ){
	//親の場合
	if(han >= 13){
	  tensu = 48000 ;
	}else if(han >= 11){
	  tensu = 36000 ;
	}else if(han >= 8){
	  tensu = 24000 ;
	}else if(han >= 6){
	  tensu = 18000 ;
	}else if(han == 5||(han == 4 && hu >= 30)||(han == 3 && hu >= 70)){
	  tensu = 12000 ;
	}else if(han == 4){
	  switch(hu){
		case 20 :
		tensu = 7800 ;
		break;
		case 25 :
		tensu = 9600 ;
		break;
	  }
	}else if(han == 3){
	  switch(hu){
		case 20 :
		tensu = 3900 ;
		break;
		case 25 :
		tensu = 4800 ;
		break;
		case 30 :
		tensu = 6000 ;
		break;
		case 40 :
		tensu = 7800 ;
		break;
		case 50 :
		tensu = 9600 ;
		break;
	  }
	}else if(han == 2){
	  switch(hu){
		case 20 :
		tensu = 2100 ;
		break;
		case 25 :
		tensu = 2100 ;
		break;
		case 30 :
		tensu = 3000 ;
		break;
		case 40 :
		tensu = 3900 ;
		break;
		case 50 :
		tensu = 4800 ;
		break;
		case 60 :
		tensu = 6000 ;
		break;
		case 70 :
		tensu = 6900 ;
		break;
		case 80 :
		tensu = 7800 ;
		break;
		case 90 :
		tensu = 8700 ;
		break;
		case 100 :
		tensu = 9600 ;
		break;
		case 110 :
		tensu = 10800 ;
		break;
	  }
	}else{
	  switch(hu){
		case 30 :
		tensu = 1500 ;
		break;
		case 40 :
		tensu = 2100 ;
		break;
		case 50 :
		tensu = 2400 ;
		break;
		case 60 :
		tensu = 3000 ;
		break;
		case 70 :
		tensu = 3600 ;
		break;
		case 80 :
		tensu = 3900 ;
		break;
		case 90 :
		tensu = 4500 ;
		break;
		case 100 :
		tensu = 4800 ;
		break;
	  }
	}

	// DEBUG: 点数表示を親子で分ける理由がなければ共通化できるはず
	kachiten = tensu + kyotaku * 1000 + honba * 300 ;
	maketen = -((tensu / 3) + honba * 100) ;
	console.log("勝ち："+ kachiten +" 払い："+ maketen);

  }else{
	//子の場合
	if(han >= 13){
	  tensu_ko = 8000 ;
	  tensu_oya = 16000 ;
	}else if(han >= 11){
	  tensu_ko = 6000 ;
	  tensu_oya = 12000 ;
	}else if(han >= 8){
	  tensu_ko = 4000 ;
	  tensu_oya = 8000 ;
	}else if(han >= 6){
	  tensu_ko = 3000 ;
	  tensu_oya = 6000 ;
	}else if(han == 5||(han >= 4 && hu >= 30)||(han >= 3 && hu >= 70)){
	  tensu_ko = 2000 ;
	  tensu_oya = 4000 ;
	}else if(han == 4){
	  switch(hu){
		case 20 :
		tensu_ko = 1300 ;
		tensu_oya = 2600 ;
		break;
		case 25 :
		tensu_ko = 1600 ;
		tensu_oya = 3200 ;
		break;
	  }
	}else if(han == 3){
	  switch(hu){
		case 20 :
		tensu_ko = 700 ;
		tensu_oya = 1300 ;
		break;
		case 25 :
		tensu_ko = 800 ;
		tensu_oya = 1600 ;
		break;
		case 30 :
		tensu_ko = 1000 ;
		tensu_oya = 2000 ;
		break;
		case 40 :
		tensu_ko = 1300 ;
		tensu_oya = 2600 ;
		break;
		case 50 :
		tensu_ko = 1600 ;
		tensu_oya = 3200 ;
		break;
	  }
	}else if(han == 2){
	  switch(hu){
		case 20 :
		tensu_ko = 400 ;
		tensu_oya = 700 ;
		break;
		case 25 :
		tensu_ko = 400 ;
		tensu_oya = 700 ;
		break;
		case 30 :
		tensu_ko = 500 ;
		tensu_oya = 1000 ;
		break;
		case 40 :
		tensu_ko = 700 ;
		tensu_oya = 1300 ;
		break;
		case 50 :
		tensu_ko = 800 ;
		tensu_oya = 1600 ;
		break;
		case 60 :
		tensu_ko = 1000 ;
		tensu_oya = 2000 ;
		break;
		case 70 :
		tensu_ko = 1200 ;
		tensu_oya = 2300 ;
		break;
		case 80 :
		tensu_ko = 1300 ;
		tensu_oya = 2600 ;
		break;
		case 90 :
		tensu_ko = 1500 ;
		tensu_oya = 2900 ;
		break;
		case 100 :
		tensu_ko = 1600 ;
		tensu_oya = 3200 ;
		break;
		case 110 :
		tensu_ko = 1800 ;
		tensu_oya = 3600 ;
		break;
	  }
	}else{
	  switch(hu){
		case 30 :
		tensu_ko = 300 ;
		tensu_oya = 500 ;
		break;
		case 40 :
		tensu_ko = 400 ;
		tensu_oya = 700 ;
		break;
		case 50 :
		tensu_ko = 400 ;
		tensu_oya = 800 ;
		break;
		case 60 :
		tensu_ko = 500 ;
		tensu_oya = 1000 ;
		break;
		case 70 :
		tensu_ko = 600 ;
		tensu_oya = 1200 ;
		break;
		case 80 :
		tensu_ko = 700 ;
		tensu_oya = 1300 ;
		break;
		case 90 :
		tensu_ko = 800 ;
		tensu_oya = 1500 ;
		break;
		case 100 :
		tensu_ko = 800 ;
		tensu_oya = 1600 ;
		break;
	  }
	}
	console.log("勝ち："+((tensu_oya + 2 * tensu_ko) + kyotaku * 1000 + kyoku * 300)
	+"　親払い："+(tensu_oya + kyoku * 100)+
	"　子払い："+(tensu_ko + kyoku * 100));
  }
}

function cul_ron(winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, kyoku, han, hu){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0);
  let m = (winner1 ? 1 : 0) + (winner2 ? 2 : 0) + (winner3 ? 3 : 0) + (winner4 ? 4 : 0);
  let l = (loser1 ? 1 : 0) + (loser2 ? 2 : 0) + (loser3 ? 3 : 0) + (loser4 ? 4 : 0);
  let tensu;

	// DEBUG:同じ人を選択した場合も弾くべき
	// もしくはチェックボックスじゃなくてプルタブを使う
  if( n != 1 ){
	console.log("正しく選択されていません")
  }else if( m == kyoku ){
	//親の場合
	if(han >= 13){
	  tensu = 48000 ;
	}else if(han >= 11){
	  tensu = 36000 ;
	}else if(han >= 8){
	  tensu = 24000 ;
	}else if(han >= 6){
	  tensu = 18000 ;
	}else if(han == 5||(han >= 4 && hu >= 30)||(han >= 3 && hu >= 70)){
	  tensu = 12000 ;
	}else if(han == 4){
	  switch(hu){
		case 20 :
		tensu = 7700 ;
		break;
		case 25 :
		tensu = 9600 ;
		break;
	  }
	}else if(han == 3){
	  switch(hu){
		case 20 :
		tensu = 3900 ;
		break;
		case 25 :
		tensu = 4800 ;
		break;
		case 30 :
		tensu = 5800 ;
		break;
		case 40 :
		tensu = 7700 ;
		break;
		case 50 :
		tensu = 9600 ;
		break;
	  }
	}else if(han == 2){
	  switch(hu){
		case 20 :
		tensu = 2100 ;
		break;
		case 25 :
		tensu = 2400 ;
		break;
		case 30 :
		tensu = 2900 ;
		break;
		case 40 :
		tensu = 3900 ;
		break;
		case 50 :
		tensu = 4800 ;
		break;
		case 60 :
		tensu = 5800 ;
		break;
		case 70 :
		tensu = 6800 ;
		break;
		case 80 :
		tensu = 7700 ;
		break;
		case 90 :
		tensu = 8700 ;
		break;
		case 100 :
		tensu = 9600 ;
		break;
		case 110 :
		tensu = 10600 ;
		break;
	  }
	}else{
	  switch(hu){
		case 30 :
		tensu = 1500 ;
		break;
		case 40 :
		tensu = 2000 ;
		break;
		case 50 :
		tensu = 2400 ;
		break;
		case 60 :
		tensu = 2900 ;
		break;
		case 70 :
		tensu = 3400 ;
		break;
		case 80 :
		tensu = 3900 ;
		break;
		case 90 :
		tensu = 4400 ;
		break;
		case 100 :
		tensu = 4800 ;
		break;
	  }
	}
  }else{
	//子の場合
	if(han >= 13){
	  tensu = 32000 ;
	}else if(han >= 11){
	  tensu = 24000 ;
	}else if(han >= 8){
	  tensu = 18000 ;
	}else if(han >= 6){
	  tensu = 12000 ;
	}else if(han == 5||(han >= 4 && hu >= 30)||(han >= 3 && hu >= 70)){
	  tensu = 8000 ;
	}else if(han == 4){
	  switch(hu){
		case 20 :
		tensu = 5200 ;
		break;
		case 25 :
		tensu = 6400 ;
		break;
	  }
	}else if(han == 3){
	  switch(hu){
		case 20 :
		tensu = 2600 ;
		break;
		case 25 :
		tensu = 3200 ;
		break;
		case 30 :
		tensu = 3900 ;
		break;
		case 40 :
		tensu = 5200 ;
		break;
		case 50 :
		tensu = 6400 ;
		break;
	  }
	}else if(han == 2){
	  switch(hu){
		case 20 :
		tensu = 1000 ;
		break;
		case 25 :
		tensu = 1600 ;
		break;
		case 30 :
		tensu = 2000 ;
		break;
		case 40 :
		tensu = 2600 ;
		break;
		case 50 :
		tensu = 3200 ;
		break;
		case 60 :
		tensu = 3900 ;
		break;
		case 70 :
		tensu = 4500 ;
		break;
		case 80 :
		tensu = 5200 ;
		break;
		case 90 :
		tensu = 5800 ;
		break;
		case 100 :
		tensu = 6400 ;
		break;
		case 110 :
		tensu = 7100 ;
		break;
	  }
	}else{
	  switch(hu){
		case 30 :
		tensu = 1000 ;
		break;
		case 40 :
		tensu = 1300 ;
		break;
		case 50 :
		tensu = 1600 ;
		break;
		case 60 :
		tensu = 2000 ;
		break;
		case 70 :
		tensu = 2300 ;
		break;
		case 80 :
		tensu = 2600 ;
		break;
		case 90 :
		tensu = 2900 ;
		break;
		case 100 :
		tensu = 3200 ;
		break;
	  }
	}
  }

	console.log("player" + l + " -> player" + n);
	console.log("点数："+ tensu + "+" + kyoku * 100);
}

/*
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
*/

ipcMain.on('keiten', (event, winner1, winner2, winner3, winner4) => {
	console.log("[keiten func]");
	cul_keiten(winner1, winner2, winner3, winner4);
	console.log();	// 改行のため
});

ipcMain.on('tumo', (event, winner1, winner2, winner3, winner4, kyotaku, honba, kyoku, han, hu) => {
	console.log("[tumo func]");
	cul_tumo(winner1, winner2, winner3, winner4, kyotaku, honba, kyoku, han, hu);
	console.log();	// 改行のため
});

ipcMain.on('ron', (event, winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, kyoku, han, hu) => {
	console.log("[ron func]");
	cul_ron(winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, kyoku, han, hu);
	console.log();	// 改行のため
});

