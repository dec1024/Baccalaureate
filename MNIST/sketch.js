//Draw Mnist sketch

//Initialisation
let mnist = {};
let nn;
let count = 0;
let resolution = 10;
let success = 0;
let cnt = 0
let digit;

//Setup
function setup() {

	console.log('start');
	createCanvas(280, 280);

	background(0);

	//784-50-10 nn. Different hidden node/hidden node layers may make difference. Need 784 and 10.
	nn = new NeuralNetwork([784, 50, 10]);

	//Call load Mnist - async function
	loadMnist().then(console.log).then(() => console.log(mnist.trainingLabels[0], mnist.trainingImages[0]));

	//Create graphic object so drawn digit can be resized
	digit = createGraphics(280, 280);
}

//Get digit from nn
function guessDigit() {

	//Copy image from screen
	let img = digit.get();
	img.resize(28, 28);
	img.loadPixels();

	let inputs = [];


	//Take the red value from the image - either black or white, so no need to average RGB
	for (let i =0; i < 784; i++) {
		inputs[i] = img.pixels[i*4]
	};

	//Get prediction
	let pred = nn.predict(inputs);
	let guess = indexOfMax(pred);

	console.log(guess);
	img.updatePixels();
};

//Draw Function
function draw() {

	//To avoid problems with Async, wait about 2 seconds before training. Should be improved.

	if (frameCount == 60) {

		//Train for each training image. Could train multiple cycles, but overfitting possibility.
		for (let k = 0; k < 60000; k++) {
			count ++;

			//Loop count to avoid overflow
			if (count == 60000) {
				count = 0;
			};


			let img = [];

			//Normalise training image by dividing greyscale by 255
			for (let i = 0; i < 784; i++) {
				img[i] = mnist.trainingImages[count][i]/255
			};

			//Make all target values except for wanted number 0
			let targets = [];
			for (let i = 0; i < 10; i++) {
				targets[i] = 0;
			};
			targets[mnist.trainingLabels[count]] = 1

			//Train on image array and target array
			nn.train(img, targets);
		};


		console.log("finished");
	};

	//Create image from p5 graphic
	image(digit, 0, 0);

	//Draw when mouse pressed
	if (mouseIsPressed) {
		digit.strokeWeight(15);
    digit.stroke(255);
    digit.line(pmouseX,pmouseY,mouseX,mouseY);
	};

	//Guess the digit
	guessDigit();


	//Test nn on training data. Gives about 95% accuracy.
	/*if (frameCount > 30 && frameCount % 10 == 0) {
		cnt ++;

		let img = [];

		for (let i = 0; i < 784; i++) {
			img[i] = mnist.t10kImages[cnt][i]/255
		};

		let answers = nn.predict(img);

		let guess = indexOfMax(answers);

		console.log(guess);

		if (guess == mnist.t10kLabels[cnt]) {
			success += 1;
		};

		let percent = (success/cnt)*100;

		console.log(percent);



		for (let i = 0; i < 28; i++) {
			for (let j = 0; j < 28; j++) {
				let color = img[j + i*28];
				fill(color*255)
				rect(j * resolution, i * resolution, resolution, resolution);
			};
		};
		};
		*/
};


//Clear background when button pressed
function keyPressed() {
	digit.background(0);
};


//Function to find max index of array
//stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
