//Neural Netork class
//Heavily inspired from http://thecodingtrain.com

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1 - sigmoid(x));
  return y * (1 - y);
}


class NeuralNetwork {
  constructor(nodesize, lr) {

    //Initialise Constants
    this.layers = nodesize.length-2;
    this.learning_rate = lr;

    //Declare arrays
    this.weights = [];
    this.bias = [];

    //Initialise Weighrs and Biases
    for (let i = 0; i <= this.layers; i++) {
      this.weights[i] = new Matrix(nodesize[i + 1], nodesize[i]);
      this.weights[i].randomize();

      this.bias[i] = new Matrix(nodesize[i+1], 1);
      this.bias[i].randomize();
    };
  };

  guess(input_array) {
    return this.feedforward(input_array)[this.layers+1].toArray();
  };

  feedforward(input_array) {
    // Generating the Hidden Outputs
    let nodes = [];
    nodes[0] = Matrix.fromArray(input_array);

    for (let i = 0; i <= this.layers; i ++) {
      nodes[i+1] = this.genOutput(nodes[i], this.weights[i], this.bias[i], sigmoid);
    };

    // Sending back to the caller!
    return nodes;
  }

  backpropagate(nodes, errors, map, lr) {
    let gradients = [];
    for (let i = 0; i <= this.layers; i++) {
      gradients[i] = this.genGradient(nodes[i+1], errors[i], dsigmoid, lr);
    };

    return gradients
  };

  calcErrors(nodes, targets, weights) {
    let errors = [];

    //Output error = Targets - nodes[this.layers + 1]
    errors[this.layers] = Matrix.subtract(targets, nodes[this.layers+1]);

    //Calculate the errors at each layer, according to the value of the weights beforehand
    for (let i = this.layers - 1; i >= 0; i--) {
      errors[i] = this.genError(weights[i+1], errors[i+1])
    };

    return errors;
  };

  calcDeltas(nodes, gradients) {
    let deltas = [];

    for (let i = 0; i <= this.layers; i++) {
      deltas[i] = this.genDelta(nodes[i], gradients[i])
    };

    return deltas
  };

  genDelta(inputs, gradients) {;
    //Calculate Deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_deltas = Matrix.multiply(gradients, inputs_T);
    return weight_deltas;
  };

  genGradient(outputs, errors, map, lr) {
    //Outputs * derivative of activation function (dsigmoid, 1-outputs)
    let gradients = Matrix.map(outputs, map);
    gradients.multiply(errors);
    gradients.multiply(lr);
    return gradients;
  };

  genOutput(inputs, weights, bias, map) {
    let output = Matrix.multiply(weights, inputs);
    output.add(bias);
    // activation function!
    output.map(map);

    return output;
  };

  genError(prevWeight, prevError) {
    let prevWeight_T = Matrix.transpose(prevWeight);
    return Matrix.multiply(prevWeight_T, prevError);
  };

  train(input_array, target_array) {
    //Target Matrix
    let targets = Matrix.fromArray(target_array);

    //Feeding forward to generate network
    let nodes = this.feedforward(input_array);

    //calculate erros
    let errors = this.calcErrors(nodes, targets, this.weights);

    //calculate gradients from errors
    let gradients = this.backpropagate(nodes, errors, dsigmoid, this.learning_rate);

    //calculate deltas
    let deltas = this.calcDeltas(nodes, gradients);

    // Adjust weights and biases by deltas and gradients
    for (let i = 0; i <= this.layers; i++) {
      this.weights[i].add(deltas[i]);
      this.bias[i].add(gradients[i]);
    };
  }
}
