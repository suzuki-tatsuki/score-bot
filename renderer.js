const { ipcRenderer } = require('electron');

document.getElementById('keiten').addEventListener('click', () => {
	let winner1 = document.getElementById("keiten1").checked;
	let winner2 = document.getElementById("keiten2").checked;
	let winner3 = document.getElementById("keiten3").checked;
	let winner4 = document.getElementById("keiten4").checked;

    ipcRenderer.send('keiten', winner1, winner2, winner3, winner4);
});

document.getElementById('tumo').addEventListener('click', () => {
	let winner1 = document.getElementById("tumo1").checked;
	let winner2 = document.getElementById("tumo2").checked;
	let winner3 = document.getElementById("tumo3").checked;
	let winner4 = document.getElementById("tumo4").checked;

	let kyotaku = parseInt(document.getElementById("kyotaku").value);
	let honba = parseInt(document.getElementById("honba").value);

	let kyoku = parseInt(document.getElementById("kyoku").value);
	let han = parseInt(document.getElementById("han").value);
	let hu = parseInt(document.getElementById("hu").value);

    ipcRenderer.send('tumo', winner1, winner2, winner3, winner4, kyotaku, honba, kyoku, han, hu);
});

document.getElementById('ron').addEventListener('click', () => {
	let winner1 = document.getElementById("winner1").checked;
	let winner2 = document.getElementById("winner2").checked;
	let winner3 = document.getElementById("winner3").checked;
	let winner4 = document.getElementById("winner4").checked;

	let loser1 = document.getElementById("loser1").checked;
	let loser2 = document.getElementById("loser2").checked;
	let loser3 = document.getElementById("loser3").checked;
	let loser4 = document.getElementById("loser4").checked;

	let kyoku = parseInt(document.getElementById("kyoku").value);
	let han = parseInt(document.getElementById("han_ron").value);
	let hu = parseInt(document.getElementById("hu_ron").value);

    ipcRenderer.send('ron', winner1, winner2, winner3, winner4, loser1, loser2, loser3, loser4,kyoku, han, hu);
});
