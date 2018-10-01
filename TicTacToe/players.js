class AIPlayer {
	constructor(side) {
		this.brain = new NeuralNetwork([SIZE*SIZE, 10, 2]);
		this.side = side;
		this.score = 0;
	};

	move(boardState) {

		let inputs = [];

		for (let i = 0; i < SIZE; i++) {
			for (let j = 0; j < SIZE; j++) {
				inputs[inputs.length] = boardState[i][j];
			};
		};

		let outputs = this.brain.predict(inputs);

		let move = [];
		move[0] = floor(outputs[0]*SIZE); //X
		move[1] = floor(outputs[1]*SIZE); //Y
		move[2] = this.side;

		return move;
	};
};

class HumanPlayer {
	constructor() {
	};
};
