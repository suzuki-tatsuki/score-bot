console.debug('Renderer script loaded');

const { ipcRenderer } = require('electron');

document.getElementById('edit-excel').addEventListener('click', async () => {
	console.log("エクセル編集のイベント発生");
	const result = await ipcRenderer.invoke('read-and-update-xlsx');
	document.getElementById('status').innerText = result;
});
