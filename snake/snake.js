//Snake Class
class Snake {
	constructor(brain) {
		//Set Values
		this.init(brain);

		let movement = genMovement(this.dir);

		for (let i = 0; i < this.length; i++) {
			this.box[i] = new Box(this.x - i*movement[0], this.y - i * movement[1], this.dir)
		};
	};

	init(brain) {
		this.length = 3;
		this.x = DIM/2 + SIZE/2;
		this.y = DIM/2 + SIZE/2;
		this.dir = UP
		this.score = 0;
		this.life = 0;
		this.fitness = 0;
		this.box = [];
		this.food = new Food(this.x + SIZE/2, this.y + SIZE/2);

		if (brain instanceof NeuralNetwork) {
			this.brain = brain.copy();
			this.brain.mutate(mutate);
		} else {
			this.brain = new NeuralNetwork([5,100, 4]);
		};

		this.color = abs(this.brain.weights[0].data[0][0])*255 + 100;
	}

	show(i) {
		if (counter % INTERVAL == 0) {
			this.update(i);
		} else {
			for (let i = this.length - 1; i >= 0; i--) {
				this.box[i].draw(this.color);
			};
		};
	};

	update(i) {
		for (let i = this.length -1 ; i > 0; i--) {
			this.box[i].update(this.color, this.box[i-1].dir)
		};

		this.box[0].update(this.color, this.dir);

		this.hitFood();

		this.food.update();

		this.life ++;

		this.x = this.box[0].x;
		this.y = this.box[0].y;

		this.think();
	};

	hitFood() {
		if (this.x + SIZE/2 == this.food.x  && this.y + SIZE/2 == this.food.y) {
			this.food = new Food(this.x+SIZE/2, this.y+SIZE/2);
			this.addBox();
			this.score += 1;
		};
	};

  checkLoss() {
    if (this.x < SIZE/2 || this.x >= DIM - SIZE/2  || this.y < SIZE/2  || this.y >= DIM - SIZE/2) {
			return true
    };

    for (let i = 0; i < this.length; i++) {
      for (let j = i+1; j < this.length; j++ ) {
        if (this.box[i].x == this.box[j].x && this.box[i].y == this.box[j].y) {
					return true
        };
      };
    };
  };

	changeDir(dir) {
		if (abs(dir) != abs(this.dir)) {
			this.dir = dir
		};
	};

  addBox() {
    let movement = genMovement(this.box[this.length-1].dir);
    this.box[this.length] = new Box(this.box[this.length-1].x - movement[0], this.box[this.length-1].y - movement[1], this.box[this.length-1].dir);
    this.length += 1;
  };

  think() {
    //[0] = UP
    //[1] = DOWN
    //[2] = RIGHT
    //[3] = LEFT

    let inputs = [];
    inputs[0] = this.x/DIM;
    inputs[1] = this.y/DIM;
    inputs[2] = this.length/MULT;
    inputs[3] = this.food.x/DIM
    inputs[4] = this.food.y/DIM

    let move = this.brain.predict(inputs)

    if(max(move) == move[0]) {
      this.changeDir(UP)
    }
    else if(max(move) == move[1]) {
      this.changeDir(DOWN);
    }
    else if(max(move) == move[2]) {
      this.changeDir(RIGHT);
    }
    else if(max(move) == move[3]) {
      this.changeDir(LEFT);
    };
  };

	copy() {
		return new Snake(this.brain);
	};

	fitness() {

	};

};

//Box Class
class Box {
	constructor(x, y, dir) {
		this.x = x;
		this.y = y;
		this.dir = dir;
	}

	draw(color) {
    fill(color);
		rect(this.x, this.y, SIZE, SIZE);
	};

	update(color, dir) {
		this.dir = dir
		this.draw(color);
		this.move();
	};

	move() {
		let movement = genMovement(this.dir)

		this.x += movement[0];
		this.y += movement[1];
	};

	changeDir(dir) {
		this.dir = dir;
	};
};

class Food {
	constructor(x, y) {
		this.x = (ceil(random(1, MULT - 1)))*SIZE;
		this.y = (ceil(random(1, MULT - 1)))*SIZE;

		this.x = x;
		this.y = y;
	};

	update() {
		ellipse(this.x, this.y, SIZE);
	};
};

function genMovement(dir) {
	let output = [0, 0];
	switch (dir) {
		case UP:
			output[1] = -SIZE;
			break;
		case DOWN:
			output[1] = SIZE;
			break;
		case RIGHT:
			output[0] = SIZE;
			break;
		case LEFT:
			output[0] = -SIZE;
			break;
	};

	return output;
};

function mutate(x) {
	if (random(1) < 0.1) {
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		return newx;
	} else {
		return x;
	};
};
