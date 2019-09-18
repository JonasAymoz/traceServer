
var socket;
var width   = window.innerWidth;
var height  = window.innerHeight;
var angle =0;
var timer=0;
var userMouseX;
var userMouseY;
var mouseIsMoving = false;
var organics = [];
var colorsPalette;
var px_offset = 0;    // amplitude
var NOISE_SCALE = 40;

var change,off,zoff;

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

// on visited Handle
function onThirdParty(data) {
  var size = random(20,80);
  organics.push(new Organic(0.1+1*size,random(width),random(height),size/3,random(100)*random(90),colorsPalette[floor(random(8))], data.url));
}

// processing sketch
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    colorMode(HSB, 360, 100, 100);
    strokeWeight(2);
    change = 100;
    off= 100;
    zoff= 100;
    colorsPalette = [color(146, 167, 202,30),
      color(186, 196, 219,30),
      color(118, 135, 172,30),
      color(76, 41, 81,30),
      color(144, 62, 92,30),
      color(178, 93, 119,30),
      color(215, 118, 136,30),
      color(246, 156, 164,30)];

    socket.on('clickEvent', onClickHandle);
    socket.on('mouse2', onMoveHandle);
    socket.on('scroll', onScrollHandle);
    socket.on('thirdParty', onThirdParty);
    var size = 120;
    //organics.push(new Organic(0.1+size,random(width),random(height),size/2,random(90),colorsPalette[floor(random(8))]));
    //organics.push(new Organic(0.1+size,random(width),random(height),size/2,random(90),colorsPalette[floor(random(8))]));
}

function draw() {
  background(255);
  
  for(var i=0; i<organics.length;i++){
    organics[i].show(change);
  }
  // control the speed
  change+=0.02;
  zoff += 0.02;
  //off+=0.05;
}


function keyTyped() {
  if (key == "s") {
  save("image" + ".png");
  }
  if (key =='a'){
    let size = random(80,120);
    organics.push(new Organic(0.1+1*size,random(width),random(height),size/3,random(100)*random(90),colorsPalette[floor(random(8))], "nothing"));
  }
 }


 function Organic(radius,xpos,ypos,roughness,angle,color, text){

  this.radius = radius; //radius of blob
  this.xpos = xpos; //x position of blob
  this.ypos = ypos; // y position of blob
  this.roughness = roughness; // magnitude of how much the circle is distorted
  this.angle = angle; //how much to rotate the circle by
  this.color = color; // color of the blob

  this.show = function(change){

	noStroke(); // no stroke for the circle
	fill(this.color); //color to fill the blob
	
//we enclose things between push and pop so that all transformations within only affect items within
	push(); 
	translate(xpos, ypos); //move to xpos, ypos
	//rotate(this.angle+change); //rotate by this.angle+change

	//begin a shape based on the vertex points below
	beginShape(); 

	//The lines below create our vertex points
	for (var i = 0; i < TWO_PI; i += 0.1) {
	  //var offset = map(noise(off, change), 0, 1, -this.roughness, this.roughness);
	  //var r = this.radius + offset;
	  var x = this.radius * sin(i);
    var y = this.radius * cos(i);

    var newX = x + (noise(((off+x)/NOISE_SCALE),((change+y)/NOISE_SCALE), zoff) * roughness * sin(i));
    var newY = y + (noise(((off+x)/NOISE_SCALE),((change+y)/NOISE_SCALE), zoff) * roughness * cos(i));
    //ellipse(newX,newY, 2, 2);
    vertex(newX, newY);
    //vertex(x, y);
    off +=0.001;
	}
	endShape(); //end and create the shape
	pop();

	}
}