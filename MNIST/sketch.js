//Draw Mnist sketch

//Initialisation
let mnist = {};
let nn = [];
let count = 0;
let resolution = 10;
let success = [];
let numCount = [];
let digit;
let percent = [];
let haveTrained = false;
let trained = [];
let generation = 0;

//Setup
function setup() {
	createCanvas(280, 300).parent('container');

	background(0);

	//784-50-10 nn. Different hidden node/hidden node layers may make difference. Need 784 and 10.
	for (let i = 0; i < 5; i++) {
		let json = trained[i];
		nn[i] = NeuralNetwork.deserialize(json);
	};

	nn[5] = new NeuralNetwork([784, 50, 10]);

	//Call load Mnist - async function
	loadMnist().then(console.log).then(() => console.log(mnist.trainingLabels[0], mnist.trainingImages[0]));

	//Create graphic object so drawn digit can be resized
	digit = createGraphics(280, 280);

	for (let i = 0; i < 10; i++) {
		success[i] = 0;
		numCount[i] = 0;
		percent[i] = 0;
	};
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
	let pred = nn[generation].predict(inputs);
	let guess = indexOfMax(pred);

	document.getElementById("guess").innerHTML = "Guess " + guess;
	img.updatePixels();
};

function trainNetwork() {

	console.log('startTraining');

	count = 0;

	//Train for each training image. Could train multiple cycles, but overfitting possibility.
	//for (let cycles = 0; cycles < 5; cycles++) {
		for (let k = 0; k < 60000; k++) {

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
			nn[5].train(img, targets);

			count ++;
		};
		//let json = nn.serialize();

		//newNN = NeuralNetwork.deserialize(json);
	//};

};

function testNetwork() {
	count = 0;

	for (let i = 0; i < 10000; i++) {

		//Loop count to avoid any overflow
		if (count == 10000) {
			count = 0;
		};

		let img = [];

		for (let j = 0; j < 784; j++) {
			img[j] = mnist.t10kImages[count][j]/255
		};

		let answers = nn[5].predict(img);

		let guess = indexOfMax(answers);

		numCount[mnist.t10kLabels[count]] += 1;

		if (guess == mnist.t10kLabels[count]) {
			success[guess] += 1
		};

		count ++;

	};

	for (let i = 0; i < 10; i++) {
		percent[i] = success[i]/numCount[i]*100;
	};

	console.table(percent);

	document.getElementById("p").innerHTML = "Finished Training! Now draw a digit";

	document.getElementById("data").innerHTML = "Success by digit on training data </br>";

	for (let i = 0; i < 10; i++) {
		document.getElementById("data").innerHTML += i + ": " + percent[i] + "</br>";
	};
};

//Draw Function
function draw() {

	//To avoid problems with Async, wait about 2 seconds before training. Should be improved.

	//if (frameCount == 60) {
	//};

	//Test nn on training data. Gives about 95% accuracy.
	//Do it every 10 frames or so when displaying images
	//if (frameCount > 30 && frameCount % 10 == 0) {
	//if (frameCount == 60) {
	//};

	if (frameCount > 60) {
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

	};

		//Draw Images on screen
		//for (let i = 0; i < 28; i++) {
		//	for (let j = 0; j < 28; j++) {
		//		let color = img[j + i*28];
		//		fill(color*255)
		//		rect(j * resolution, i * resolution, resolution, resolution);
		//	};
		//};
		//};
};

//Clear background when button pressed
function keyPressed() {

	if (keyCode == 32) {
		trainNetwork()
		testNetwork();
		generation = 5;
	} else if (keyCode == 49) {
		generation = 0;
		console.log(generation);
	} else if (keyCode == 50) {
		generation = 1;
		console.log(generation);
	} else if (keyCode == 51) {
		generation = 2;
		console.log(generation);
	} else if (keyCode == 52) {
		generation = 3;
		console.log(generation);
	} else if (keyCode == 53) {
		generation = 4;
		console.log(generation);
	} else if (keyCode == 54) {
		generation = 5;
		console.log(generation);
	}else if (keyCode == 8) {
		digit.background(0);
	};
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
