
var socket;
var width = window.innerWidth;
var height = window.innerHeight;
var angle = 0;
var timer = 0;
var userMouseX;
var userMouseY;
var mouseIsMoving = false;
var organics = [];
var lineArray = [];
var mousePointArray = [];
var textArray = [];
var cookieArray = [];
var colorsPalette;
var px_offset = 0;    // amplitude
var NOISE_SCALE = 40;
var lineArraySize = 0;
let paletNeonRGB = [{ 'r': 60, 'g': 185, 'b': 252 }, { 'r': 181, 'g': 55, 'b': 242 }, { 'r': 138, 'g': 43, 'b': 226 }, { 'r': 18, 'g': 0, 'b': 82 }]

var flag;
var lastClick = {};
var old = {};
var mousePosition = {};
var cleaner;

var change, off, zoff;


//
// ------------ Socket connection -----------------------------
//
socket = io.connect(config.env);
//socket = io.connect('https://jonasaymoz.fr',{ path: '/ctc/traceServer/socket.io'})
socket.on('connect', function (socketObj) {
  socket.emit('p5socket', { 'idp5': socket.id });
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
  //console.log('-- Mouse msg received : ' + data.y +' // '+ Math.log(data.y*4) + ' // '+ Math.log(data.y*2) );
  var x = data.x * window.innerWidth;
  var y = data.y * window.innerHeight;
  var lastX = data.lastX * window.innerWidth;
  var lastY = data.lastY * window.innerHeight;
  userMouseX = data.x * window.innerWidth;
  userMouseY = data.y * window.innerHeight;

  if (mousePointArray.length > 2) {
    lineArray.push(new Line(x, y, mousePointArray[mousePointArray.length - 1].x, mousePointArray[mousePointArray.length - 1].y, data.color, mousePointArray[mousePointArray.length - 2].x, mousePointArray[mousePointArray.length - 2].y));
    lineArraySize++;
  }
  mousePointArray.push({ 'x': x, 'y': y });
  //console.log(lineArraySize + '-' + mousePointArray.length+'--' + old.x );
  if (old != {}) {
    fill(255);
    strokeWeight(0.5);
    //line(x,y, lastX, lastY);
  }
  old = {
    'x': x,
    'y': y
  };
}

// on scroll Handle
function onScrollHandle(data) {
  //console.log('-- Scroll msg received : ' + JSON.stringify(data));
  var position = data.position;
  stroke(data.color.r, data.color.g, data.color.b);
  strokeWeight(2);
  //line(data.lastX*window.innerWidth-20, data.lastY*window.innerHeight+position, data.lastX*window.innerWidth+20, data.lastY*window.innerHeight+position);
  //line(data.lastX*window.innerWidth, old.y = data.lastY*window.innerHeight+position);
  old.y = data.lastY * window.innerHeight + position;
}

// on visited Handle
function onVisited(data) {
  // TODO time for each site:
  userArray[data.userSessionId].newSite(data.title);
  timer = 0;
}

// on visited Handle
function onThirdParty(data) {
  var size = data.url.length;
  let colorBlob;
  switch (data.type) {
    case 'image': colorBlob = paletNeonRGB[0]; break;
    case 'script': colorBlob = paletNeonRGB[1]; break;
    case 'xmlhttprequest': colorBlob = paletNeonRGB[2]; break;
    default: colorBlob = paletNeonRGB[3]; break;
  }
  organics.push(new Organic(0.1 + 1 * size, random(width), random(height), size / 3, random(100) * random(90), colorBlob, data.url));
}

function onKeyboardInput(data) {
  //console.log('KeyBoardiNput : '+ data.value);
  var x = random(width);
  var y = random(height);
  textArray.push({ 'data': data, 'x': x, 'y': y, opacite: 255, rotateY : random(0, 50) });
}

function onCookie(data) {
  //console.log('Cookie : '+ data.name + '-');
  let x = random(width);
  let y = random(height);
  let radius = random(-20, 20);
  let control = random(-20, 20);
  let points = map(data.value.length, 0, 3000, 3, 25);
  data.x = x;
  data.y = y;
  cookieArray.push({ 
    'value': data.value, 
    'x': x, 'y':y, 
    'dateOfBirth' : millis(),
    'radius' : radius,
    'control':control,
    'points' : points,
    'direction' : random([-1,1])
   });
}


//
// ------------ SKETCH CODE -----------------------------
// 

 var f;
function preload() {
  f = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(24);
  change = 100;
  off = 100;
  zoff = 100;
  var size = 120;
  colorsPalette = ['#021BDC', '#E847AE', '#13CA91', '#FF9472'];
  cleaner = millis();
  stroke(255);
  push();
  //translate(width/2, height/2);
  
  pop();
  textFont(f, 12);

}

// ---------
//  DRAW
// ---------

function draw() {
  
  background(0, 0, 0, 20);

  for (var i = 0; i < organics.length; i++) {
    organics[i].show(change);
  }
  for (var y = 0; y < lineArray.length; y++) {
    lineArray[y].display();
  }
  for(var k=0; k<cookieArray.length;k++){
    //console.log('cookieprint' + JSON.stringify(cookieArray[k], null,2));
    strokeWeight(1);
    push();
    translate(cookieArray[k].x, cookieArray[k].y);
    rotate(cookieArray[k].direction*angle%360);
    bezierEllipse(cookieArray[k].points, cookieArray[k].radius, cookieArray[k].control);
    pop(); 
    //ellipse(cookieArray[k].x,cookieArray[k].y, 1, 1);
    //text(cookieArray[k].name, cookieArray[k].x, cookieArray[k].y);
  }
  for (var z = 0; z < textArray.length; z++) {
    fill(255, 255, 255, textArray[z].opacite);
    noStroke();
    textSize(12);
    push();
    //rotateY(textArray[z].rotateY);
    text(textArray[z].data.value, textArray[z].x, textArray[z].y);
    pop();
    textArray[z].opacite -=0.6;
  }
  // control the speed
  change += 0.02;
  zoff += 0.02;
  angle+=0.02;

  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  text("cookie: " + cookieArray.length.toFixed(2), 10, height - 30);


  if (millis() - cleaner > 5000){
    let tempArray = lineArray.filter(function(value, index, arr){
      return value.opacity > 5;
    });
    let tempCookieArray = cookieArray.filter(function(value, index, arr){
      return millis() - value.dateOfBirth < 5000;
    });
    //console.log(lineArray.length +" new size : " + tempArray.length);
    console.log(cookieArray.length +" cookie new size : " + cookieArray.length);
    lineArray = tempArray;
    cookieArray = tempCookieArray;
    cleaner = millis();
  }

}





//
// ------------ Canvas stufss -----------------------------
//
function keyTyped() {
  if (key == "s") {
    save("image" + ".png");
  }
  if (key == "r") {
    resetCanvas();
  }
  if (key == 'a') {
    let size = random(200, 200);
    organics =[];
    organics.push(new Organic(0.1 + 1 * size, width/2, height/2, size / 3, random(100) * random(90), paletNeonRGB[floor(random(4))], "nothing"));
  }
  else if (key == 'c') {
    let size = random(80, 120);
    cookieArray =[];
    cookieArray.push({ 
      'value': 'cookie', 
      'x': width/2, 'y':height/2, 
      'dateOfBirth' : millis(),
      'radius' : 200,
      'control':random(-20,20),
      'points' : random(3,25),
      'direction' : random([-1,1])
     });
  }
}

function resetCanvas() {
  organics = [];
  lineArray = [];
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
    if (prevX != undefined) {
      this.prevX = prevX;
      this.prevY = prevY;
    }
    if (this.color =='#3B27BA'){
      this.color = '#E847AE';
    } else {
      this.color = color;
    }
    this.opacity = 255;
  }

  display() {
    let tempX = this.lastX;
    let tempY = this.lastY;
    let slope = (this.prevY - this.lastY) / (this.prevX - this.lastX);
    // prevY =slope*prevX +b
    let b = this.prevY - (slope * this.prevX);
    //console.log('b ' + b);
    let min = (this.prevX<this.lastX)? this.prevX : this.lastX;
    let max = (this.prevX>this.lastX)? this.prevX : this.lastX;
    for(var i=min; i<max; i=i+10){
      stroke(this.color.r, this.color.g-this.opacity, this.color.b, this.opacity);
      //stroke(255,255,255, this.opacity);
      strokeWeight(0.5);
      //console.log(i+ '-'+slope*i+b)
      line(this.x, this.y, i, slope*i+b);
      //bezier(this.x, this.y, this.x+random(1,-1)*i, this.y, i, slope*i+b, i, slope*i+b);
      this.opacity-=0.6;
    }

    //line(this.x, this.y, this.prevX, this.prevY);
    stroke(this.color.r, this.color.g, this.color.b, this.opacity);
    strokeWeight(2);
    line(this.x, this.y, this.lastX, this.lastY);
    this.opacity -= 0.5;
  }
}