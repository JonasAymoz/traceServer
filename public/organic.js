function Organic(radius,xpos,ypos,roughness,angle,color, text){

    this.radius = radius; //radius of blob
    this.xpos = xpos; //x position of blob
    this.ypos = ypos; // y position of blob
    this.roughness = roughness; // magnitude of how much the circle is distorted
    this.angle = angle; //how much to rotate the circle by
    this.color = color; // color of the blob
    this.birthTime = millis();
    this.opacity = 255;
  
    this.show = function(change){
  
      if (millis()-this.birthTime<300000000000) {
      
        stroke(2);
        noFill();
        push(); 
        translate(xpos, ypos); //move to xpos, ypos
        //rotate(this.angle+change); //rotate by this.angle+change
        beginShape(); 
        //The lines below create our vertex points
        for (var i = 0; i < TWO_PI; i += 0.1) {
          //var offset = map(noise(off, change), 0, 1, -this.roughness, this.roughness);
          //var r = this.radius + offset;
          var x = this.radius * sin(i);
          var y = this.radius * cos(i);
  
          var newX = x + (noise(((off+x)/NOISE_SCALE),((change+y)/NOISE_SCALE), zoff) * roughness * sin(i));
          var newY = y + (noise(((off+x)/NOISE_SCALE),((change+y)/NOISE_SCALE), zoff) * roughness * cos(i));
          
          vertex(newX, newY);
          //vertex(x, y);
          off +=0.001;
          strokeWeight(0.9);
          //console.log(this.color);
          stroke(this.color.r,this.color.g, this.color.b, this.opacity);
          
          //ellipse(xpos+this.radius/2-i, ypos+this.radius/2-i, 100/i);
          //line(x, y, width/2-xpos, height-ypos);
          //console.log (i + ']]' + height);
        }
        //ellipse(x, y , radius, radius);
        this.opacity-=0.2;
        if (this.radius>0){
          this.radius-=0.2;
        } else {
         //rien 
        }
        endShape(); 
        pop();
  
      }
    }
  }
  
  
