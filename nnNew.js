//Using math.js
//WIP

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  // return sigmoid(x) * (1 - sigmoid(x));
  return y * (1 - y);
}

class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes, lr) {
    //get node sizes
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;
    this.learning_rate = lr;

    //Create Biases
    this.bias_h = math.random([this.hidden_nodes], -1, 1);
    this.bias_o = math.random([this.output_nodes], -1, 1);


    //Create weights
    this.weights_ih = math.matrix(math.random([this.hidden_nodes, this.input_nodes]));
    this.weights_ho = math.matrix(math.random([this.output_nodes, this.hidden_nodes]));
  };

  feedforward(input_array, weights, bias) {

    //Matrix Inputs
    let inputs = math.matrix(input_array);

    //generate hidden outputs
    let hidden = this.genOutput(inputs, this.weights_ih, this.bias_h, sigmoid);

    //generate output's output
    let outputs = this.genOutput(hidden, this.weights_ho, this.bias_o, sigmoid);

    return outputs._data;
  };

  train(input_array, target_array) {

    //get inputs etc.
    let inputs = math.matrix(input_array);
    let hidden = this.genOutput(inputs, this.weights_ih, this.bias_h, sigmoid);
    let hidden_T = math.matrix([hidden._data]);
    let outputs = this.genOutput(hidden, this.weights_ho, this.bias_o, sigmoid);
    let outputs_T = math.matrix([outputs._data]);
    outputs = math.transpose(outputs_T);
    let targets = math.transpose(math.matrix([target_array]));

    //Error = Targets - Outputs
    let output_errors = math.subtract(outputs, targets);

    //calculate gradient
    let gradients = math.map(outputs, dsigmoid);
    gradients = math.dotMultiply(gradients, output_errors);
    gradients = math.multiply(gradients, this.learning_rate);

    console.table(gradients._data);
    console.table(hidden_T._data);
    let weight_ho_deltas = math.multiply(gradients, hidden_T);

    //adjust weights by detlas
    this.weights_ho = math.add(this.weights_ho, weight_ho_deltas);
    this.bias_o = math.add(this.bias_o, gradients);

    //Calculate hidden errors
    let weights_ho_T = math.transpose(this.weights_ho)
    let hidden_errors = math.multiply(weights_ho_T, output_errors);

    //calculate hidden gradients
    let hidden_gradients = math.map(hidden, dsigmoid);
    hidden_gradients = math.dotMultiply(hidden_gradients, hidden_errors);
    hidden_gradients = math.multiply(hidden_gradients, this.learning_rate);

    //Calculate Input to Hidden deltas
    let inputs_T = math.matrix([inputs]);
    console.table(hidden_gradients._data);
    console.table(inputs_T._data);
    let weight_ih_deltas = math.multiply(hidden_gradients, inputs_T);
    console.table(weight_ih_deltas._data);
  };


  genOutput(inputs, weights, bias, map) {
    return math.map(math.add(math.multiply(weights, inputs), bias), map)
  };

};
