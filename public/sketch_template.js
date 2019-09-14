
var socket;
var width   = window.innerWidth;
var height  = window.innerHeight;
var angle =0;

socket = io.connect(config.env);
//socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})
socket.on('connect', function (socketObj) {
  socket.emit('p5socket', {'idp5' : socket.id});
});

// on Click Handle
function onClickHandle(data) {
}


// on move mouse Handle
function onMoveHandle(data) {

}

// on scroll Handle
function onScrollHandle(data) {

}

// on visited Handle
function onVisited(data) {
  userArray[data.userSessionId].newSite(data.title);
  
}


// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    colorMode(HSB, 360, 100, 100);
    strokeWeight(2);
    angleMode(DEGREES);
    

    slider = createSlider(0, 50, 10);
    slider.position(width/2, 20);


    socket.on('clickEvent', onClickHandle);
    socket.on('mouse2', onMoveHandle);
    socket.on('scroll', onScrollHandle);
    socket.on('visited', onVisited);


}

function draw() {
  translate(width/2, height/2);
  noStroke();
  fill(100+sin(angle)*60, 100, 100, 0.4);
  rotate(angle);
  rect(0,0, 100, 100); 
  angle =angle +2;
}


function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
 }

