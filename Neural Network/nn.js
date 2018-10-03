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

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  /*
  * if first argument is a NeuralNetwork the constructor clones it
  * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
  */
  constructor(nodes) {
    this.nodes = [];
    this.weights = [];
    this.bias = [];

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

      for (let i = 0; i < this.length; i++) {
        this.nodes[i] = nodes[i];
      };

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

  predict(input_array) {

    // Generating the nodes[1] nodes[2]
    let inputs = Matrix.fromArray(input_array);
    let nodes = this.feedforward(inputs, this.weights, this.bias, this.activation_function.func, this.length);
    return nodes[this.length-1].toArray();
  }

  feedforward(inputs, weights, bias, activation, length) {
    let nodes = [];
    nodes[0] = inputs;
    for (let i = 1; i < length; i++) {
      nodes[i] = Matrix.multiply(weights[i-1], nodes[i-1]);
      nodes[i].add(bias[i-1]);
      nodes[i].map(activation);
    };

    return nodes
  };

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  calcErrors(targets, nodes, weights, length) {
    // Calculate the error

    let errors = [];
    // ERROR = TARGETS - OUTPUTS
    errors[length-2] = Matrix.subtract(targets, nodes[length-1]);

    for (let i = length-2; i > 0; i--) {
      let w_T = Matrix.transpose(weights[i]);
      errors[i-1] = Matrix.multiply(w_T, errors[i])
    };
    return errors;
  };

  calcGradients(nodes, errors, activation, lr, length) {
    let gradients = [];

    for (let i = 0; i < this.length-1; i++) {
      gradients[i] = Matrix.map(nodes[i+1], activation);
      gradients[i].multiply(errors[i]);
      gradients[i].multiply(lr);
    };

    return gradients
  };

  calcDeltas(nodes, gradients, length) {
    let deltas = [];

    for (let i = 0; i < this.length-1; i++) {
      let node_T = Matrix.transpose(nodes[i])
      deltas[i] = Matrix.multiply(gradients[i], node_T);
    };

    return deltas
  };

  train(input_array, target_array) {
    // Generating the nodes[1] nodes[2]
    let inputs = Matrix.fromArray(input_array);
    let targets = Matrix.fromArray(target_array);

    let nodes = this.feedforward(inputs, this.weights, this.bias, this.activation_function.func, this.length);
    let errors = this.calcErrors(targets, nodes, this.weights, this.length)

    let gradients = this.calcGradients(nodes, errors, this.activation_function.dfunc, this.learning_rate, this.length);

    let deltas = this.calcDeltas(nodes, gradients, this.length);


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
