class NeuralNetwork {
  constructor(neuronCounts) {
    // number of neurons in each layer
    this.levels = []; // levels basically have the bottom and the top. Both, top and bottom, have neurons.
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1])); // push a new level to level array, using
    }
  }
  // this is the hidden layer
  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]); // calling feedForward for a single level, using givenInputs(offsets) and the first network level
    for (let i = 1; i < network.levels.length; i++) {
      // calling feedForward for the rest of the levels
      outputs = Level.feedForward(outputs, network.levels[i]); // using output from the previous level as the input for the NEW level
    }

    return outputs;
  }
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount); // biases are esentially values above which the output will execute

    this.weights = []; // all the inputs will be connected to all the outputs, however, the weight will define the "strenght of the link between the input and the output", so if weight = 0, then there's pretty much no link
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount); // each input has a weight with every output
    }

    Level.#randomize(this);
  }
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // weight can be from -1 to 1 (negative values are the ones who shouldn't fire, the positive ones are the ones who should)
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]; // Setting value of the inputs to the offsets of the sensor.
    }

    for (let i = 0; i < level.outputs.length; i++) {
      // looping through outputs
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        // looping through all the inputs that an output has
        sum += level.inputs[j] * level.weights[j][i]; // input * weight between the given input and output ( for every input neuron)
      }
      if (sum > level.biases[i]) {
        // if the sum of that input is greater than the value above which an output should fire
        level.outputs[i] = 1; // turning it on
      } else {
        level.outputs[i] = 0; // off
      }
    }
    return level.outputs;
  }
}
