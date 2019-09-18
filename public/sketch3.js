
var socket;
var width   = window.innerWidth;
var height  = window.innerHeight;
var angle =0;
var timer=0;
var userMouseX;
var userMouseY;
var mouseIsMoving = false;

//socket = io.connect(config.env);
socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})
socket.on('connect', function (socketObj) {
  socket.emit('p5socket', {'idp5' : socket.id});
  console.log("client connection");
});

// on Click Handle
function onClickHandle(data) {
}


// on move mouse Handle
function onMoveHandle(data) {
  userMouseX = data.x*window.innerWidth; 
  userMouseY = data.y*window.innerHeight;
}

// on scroll Handle
function onScrollHandle(data) {

}

// on visited Handle
function onVisited(data) {
  userArray[data.userSessionId].newSite(data.title);
  timer =0;
}


// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    colorMode(HSB, 360, 100, 100);
    strokeWeight(2);

    slider = createSlider(0, 50, 10);
    slider.position(width/2, 20);


    socket.on('clickEvent', onClickHandle);
    socket.on('mouse2', onMoveHandle);
    socket.on('scroll', onScrollHandle);
    socket.on('visited', onVisited);

}

function draw() {
  stroke(200 ,100,100, 0.4);
  fill(255+userMouseX, 0.3);
  console.log(" dans le move " + userMouseX);
  if (timer < 500 ) {
    ellipse(userMouseX, userMouseY, 3+timer/4, 3+timer/4);
    timer ++;
  }
}


function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
 }

