
var socket;
var flag;
var width   = window.innerWidth;
var height  = window.innerHeight;
var userArray = {};
var xOff = 0.02;

socket = io.connect(config.env);
socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})
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

function newUser(data) {
  //if not in list
  if (userArray[data.userId] == null || userArray[data.userId] == undefined){
    let user = new User();
    console.log('createnewUser');
    userArray[data.userId] = user;
  }
}

// on scroll Handle
function onVisited(data) {
  userArray[data.userSessionId].newSite(data.title);
}



// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    fill(0);
    stroke(0);
    strokeWeight(2);
    socket.on('clickEvent', onClickHandle);
    socket.on('mouse2', onMoveHandle);
    socket.on('scroll', onScrollHandle);
    socket.on('visited', onVisited);
    socket.on('newUser', newUser);
}


function draw() {  
  for (let i=0; i<Object.keys(userArray).length ; i++ ) {
    userArray[Object.keys(userArray)[i]].show();
    //console.log(userArray[i]);
  } 
  xOff =+ 0.02;
}


class User {

  constructor(){
    this.startX = width/2;
    this.startY = 0;
    this.speedY = 20;
    this.paths = [];
  }

  show(){
    stroke(0,0,200);
    strokeWeight(1.5);
    for (let i=0; i< this.paths.length ; i++ ) {
      line(this.paths[i].x, this.paths[i].y, this.paths[i].endX, this.paths[i].endY);
    }
  }

  setSpeed(value){
    this.speedY = value;
  }

  newSite(title){
    // add line to array
    let tempX = this.startX + map(noise(this.startX), 0, 1, -width/4, width/4);
    let tempY = this.startY + this.speedY;
    let line = {
      x : this.startX,
      y : this.startY,
      endX : tempX,
      endY : tempY
    };
    this.paths.push(line);
    // start new one
    this.startX=tempX;
    this.startY=tempY;

    // Add text
    strokeWeight(0);
    if (Math.random()>0.5){
      text(title, tempX + 5 , tempY, 200, 20);
    } else {
      text(title, tempX-200, tempY, 200, 20);
    }
  }

}

function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
 }

