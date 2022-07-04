const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


//variables
let speed =7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let inputsXVelocity =0;
let inputsYVelocity =0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let previousXVelocity = 0;
let previousYVelocity = 0;

//game loop
function drawGame(){
    xVelocity = inputsXVelocity;
    yVelocity = inputsYVelocity;
    //Right
    if (previousXVelocity === 1 && xVelocity === -1){
        xVelocity = previousXVelocity;
    }
     //Left
     if (previousXVelocity === -1 && xVelocity === 1){
        xVelocity = previousXVelocity;
    }
     //Up
     if (previousYVelocity === -1 && yVelocity === 1){
        yVelocity = previousYVelocity;
    }
     //Down
     if (previousYVelocity === 1 && yVelocity === -1){
        x=yVelocity = previousYVelocity;
    }

    previousXVelocity = xVelocity;
    previousYVelocity = yVelocity;

    changeSnakePosition();
    let result = isGameOver();
    if(result){
        document.body.removeEventListener("keydown", keyDown);
        return;
    }

    clearScreen();

    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    //change game difficulty if score changes, speed increases
    if(score > 5){
        speed = 9;
    }
    if (score > 10){
        speed = 11;
    }

    setTimeout(drawGame, 1000/ speed);
}

function isGameOver(){
    let gameOver = false;

    if (yVelocity ===0 && xVelocity ===0){
        return false;
    }

    //walls
    if (headX < 0){
        gameOver = true;
    }
    else if (headX === tileCount){
        gameOver = true;
    }
    else if (headY < 0){
        gameOver = true;
    }
    else if (headY === tileCount){
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x == headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    //game over text
    if (gameOver){
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana"

        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height /2)
    }

    return gameOver;

}

function drawScore(){
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana"
    ctx.fillText("Score: " + score, canvas.width-50, 10);
}

//works like a paint brush to make screen black, starts at position 0,0
function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake(){
    
    //draw body
    ctx.fillStyle ='green'
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }
    snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
    while(snakeParts.length > tailLength){
        snakeParts.shift(); //remove the furthest item from the snake parts if we have more than our tail size
    }
    //draw head
    ctx.fillStyle = 'yellow'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple(){
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}
//if position of apple and snake head are equal/ they collide, then change apple position to random
function checkAppleCollision(){
    if(appleX === headX && appleY == headY){
        appleX = Math.floor(Math.random()* tileCount);
        appleY = Math.floor(Math.random()* tileCount);
        tailLength++;
        score++;
    }
}
//prevent apples from spawning inside snake
function generateApplePosition() {
    let newAppleX = Math.floor(Math.random() * tileCount);
    let newAppleY = Math.floor(Math.random() * tileCount);
  
    const isAppleCollidingWithSnakePart = snakeParts.some(
      (part) => part.x === newAppleX || part.y === newAppleY
    );
    //bad apple position head
    if (headX == newAppleX && headY == newAppleY) {
      generateApplePosition();
    //bad apple position part
    } else if (isAppleCollidingWithSnakePart) {
      generateApplePosition();
    } else {
      appleX = newAppleX;
      appleY = newAppleY;
    }
  }


document.body.addEventListener('keydown', keyDown);

function keyDown(event){
    //up, key code for up and w are 38,87, 2nd if statement prevents snake from moving backwards which would collide with itself
    if(event.keyCode == 38 || event.keyCode == 87){
        
        inputsYVelocity = -1;
        inputsXVelocity = 0;
    }

    //down
    if(event.keyCode == 40 || event.keyCode == 83){
        
        inputsYVelocity = 1;
        inputsXVelocity = 0;
    }
    //left
    if(event.keyCode == 37 || event.keyCode == 65){
        
        inputsYVelocity = 0;
        inputsXVelocity = -1;
    }
    //right
    if(event.keyCode == 39 || event.keyCode == 68){
        
        inputsYVelocity = 0;
        inputsXVelocity = 1;
    }

}

drawGame();
