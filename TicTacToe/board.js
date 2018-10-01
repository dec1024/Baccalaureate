class Board {
	constructor() {
		this.state = [];

		for (let i = 0; i < SIZE; i++) {
			this.state[i] = [];
			for (let j = 0; j < SIZE; j++) {
				this.state[i][j] = E;
			};
		};
	};

	play(x, y, side) {
		this.state[x][y] = side;
	};

	draw(x, y) {
		switch(this.state[x][y]) {
			case X:
				line(x*MULT, y*MULT, MULT*(x+1), MULT*(y+1));
				line(x*MULT, MULT*(y+1), MULT*(x+1), MULT*y)
				break;
			case O:
				ellipse(MULT*(x+0.5), MULT*(y+0.5), MULT)
				break;
			case E:
				break;
		};
	};

	winner(lastMove) {
		let sumRow = 0;
		let sumDiag1 = 0;
		let sumDiag2 = 0;
		let sumCol = 0;


		for (let i = 0; i < SIZE; i++) {
			sumRow += this.state[i][lastMove[1]];
			sumCol += this.state[lastMove[0]][i];
			sumDiag1 += this.state[i][i];
			sumDiag2 += this.state[i][SIZE-i - 1];
		};

		if (abs(sumRow) == 3 || abs(sumCol) == 3 || abs(sumDiag1) == 3 || abs(sumDiag2) == 3) {
			return true;
		} else {
			return false;
		};
	};
};
