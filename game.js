const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const joystick = document.getElementById('joystick');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let gameInterval;
let joystickDirection = { x: 0, y: 0 };

document.addEventListener('keydown', changeDirection);
joystick.addEventListener('touchstart', startJoystick);
joystick.addEventListener('touchmove', moveJoystick);
joystick.addEventListener('touchend', endJoystick);

function startGame() {
  snake = new Snake();
  food = new Food();
  score = 0;
  scoreElement.innerText = `Score: ${score}`;
  gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
  snake.move(joystickDirection.x, joystickDirection.y);
  if (snake.eat(food)) {
    score++;
    scoreElement.innerText = `Score: ${score}`;
    food = new Food();
    playSound('eat');
  }

  if (snake.collide() || snake.outOfBounds()) {
    clearInterval(gameInterval);
    playSound('gameover');
    alert('Game Over! Restarting...');
    startGame();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  food.draw();
}

function playSound(type) {
  const sound = new Audio();
  if (type === 'eat') {
    sound.src = 'eat.mp3'; // Add the path to your sound file
  } else if (type === 'gameover') {
    sound.src = 'gameover.mp3'; // Add the path to your sound file
  }
  sound.play();
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  if (keyPressed === 37) {
    snake.changeDirection('left');
  } else if (keyPressed === 38) {
    snake.changeDirection('up');
  } else if (keyPressed === 39) {
    snake.changeDirection('right');
  } else if (keyPressed === 40) {
    snake.changeDirection('down');
  }
}

function startJoystick(event) {
  event.preventDefault();
  const touch = event.touches[0];
  joystickDirection.x = 0;
  joystickDirection.y = 0;
  moveJoystick(event);
}

function moveJoystick(event) {
  const touch = event.touches[0];
  const joystickRect = joystick.getBoundingClientRect();
  const joystickCenter = {
    x: joystickRect.left + joystickRect.width / 2,
    y: joystickRect.top + joystickRect.height / 2,
  };
  const distanceX = touch.clientX - joystickCenter.x;
  const distanceY = touch.clientY - joystickCenter.y;
  
  if (Math.abs(distanceX) > Math.abs(distanceY)) {
    joystickDirection.x = distanceX > 0 ? 1 : -1;
  } else {
    joystickDirection.y = distanceY > 0 ? 1 : -1;
  }
}

function endJoystick() {
  joystickDirection.x = 0;
  joystickDirection.y = 0;
}

class Snake {
  constructor() {
    this.body = [{ x: 5, y: 5 }];
    this.direction = 'right';
  }

  move(dx, dy) {
    const head = { ...this.body[0] };
    head.x += dx;
    head.y += dy;
    this.body.unshift(head);
    this.body.pop();
  }

  draw() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillRect(this.body[i].x * scale, this.body[i].y * scale, scale, scale);
    }
  }

  changeDirection(newDirection) {
    if (this.direction === 'up' && newDirection !== 'down') {
      this.direction = newDirection;
    } else if (this.direction === 'down' && newDirection !== 'up') {
      this.direction = newDirection;
    } else if (this.direction === 'left' && newDirection !== 'right') {
      this.direction = newDirection;
    } else if (this.direction === 'right' && newDirection !== 'left') {
      this.direction = newDirection;
    }
  }

  eat(food) {
    if (this.body[0].x === food.x && this.body[0].y === food.y) {
      this.body.push({ ...this.body[this.body.length - 1] });
      return true;
    }
    return false;
  }

  collide() {
    for (let i = 1; i < this.body.length; i++) {
      if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
        return true;
      }
    }
    return false;
  }

  outOfBounds() {
    const head = this.body[0];
    return head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
  }
}

class Food {
  constructor() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
  }
}

startGame();
