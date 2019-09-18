
var socket;
var flag;
var width = window.innerWidth;
var height = window.innerHeight;
var lastClick={};
var old = {};
var mousePosition={};

//socket = io.connect(config.env);
socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})

socket.on('connect', function (socketObj) {
  socket.emit('p5socket', {'idp5' : socket.id});
  socket.on('clickEvent', onClickHandle);
  socket.on('mouse2', onMoveHandle);
  socket.on('scroll', onScrollHandle);
});



// on Click Handle
function onClickHandle(data) {
  var x = data.x*window.innerWidth; 
  var y = data.y*window.innerHeight;
  //console.log('---' + data.x + ' =' + lastClick.x );
  stroke(30);
  strokeWeight(2);
  fill(data.color);
  ellipse(old.x,old.y, 4,4);
  lastClick = {'x' : x, 'y': y};
}


// on move mouse Handle
function onMoveHandle(data) {
  //console.log('-- Mouse msg received : ' + data.y +' // '+ Math.log(data.y*4) + ' // '+ Math.log(data.y*2) );
  var x = data.x*window.innerWidth; 
  var y = data.y*window.innerHeight;
  var lastX = data.lastX*window.innerWidth; 
  var lastY = data.lastY*window.innerHeight;

  if (old != {}){
    fill(255);
    stroke(data.color);
    strokeWeight(2);
    line(x,y, lastX, lastY);
  }
  old = {
    'x' : x,
    'y' : y
  };
}

// on scroll Handle
function onScrollHandle(data) {
  //console.log('-- Scroll msg received : ' + JSON.stringify(data));
  var position = data.position; 
  stroke(data.color);
  strokeWeight(2);
  line(data.lastX*window.innerWidth-20, data.lastY*window.innerHeight+position, data.lastX*window.innerWidth+20, data.lastY*window.innerHeight+position);
  line(data.lastX*window.innerWidth, old.y = data.lastY*window.innerHeight+position);
  old.y = data.lastY*window.innerHeight+position;
}



// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    fill(255);
    stroke(255);
    strokeWeight(2);    
}


function draw() {
  
}

function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
 }