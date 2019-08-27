var socket;
var flag;
var width   = window.innerWidth;
var height  = window.innerHeight;

socket = io.connect('http://localhost:4000');
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

// on scroll Handle
function onVisited(data) {
  fill(50);
  background(random(240));
  text(data.title, random(width), random(height), 70, 80);
}



// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    fill(255);
    stroke(255);
    strokeWeight(2);
    socket.on('clickEvent', onClickHandle);
    socket.on('mouse2', onMoveHandle);
    socket.on('scroll', onScrollHandle);
    socket.on('visited', onVisited);
}


function draw() {
  
}