//Create Constants (Words used for directions to improve readability)
const UP = 1;
const RIGHT = 2;
const DOWN = -1;
const LEFT = -2;
const SIZE = 30;
const MULT = 30;
const DIM = SIZE*MULT;
const INTERVAL = 1;
let total = 500;

let speedSlider;
let totalSlider;

let counter = 0;
//Initialise activeSnakes[i]
let activeSnakes = [];
let allSnakes = [];
let foods = [];

function setup() {
	createCanvas(DIM, DIM);

	speedSlider = select('#speedSlider');
	totalSlider = select('#speedSlider')

	for (let i = 0; i < total; i++) {
		let snake = new Snake();
		activeSnakes[i] = snake;
		allSnakes[i] = snake;
	};
}

function draw() {

	let cycles = speedSlider.value();

	background(0);
	for (let n = 0; n < cycles; n++) {
		counter ++;
		for (let i = 0; i < activeSnakes.length; i++) {

			activeSnakes[i].show(i);

			if (activeSnakes[i].checkLoss() == true) {
				activeSnakes.splice(i, 1);
			};

			fill(255);
		};

		if (activeSnakes.length == 0) {
			nextGeneration();
		};
	};
}
