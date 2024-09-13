const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const XLSX = require('xlsx');

let mainWindow;

const filePath = 'Suzuki_League_Score.xlsx'; // 読み込みたいExcelファイルのパス

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

function cul_keiten(winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyoku){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0);
	let r1_score = (reach1 ? -1: 0) * 1000;
	let r2_score = (reach2 ? -1: 0) * 1000;
	let r3_score = (reach3 ? -1: 0) * 1000;
	let r4_score = (reach4 ? -1: 0) * 1000;
	let newData = [["第"+kyoku+"局", r1_score, 0, r2_score, 0, r3_score, 0, r4_score, 0]];
  if (n==4) {
	console.log("全員テンパイ");
  } else if(n != 0){
	console.log("流局処理");
	let get_tensu = 3000 / n;
	let give_tensu = -(3000 / (4-n));

	if (winner1) {
		console.log("player1:" + get_tensu + "点");
		newData[0][2] = get_tensu;
	} else {
		console.log("player1:" + give_tensu + "点");
		newData[0][2] = give_tensu;
	}
	if (winner2) {
		console.log("player2:" + get_tensu + "点");
		newData[0][4] = get_tensu;
	} else {
		console.log("player1:" + give_tensu + "点");
		newData[0][4] = give_tensu;
	}
	if (winner3) {
		console.log("player3:" + get_tensu + "点");
		newData[0][6] = get_tensu;
	} else {
		console.log("player1:" + give_tensu + "点");
		newData[0][6] = give_tensu;
	}
	if (winner4) {
		console.log("player4:" + get_tensu + "点");
		newData[0][8] = get_tensu;
	} else {
		console.log("player1:" + give_tensu + "点");
		newData[0][8] = give_tensu;
	}
  }else{
	console.log("ノーテン");
  }

	console.log(newData);
	return newData;
}

function cul_tumo(winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyotaku, honba, kyoku, han, hu){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0) + (kyotaku ? 1 : 0) + (honba ? 1 : 0);
  let m = (winner1 ? 1 : 0) + (winner2 ? 2 : 0) + (winner3 ? 3 : 0) + (winner4 ? 4 : 0);
  let tensu;
  let kachiten;
  let maketen;
  let tensu_oya;
  let tensu_ko;

	let r1_score = (reach1 ? -1: 0) * 1000;
	let r2_score = (reach2 ? -1: 0) * 1000;
	let r3_score = (reach3 ? -1: 0) * 1000;
	let r4_score = (reach4 ? -1: 0) * 1000;
	let newData = [["第"+kyoku+"局", r1_score, 0, r2_score, 0, r3_score, 0, r4_score, 0]];

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

	kachiten = tensu + kyotaku * 1000 + honba * 300 ;
	maketen = -((tensu / 3) + honba * 100) ;
	console.log("勝ち："+ kachiten +" 払い："+ maketen);

	for (let i=1; i<5; i++) {
		if (m==i) { 
			newData[0][i*2] = kachiten;
		} else {
			newData[0][i*2] = maketen;
		}
	}

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

	for (let i=1; i<5; i++) {
		if (m==i) { 
			newData[0][i*2] = (tensu_oya + 2 * tensu_ko) + kyotaku * 1000 + kyoku * 300;
		} else if (kyoku==i){
			newData[0][i*2] = tensu_oya + kyoku * 100;
		} else {
			newData[0][i*2] = tensu_ko + kyoku * 100;
		}
	}
  }

	console.log(newData);
	return newData;
}

function cul_ron(winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, reach1, reach2, reach3, reach4, kyoku, han, hu){
  let n = (winner1 ? 1 : 0) + (winner2 ? 1 : 0) + (winner3 ? 1 : 0) + (winner4 ? 1 : 0);
  let m = (winner1 ? 1 : 0) + (winner2 ? 2 : 0) + (winner3 ? 3 : 0) + (winner4 ? 4 : 0);
  let l = (loser1 ? 1 : 0) + (loser2 ? 2 : 0) + (loser3 ? 3 : 0) + (loser4 ? 4 : 0);
  let tensu;

	let r1_score = (reach1 ? -1: 0) * 1000;
	let r2_score = (reach2 ? -1: 0) * 1000;
	let r3_score = (reach3 ? -1: 0) * 1000;
	let r4_score = (reach4 ? -1: 0) * 1000;
	let newData = [["第"+kyoku+"局", r1_score, 0, r2_score, 0, r3_score, 0, r4_score, 0]];

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
	console.log("点数："+ tensu + kyoku * 100);

	for (let i=1; i<5; i++) {
		if (n==i) { 
			newData[0][i*2] = tensu + kyoku * 100;
		} else if (l==i) {
			newData[0][i*2] = -(tensu + kyoku * 100);
		}
	}

	console.log(newData);
	return newData;
}

function editExcel(newData) {
	console.log("[edit Excel]");

    // 既存のExcelファイルを読み込み
    let workbook = XLSX.readFile(filePath);

    // シートを取得
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // 既存シートに新しいデータを追加
    XLSX.utils.sheet_add_aoa(worksheet, newData, { origin: { r: row, c: 0 }});
	row++;	// 次に書き換える行を更新する

    // ファイルに上書き保存
	try {
		XLSX.writeFile(workbook, filePath);
		console.log('File saved successfully');
	} catch (err) {
		console.error('Error saving file:', err);
	}
	console.log();// 改行のため
}

ipcMain.on('keiten', (event, winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyoku) => {
	console.log("[keiten func]");
	let newData = cul_keiten(winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyoku);
	console.log();	// 改行のため

	// エクセルに書き込む
	editExcel(newData);

    // 処理が完了したことを通知
    event.reply('keiten culculated!', '形テンの処理が完了しました');
});

ipcMain.on('tumo', (event, winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyotaku, honba, kyoku, han, hu) => {
	console.log("[tumo func]");
	let newData = cul_tumo(winner1, winner2, winner3, winner4, reach1, reach2, reach3, reach4, kyotaku, honba, kyoku, han, hu);
	console.log();	// 改行のため

	// エクセルに書き込む
	editExcel(newData);
	//
    // 処理が完了したことを通知
    event.reply('tumo culculated!', 'ツモの処理が完了しました');
});

ipcMain.on('ron', (event, winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, reach1, reach2, reach3, reach4, kyoku, han, hu) => {
	console.log("[ron func]");
	let newData = cul_ron(winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4, reach1, reach2, reach3, reach4, kyoku, han, hu);
	console.log();	// 改行のため

	// エクセルに書き込む
	editExcel(newData);
	
    // 処理が完了したことを通知
    event.reply('ron culculated!', 'ロンの処理が完了しました');
});

ipcMain.on('redo', (event) => {
	if (row < 2) {
		console.log("まだデータが入力されていません");
	} else {
		console.log("[redo latest edit]");

		// 空のデータ列で上書きする
		let nullData = [["","","","","","","","","",""]];

		console.log("add empty data to overwrite");

		row--;	// 最新の更新の行に戻す
		// エクセルに書き込む
		editExcel(nullData);
		row--;	// edit excelで進めた分戻す
		
		console.log("row: " + row);
		console.log();	// 改行のため

		// 処理が完了したことを通知
		event.reply('redo latest edit!', '１つ前に戻しました');
	}
});

/*
ipcMain.on('reset', (event) => {
	if (row < 2) {
		console.log("まだデータが入力されていません");
	} else {
		console.log("[reset curent excel sheet]");

		// 現在の日時を取得
		let now = new Date();
		let year = now.getFullYear();
		let month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1
		let day = String(now.getDate()).padStart(2, '0');
		let hours = String(now.getHours()).padStart(2, '0');
		let minutes = String(now.getMinutes()).padStart(2, '0');
		let seconds = String(now.getSeconds()).padStart(2, '0');

		// 日時のデータを整形する
		let dateTime = `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
		console.log("フォーマット済み日時: " + dateTime);
		console.log();	// 改行のため

		// 既存のExcelファイルを読み込み
		let workbook = XLSX.readFile(filePath);

		// シートを取得
		let scoreSheet = workbook.Sheets[workbook.SheetNames[0]];
		let templateSheet = workbook.Sheets[workbook.SheetNames[1]];

		//XLSX.utils.book_append_sheet(workbook, scoreSheet, dateTime);	// 現在のシートを複製保存する
		//XLSX.utils.sheet_add_aoa(workbook, templateSheet, 'ScoreSheet');	// 現在のシートを上書きする

		// ファイルに上書き保存
		XLSX.writeFile(workbook, filePath);

		// 処理が完了したことを通知
		event.reply('reset ScoreSheet!', '参照するシートを初期化しました');
	}
});
*/
