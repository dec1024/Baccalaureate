const X = 1;
const O = -1;
const E = 0;
const SIZE = 3;
const MULT = 200;
const DIM = SIZE*MULT + 1;
const TOTAL = 1000000;

let player1s = [];
let player2s = [];
let boards = [];

let board;


function setup() {
	createCanvas(DIM, DIM);

	for(let i = 0; i < TOTAL; i++) {
		boards[i] = new Board();
		player1s[i] = new AIPlayer(X);
		player2s[i] = new AIPlayer(O);

		let moves = 0;

		let won = 0;

		while (won == 0 && moves < 9) {


			let move1 = player1s[i].move(boards[i].state);

			if (boards[i].state[move1[0]][move1[1]] != E) {
				won = 2;
			} else {
				boards[i].play(move1[0], move1[1], X);
				if (boards[i].winner(move1)) {
					player1s[i].score ++;
					won = 1;
				} else {
					moves ++;

					let move2 = player2s[i].move(boards[i].state);

					if (boards[i].state[move2[0]][move2[1]] != E) {
						won = 1;
					} else {
						boards[i].play(move2[0], move2[1], O);
						moves ++;

						if (boards[i].winner(move2)) {
							player2s[i].score ++;
							won = 2;
						}
					};

				};
			}
		};

		if (player1s[i].score > 1) {
			console.log(player1s[i]);
		};
	};
}

function draw() {
	background(0);

	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			rect(i*MULT, j*MULT, MULT, MULT);
		};
	};
}
