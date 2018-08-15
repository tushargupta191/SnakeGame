var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    score = document.getElementById('score'),
    restart = document.getElementById('restart'),
    gameOver = document.getElementById('gameOver');

/*
canvas dimensions : 350x350
 */

var snakeSize = 10,
    direction = "right",
    snakeLength = 5,
    startingSnakeLength = 5,
    lastX,
    lastY,
    foodX,
    foodY,
    snakeCoordinates = [],
    snakeMovementTimeout,
    canvasDimension = 35,
    snakeSpeed,
    initialSpeed = 100,
    canvaBackgroundColor = "#888";

function clearCanvas(){
    ctx.fillStyle = canvaBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawSnakeOneBox (x, y){
    ctx.fillStyle = "green";
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
}

function hideSnakeOneBox (x,y) {
    ctx.fillStyle = canvaBackgroundColor;
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
}

function drawFood (x,y){
    ctx.fillStyle = "red";
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
}

function drawSnake(){
    for(var j=0; j<snakeCoordinates.length; j++){
        drawSnakeOneBox(snakeCoordinates[j].x, snakeCoordinates[j].y);
    }
}

function updateCoordinates (x, y){
    snakeCoordinates.push({x: x, y: y});
    var lastCoordinates = snakeCoordinates[0];
    snakeCoordinates = snakeCoordinates.splice(1);

    return lastCoordinates;
}

function determineNewCoordinates(){

    switch (direction){
        case "down" :
            lastY = (lastY+1)%canvasDimension;
            break;

        case "up" :
            lastY = (lastY - 1 + canvasDimension)%canvasDimension;
            break;

        case "left" :
            lastX = (lastX - 1 + canvasDimension)%canvasDimension;
            break;

        case "right" :
            lastX = (lastX+1)%canvasDimension;
            break;
    }
}

function checkIfFoodEaten(){
    if(lastX === foodX && lastY === foodY){
        setAndValidateFoodItem();
        snakeLength++;
        score.textContent = snakeLength - startingSnakeLength;
        snakeSpeed = 0.95*snakeSpeed;
    }
    else{
        hideSnakeOneBox(snakeCoordinates[0].x , snakeCoordinates[0].y);
        snakeCoordinates = snakeCoordinates.splice(1);
    }
}

function updateSnakeBody(){
    determineNewCoordinates();
    var hasOverLapped = checkIfOverlapped();
    if(hasOverLapped){
        return true;
    }
    snakeCoordinates.push({x: lastX, y: lastY});
    drawSnakeOneBox(lastX, lastY);
    checkIfFoodEaten();

    return false;
}

function checkIfOverlapped(){
    var i;
    for(i=0; i < snakeCoordinates.length; i++){
        if(snakeCoordinates[i].x === lastX && snakeCoordinates[i].y === lastY){
            return true;
        }
    }
    return false;
}

function determineDirectionOfSnake(){
    document.onkeydown = function (event) {
        var keyCode = window.event.keyCode || event.keyCode;

        switch (keyCode){
            case 37:
                if(direction !== "right"){
                    direction = "left";
                }
                break;

            case 38:
                if(direction !== "down"){
                    direction = "up";
                }
                break;

            case 39:
                if(direction !== "left"){
                    direction = "right";
                }
                break;

            case 40:
                if(direction !== "up"){
                    direction = "down";
                }
                break;
        }
    }
}

function initializeKeyVariables () {
    snakeLength = 5;
    snakeCoordinates = [];
    snakeSpeed = initialSpeed;
    direction = "right";
    clearTimeout(snakeMovementTimeout);
}
function initializeSnake (){
    initializeKeyVariables();
    var startLeft = 1;
    for(var i=0; i<startingSnakeLength; i++){
        snakeCoordinates.push({x: startLeft+i, y:0});
        lastX = startLeft+i;
        lastY = 0;
    }

    drawSnake();
}

function setFoodItem(){
    foodX = Math.round(Math.random()*(canvasDimension-1));
    foodY = Math.round(Math.random()*(canvasDimension-1));

}

function setAndValidateFoodItem(isFirst) {

    setFoodItem();

    var validFoodItem = true;

    for(var i = 0; i < snakeCoordinates.length; i++){
        if(snakeCoordinates[i].x === foodX && snakeCoordinates[i].y === foodY){
            setAndValidateFoodItem(isFirst);
            validFoodItem = false;
            return;
        }
    }

    if(validFoodItem){
        drawFood(foodX, foodY);
    }

}

function init(){
    clearCanvas();
    initializeSnake();
    setAndValidateFoodItem(true);
    determineDirectionOfSnake();

    var stopSnake = false;

    var setMotion = function(){
        if(!stopSnake){
            console.log("Snake speed is " + snakeSpeed);
            snakeMovementTimeout = setTimeout(function(){
                stopSnake = updateSnakeBody();
                setMotion();
            }, snakeSpeed);
        }
    };

    setTimeout(setMotion, snakeSpeed);
}

restart.onclick = function(){
    init();
};

init();
