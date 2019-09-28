
var socket;
var width   = window.innerWidth;
var height  = window.innerHeight;
var angle =0;
var timer=0;
var userMouseX;
var userMouseY;
var mouseIsMoving = false;
var organics = [];
var lineArray=[];
var mousePointArray=[];
var textArray = [];
var cookieArray=[];
var colorsPalette;
var px_offset = 0;    // amplitude
var NOISE_SCALE = 40;
var lineArraySize = 0;




var flag;
var lastClick={};
var old = {};
var mousePosition={};

var change,off,zoff;


//
// ------------ Socket connection -----------------------------
//
//socket = io.connect(config.env);
socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})
socket.on('connect', function (socketObj) {
  socket.emit('p5socket', {'idp5' : socket.id});
  socket.on('mouse2', onMoveHandle);
  socket.on('scroll', onScrollHandle);
  socket.on('thirdParty', onThirdParty);
  socket.on('keyboardInput', onKeyboardInput);
  socket.on('cookie', onCookie);
  console.log("client connection");
});


//
// ------------ EVENT HANDLE -----------------------------
//

// on Click Handle
function onClickHandle(data) {
}


// on move mouse Handle
function onMoveHandle(data) {
  console.log('-- Mouse msg received : ' + data.y +' // '+ Math.log(data.y*4) + ' // '+ Math.log(data.y*2) );
  var x = data.x*window.innerWidth; 
  var y = data.y*window.innerHeight;
  var lastX = data.lastX*window.innerWidth; 
  var lastY = data.lastY*window.innerHeight;
  userMouseX = data.x*window.innerWidth; 
  userMouseY = data.y*window.innerHeight;


  if(mousePointArray.length > 2){
    lineArray.push(new Line(x,y,mousePointArray[mousePointArray.length-1].x,mousePointArray[mousePointArray.length-1].y, data.color, mousePointArray[mousePointArray.length-2].x, mousePointArray[mousePointArray.length-2].y));
    lineArraySize++;
  }
    mousePointArray.push({'x':x,'y':y});
    console.log(lineArraySize + '-' + mousePointArray.length+'--' + old.x );
  if (old != {}){
    fill(255); 
    strokeWeight(0.5);   
    //line(x,y, lastX, lastY);
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

// on visited Handle
function onVisited(data) {
  userArray[data.userSessionId].newSite(data.title);
  timer =0;
}

// on visited Handle
function onThirdParty(data) {
  var size = random(20,80);
  organics.push(new Organic(0.1+1*size,random(width),random(height),size/3,random(100)*random(90),colorsPalette[floor(random(8))], data.url));
}

function onKeyboardInput(data){
  //console.log('KeyBoardiNput : '+ data.value);
  var x = random(width);
  var y= random(height);
  textArray.push({'data':data, 'x':x, 'y':y});
}

function onCookie(data) {
  console.log('Cookie : '+ data.name + '-');
  let x = random(width);
  let y = random(height);
  data.x= x;
  data.y= y;
  cookieArray.push({'value':data.value, 'x':x, 'y':y});
}


//
// ------------ SKETCH CODE -----------------------------
// 

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    //background(255);
    //colorMode(, 360, 100, 100);
    strokeWeight(2);
    change = 100;
    off= 100;
    zoff= 100;
    var size = 120;
    colorsPalette = [color(146, 167, 202,30),
      color(186, 196, 219,30),
      color(118, 135, 172,30),
      color(76, 41, 81,30),
      color(144, 62, 92,30),
      color(178, 93, 119,30),
      color(215, 118, 136,30),
      color(246, 156, 164,30)];


}

// ---------
//  DRAW

function draw() {
  background(0);
  
  
  for(var i=0; i<organics.length;i++){
    organics[i].show(change);
  }
  for(var y=0; y<lineArray.length;y++){
    lineArray[y].display();
  }
  for(var k=0; k<cookieArray.length;k++){
    //console.log('cookieprint');
    //fill(255,255,255,100);
    //noStroke();
    //ellipse(cookieArray[k].x,cookieArray[k].y, 1, 1);
    //text(cookieArray[k].name, cookieArray[k].x, cookieArray[k].y);
  }
  for(var z=0; z<textArray.length;z++){
    fill(255);
    noStroke();
    textSize(10);
    text(textArray[z].data.value, textArray[z].x, textArray[z].y);
  }
  // control the speed
  change+=0.02;
  zoff += 0.02;
}





//
// ------------ Canvas stufss -----------------------------
//
function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
  if(key == "r"){
    resetCanvas();
  }
  if (key =='a'){
    let size = random(80,120);
    organics.push(new Organic(0.1+1*size,random(width),random(height),size/3,random(100)*random(90),colorsPalette[floor(random(8))], "nothing"));
  }
}

function resetCanvas(){
  organics = [];
  lineArray=[];
  textArray = [];
  cookieArray = [];
}


// UTILS

function text2Binary(string) {
  return string.split('').map(function (char) {
      return char.charCodeAt(0).toString(2);
  }).join(' ');
}


  // line Mouse 
  class Line {
    constructor(x, y, lastX, lastY, color, prevX, prevY) {
      this.x = x;
      this.y = y;
      this.lastX = lastX;
      this.lastY = lastY;
      if(prevX!=undefined){
        this.prevX = prevX;
        this.prevY = prevY;
      }
      this.color = color;
      this.opacity = 255;
    }
  
    display() {
      let tempX = this.lastX;
      let tempY = this.lastY;
      let slope= (this.prevY - this.lastY)/(this.prevX-this.lastX);
      // prevY =slope*prevX +b
      let b = this.prevY-(slope*this.prevX);
      //console.log('b ' + b);
      
      for(var i=this.prevX; i<this.lastX; i=i+3){
        stroke(255,255,255, this.opacity);
        strokeWeight(0.5);
        console.log(i+ '-'+slope*i+b)
        line(this.x, this.y, i, slope*i+b);
        //bezier(this.x, this.y, this.x+random(1,-1)*i, this.y, i, slope*i+b, i, slope*i+b);
        this.opacity-=0.3;
      }

      //line(this.x, this.y, this.prevX, this.prevY);
      stroke(this.color);
      strokeWeight(2);
      line(this.x, this.y, this.lastX, this.lastY);
      this.opacity-=0.3;
    }
  }