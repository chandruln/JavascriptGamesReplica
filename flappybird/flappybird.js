//board

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2
let birdImg;

let bird = {
     x : birdX,
     y : birdY,
     width: birdWidth,
     height : birdHeight
}

//pipes
let pipeArray = []
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let toppipeImg;
let bottompipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0 //bird jumping speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById('board'); 
    board.height = boardHeight;  
    board.window = boardWidth;
    context = board.getContext("2d");

    //load images
    birdImg = new Image();
    birdImg.src = "./img/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeImg = new Image();
    toppipeImg.src = "./img//toppipe.png";

    bottompipeImg = new Image();
    bottompipeImg.src = "./img/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //1.5s
    document.addEventListener("keydown", moveBird);

}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0) //limit the bird to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //if bird falls down
    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for(let i=0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score +=0.5;  //bec of 2 pipe 
            pipe.passed = true;
        }
        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); //removes first element from array
    }

    context.fillStyle = "white";
    context.font = "40px sans-serif";
    if(!gameOver){
        context.fillText(score, 5, 45); //score
    }else{
        context.font = "21px sans-serif";
        context.fillText("GAME OVER", 80, 300);
        context.fillText(`Your Score : ${score}`, 80, 340);
        context.fillText("Tab Space/Up Arrow to Restart", 3, 400);
    }
}

function placePipes(){
    if(gameOver){
        return
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/4;

    let topPipe = {
        img: toppipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: toppipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        velocityY = -6;//jump
        
        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.y < b.y + b.height &&
           a.x + a.width > b.x &&
           a.y + a.height > b.y;
}