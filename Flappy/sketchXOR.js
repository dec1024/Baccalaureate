//Test to see if training function works to "learn" graphs.

let training_data = [
  {
    inputs: [0,1],
    outputs: [1]
  },
  {
    inputs: [1,0],
    outputs: [1]
  },
  {
    inputs: [0,0],
    outputs: [0]
  },
  {
    inputs: [1,1],
    outputs: [0]
  }
]

let nn;
let nnCopy;
function setup() {

  createCanvas(400, 400);

  nn = new NeuralNetwork([2, 2, 1], 0.1);
};
function draw() {

  background(0);

  //for (let i = 0; i < 1000; i++) {
  //  let data = random(training_data);
//    nn.train(data.inputs, data.outputs);
  //};

  for (let i = 0; i < 1000; i++) {
    let x = random()
    let y = random()
    let output = 0;

    if (y > x) {
      if (y + x > 1) {
        output = 1;
      }
    };

    if (0.4 < x && 0.6 > x) {
      output = 0;
    };

    if (0.8 > y && 0.7 < y) {
      output = 0;
    };

    let data = [
    {
      inputs: [x, y],
      outputs: [output]
    }
    ]

    nn.train(data[0].inputs, data[0].outputs);
  };

  let resolution = 10;
  let cols = width / resolution;
  let rows = height / resolution;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      let y = nn.predict(inputs, true);
      noStroke();
      fill(y * 255);
      rect(i * resolution, j * resolution, resolution, resolution)
    };
  };
};
