var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]	
]

const cells = document.querySelectorAll('.cell');

startGame();

function startGame(){
	document.getElementById("end_game").classList.add('hidden');
	document.getElementById('end_game').classList.remove('win', 'lose');
	origBoard = Array.from(Array(9).keys());
	
	for (var i=0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer);
		if (!checkTie()) { 
			turn(bestSpot(), aiPlayer);
		}
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;

	let gameWon = checkWin(origBoard, player);
	if (gameWon) {
		gameOver(gameWon);
	}
}

function checkWin(board, player) {
	let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a , []);

	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for(let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i=0; i<cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}

	let msg = (gameWon.player === huPlayer) ? "You Won!" : "You Lose!";
	let cls = (gameWon.player === huPlayer) ? "win" : "lose";
	declareWinner(msg, cls);
}

function declareWinner(msg, cls) {
	document.getElementById('end_game').classList.remove('hidden');
	document.getElementById('end_game_text').innerText = msg;
	document.getElementById('end_game').classList.add(cls);
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i=0; i<cells.length; i++) {
			cells[i].style.backgroundColor = "orange";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!", "tie");
		return true;
	}
	return false;
}

