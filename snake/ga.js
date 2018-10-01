function resetGame() {
  counter = 0;
};

function nextGeneration() {

  console.log("newGen")

  resetGame();

  normalizeFitness(allSnakes);


  activeSnakes = generate(allSnakes);

  allSnakes = activeSnakes.slice();
};

function generate(oldSnakes) {
  let newSnakes = [];

  for (let i = 0; i < oldSnakes.length; i++) {
    let snake = poolSelection(oldSnakes);
    newSnakes[i] = snake
  };

  return newSnakes;
};

function normalizeFitness(snakes) {
  for (let i = 0; i < snakes.length; i++) {
    snakes[i].score = snakes[i].life * snakes[i].score
  };

  let sum = 0;
  for (let i = 0; i < snakes.length; i++) {
    sum += snakes[i].score;
  };

  for (let i = 0; i < snakes.length; i++) {
    snakes[i].fitness = snakes[i].score / sum
  };
};

function poolSelection(snakes) {
  let index = 0;

  let r = random(1);

  while(r > 0) {
    r -= snakes[index].fitness;
    index += 1;
  };

  index -= 1;

  return snakes[index].copy();
};
