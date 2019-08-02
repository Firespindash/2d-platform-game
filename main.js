// Add Events
window.onload = function() {
    startGame();
}

window.addEventListener('keydown', function(e) {
    gameArea.keys = (gameArea.keys || []);
    gameArea.keys[e.keyCode] = true;
})

window.addEventListener('keyup', function(e) {
    gameArea.keys[e.keyCode] = false;
})

// Variables
var gamePlayer;
var gamePlatform;
var movingPlatform;
var platform2;
var miniPlatform;
var miniPlatform2;
var platform3;
var stairPiece;
var stairPiece2;
var stairPiece3;
var stairPiece4;
var stairPiece5;
var stairPiece6;
var lastPlatform;
var goal;
var finishText;
var signal;
var jump = false;
var time = 0;

// Starts the Game
function startGame() {
    gameArea.start();
    gamePlayer = new object(30, 30, "red", 10, 100);
    gamePlatform = new object(200, 10, "lightgreen", 1, 150);
    movingPlatform = new object(200, 10, "lightgreen", 215, 150);
    platform2 = new object(150, 10, "lightgreen", 490, 250);
    miniPlatform = new object(50, 10, "lightcoral", 280, 250);
    miniPlatform2 = new object(50, 10, "lightblue", 70, 250);
    platform3 = new object(120, 10, "lightgreen", 1, 400);
    stairPiece = new object(130, 10, "lightgreen", 180, 400);
    stairPiece2 = new object(110, 10, "lightgreen", 200, 390);
    stairPiece3 = new object(90, 10, "lightgreen", 220, 380);
    stairPiece4 = new object(70, 10, "lightgreen", 240, 370);
    stairPiece5 = new object(50, 10, "lightgreen", 260, 360);
    stairPiece6 = new object(30, 10, "lightgreen", 280, 350);
    lastPlatform = new object(210, 10, "lightgreen", 430, 400);
    goal = new object(100, 100, "castle.png", 510, 300, "image");
    finishText = new object("30px", "Consolas", "black", gameArea.canvas.width/2, gameArea.canvas.height/2, "text");
    signal = new object(50, 50, "signal.png", 30, 350, "image");
    move1(movingPlatform, 215, 395, 1000/30);
    move2(miniPlatform, 280, 430, 1000/30);
    move3(miniPlatform2, 70, 220, 1000/20);
}

// Generates the Scenario
var gameArea = {
    canvas : document.getElementById("canvas"),
    start : function() {
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateArea, 1000/30);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

// Base Constructor
function object(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 3;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        context = gameArea.context;
        if (this.type == "text") {
          context.font = this.width + " " + this.height;
          context.fillStyle = color;
          context.textAlign = "center";
          context.fillText(this.text, this.x, this.y);
        }
        else if (type == "image") {
          context.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
        }
        else {
          context.fillStyle = color;
          context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.stopFall();
        this.rightBarrier();
        this.leftBarrier();
    }
    this.stopFall = function() {
        var getBottom = gameArea.canvas.height - this.height;
        if (this.y > getBottom) {
            this.y = getBottom;
            gameArea.stop();
            startGame();
        }
    }
    this.rightBarrier = function() {
      var getRight = gameArea.canvas.width - this.width;
      if (this.x > getRight) {
          this.x = getRight;
      }
    }
    this.leftBarrier = function() {
      var getLeft = gameArea.canvas.width/gameArea.canvas.width;
      if (this.x < getLeft) {
          this.x = getLeft;
      }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;
        }
        return crash;
  }
}

// Generates the Movement
function updateArea() {
    if (gamePlayer.crashWith(gamePlatform) ||
        gamePlayer.crashWith(platform2) ||
        gamePlayer.crashWith(platform3) ||
        gamePlayer.crashWith(stairPiece) ||
        gamePlayer.crashWith(stairPiece2) ||
        gamePlayer.crashWith(stairPiece3) ||
        gamePlayer.crashWith(stairPiece4) ||
        gamePlayer.crashWith(stairPiece5) ||
        gamePlayer.crashWith(stairPiece6) ||
        gamePlayer.crashWith(lastPlatform)) {
      gamePlayer.gravitySpeed = -0.05;
      gamePlayer.speedX = 0;
      gamePlayer.speedY = -0.05;
      jump = true;
      finishText.text = " ";
    }
    else {
      gamePlayer.gravity = 0.05;
      gamePlayer.speedX = 0;
      jump = false;
      finishText.text = " ";
    }
    if (gamePlayer.crashWith(movingPlatform) ||
        gamePlayer.crashWith(miniPlatform) ||
        gamePlayer.crashWith(miniPlatform2)) {
      gamePlayer.gravitySpeed = -0.05;
      jump = true;
    }
    if (gamePlayer.crashWith(miniPlatform)) {
      time += 1;
      if (time == 50) {
        finishText.text = "You burned!";
        setTimeout(function(){startGame(); }, 2000);
        gameArea.stop();
      }
    }
    if (gamePlayer.crashWith(miniPlatform2)) {
      gamePlayer.speedX += 1;
    }
    if (gamePlayer.crashWith(goal)) {
      if ((gamePlayer.x + (gamePlayer.width)) > goal.x + 20) {
        finishText.text = "You win!";
        setTimeout(function(){startGame(); }, 2000);
        gameArea.stop();
      }
    }
    if (gamePlayer.crashWith(signal)) {
      finishText.text = "Press Jump button into the staircase";
    }
    gameArea.clear();
    gamePlatform.update();
    movingPlatform.update();
    platform2.update();
    miniPlatform.update();
    miniPlatform2.update();
    platform3.update();
    stairPiece.update();
    stairPiece2.update();
    stairPiece3.update();
    stairPiece4.update();
    stairPiece5.update();
    stairPiece6.update();
    lastPlatform.update();
    goal.update();
    finishText.update();
    signal.update();
    if (gameArea.keys && gameArea.keys[37]) {gamePlayer.speedX -= 5; }
    if (gameArea.keys && gameArea.keys[39]) {gamePlayer.speedX += 5; }
    if (gameArea.keys && gameArea.keys[32] && jump == true) {gamePlayer.gravity = -2; }
    gamePlayer.newPos();
    gamePlayer.update();
}

function move1(obj, pointA, pointB, vel) {
  var goingVel = 2;
  var backVel = 1;
  setInterval(function(){
      if (obj.x < pointA) {obj.x = pointA; }
      if (obj.x == pointA) {backVel = 1; }
      if (obj.x >= pointA) {obj.x += goingVel; }
      if (obj.x > pointB) {obj.x = pointB; }
      if (obj.x == pointB) {backVel = 3; }
      if (obj.x <= pointB) {obj.x -= backVel; }
  }, vel);
}

function move2(obj, pointA, pointB, vel) {
  var goingVel = 2;
  var backVel = 1;
  setInterval(function(){
      if (obj.x < pointA) {obj.x = pointA; }
      if (obj.x == pointA) {backVel = 1; }
      if (obj.x >= pointA) {obj.x += goingVel; }
      if (obj.x > pointB) {obj.x = pointB; }
      if (obj.x == pointB) {backVel = 3; }
      if (obj.x <= pointB) {obj.x -= backVel; }
  }, vel);
}

function move3(obj, pointA, pointB, vel) {
  var goingVel = 2;
  var backVel = 1;
  setInterval(function(){
      if (obj.x < pointA) {obj.x = pointA; }
      if (obj.x == pointA) {backVel = 1; }
      if (obj.x >= pointA) {obj.x += goingVel; }
      if (obj.x > pointB) {obj.x = pointB; }
      if (obj.x == pointB) {backVel = 3; }
      if (obj.x <= pointB) {obj.x -= backVel; }
  }, vel);
}
