//Heavily Taken From and Inspired by https://thecodingtrain.com/

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

class NeuralNetwork {
  constructor(nodes) {
    //Initialise nodes, weights, biases
    this.nodes = [];
    this.weights = [];
    this.bias = [];

    //Copy NN values if passing neural network as argument
    if (nodes instanceof NeuralNetwork) {
      let a = nodes;
      for (let i = 0; i < a.length-1; i++) {
        this.nodes[i] = a.nodes[i];
        this.weights[i] = a.weights[i].copy();
        this.bias[i] = a.bias[i].copy();
      };

      this.nodes[a.length-1] = a.nodes[a.length-1];

      this.length = a.length;

    } else {
      this.length = nodes.length;

      //Set node sizes
      for (let i = 0; i < this.length; i++) {
        this.nodes[i] = nodes[i];
      };

      //Create random matrices of dimensions of each layer size for weights and biases
      for (let i = 0; i < this.length -1; i++) {
        this.weights[i] = new Matrix(this.nodes[i+1], this.nodes[i]);
        this.weights[i].randomize();

        this.bias[i] = new Matrix(this.nodes[i+1], 1);
        this.bias[i].randomize();
      };
    };

    this.setLearningRate();
    this.setActivationFunction();


  }

  //Generating output layer for given inputs
  predict(input_array) {

    let inputs = Matrix.fromArray(input_array);

    let nodes = this.feedforward(inputs, this.weights, this.bias, this.activation_function.func, this.length);
    return nodes[this.length-1].toArray();

  }

  //Feeding forward through each layer in the network
  feedforward(inputs, weights, bias, activation, length) {

    let nodes = [];

    //first layer is the inputs
    nodes[0] = inputs;

    //For each layer after the first, matrix multiply the previous layer by the weights matrix, resulting in a weighted sum
    for (let i = 1; i < length; i++) {
      nodes[i] = Matrix.multiply(weights[i-1], nodes[i-1]);
      nodes[i].add(bias[i-1]);
      nodes[i].map(activation);
    };

    return nodes;
  };

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  //Determine the errors of each connection
  calcErrors(targets, nodes, weights, length) {

    let errors = [];

    //Errors in output = Targets - Outputs
    errors[length-2] = Matrix.subtract(targets, nodes[length-1]);

    //Transposing the weights maatrix and multipling it by the error matrix of the previous layer
    //'inverts' the feedforward process and thus assigns an error to each node's value
    for (let i = length-2; i > 0; i--) {
      let w_T = Matrix.transpose(weights[i]);
      errors[i-1] = Matrix.multiply(w_T, errors[i])
    };
    return errors;
  };

  //Calculate gradient on the slope - how 'steep' we are, relative to the node size
  calcGradients(nodes, errors, activation, lr, length) {
    let gradients = [];

    for (let i = 0; i < this.length-1; i++) {

      //Map the node values to normalise
      gradients[i] = Matrix.map(nodes[i+1], activation);

      //Hadamard (equal dimensions) product, to make it proportional to errror.
      gradients[i].multiply(errors[i]);

      //Reduce by learning rate to make changes small
      gradients[i].multiply(lr);
    };

    return gradients
  };

  //Calculate deltas - how much to change value of weights
  calcDeltas(nodes, gradients, length) {
    let deltas = [];

    for (let i = 0; i < this.length-1; i++) {
      //Attributes errors to changing individual weights
      let node_T = Matrix.transpose(nodes[i])
      deltas[i] = Matrix.multiply(gradients[i], node_T);
    };

    return deltas
  };

  //Calculate everything necesarry to train NN on training data
  train(input_array, target_array) {
    let inputs = Matrix.fromArray(input_array);
    let targets = Matrix.fromArray(target_array);

    let nodes = this.feedforward(inputs, this.weights, this.bias, this.activation_function.func, this.length);

    let errors = this.calcErrors(targets, nodes, this.weights, this.length)
    let gradients = this.calcGradients(nodes, errors, this.activation_function.dfunc, this.learning_rate, this.length);

    let deltas = this.calcDeltas(nodes, gradients, this.length);


    //Add deltas to each weight, and the gradient to the bias
    //as the gradient is a column matrix for the nodeswhich is
    //then distributed to the weights in proportion to the size
    //of the weights, but the bias is also a column matrix
    for (let i = 0; i < this.length-1; i++) {
      this.weights[i].add(deltas[i]);
      this.bias[i].add(gradients[i]);
    };
  }

  copy() {
    return new NeuralNetwork(this);
  }

  mutate(func) {

    for (let i = 0; i < this.length-2; i++) {
      this.weights[i].map(func);
      this.bias[i].map(func);
    };
  }
}
