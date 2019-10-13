function bezierEllipse(pts, radius, controlRadius) {
    //float theta = 0;
    beginShape();
    let cx1 = 0;
    let cy1 = 0;
    let cx2 = 0;
    let cy2 = 0;
    let ax = 0;
    let ay = 0;
    let rot = TWO_PI / pts;
    let theta = 0;
    let controlTheta1 = rot / 3.0;
    let controlTheta2 = controlTheta1 * 2.0;
    // float controlRadius = radius/cos(controlTheta1); randomized now
  
  
    for (let i = 0; i < pts; i++) {
      cx1 = cos(theta + controlTheta1) * controlRadius;
      cy1 = sin(theta + controlTheta1) * controlRadius;
      cx2 = cos(theta + controlTheta2) * controlRadius;
      cy2 = sin(theta + controlTheta2) * controlRadius;
      ax = cos(theta + rot) * radius;
      ay = sin(theta + rot) * radius;
  
      if (i == 0) {
        // initial vertex required for bezierVertex()
        vertex(cos(0) * radius, sin(0) * radius);
      }
      // close ellipse
      if (i == pts - 1) {
        bezierVertex(cx1, cy1, cx2, cy2, cos(0) * radius,
          sin(0) * radius);
      }
      // ellipse body
      else {
        bezierVertex(cx1, cy1, cx2, cy2, ax, ay);
      }
  
      /*
      // Use cx2, cy2 of current vertex and cx1, cy1 of next vertex 
       // to draw handles between anchor and controls
       let cx1Next = cos(theta + controlTheta1+rot)*controlRadius;
       let cy1Next = sin(theta + controlTheta1+rot)*controlRadius;
       let(ax, ay, cx1Next, cy1Next);
       let(ax, ay, cx2, cy2);
       
       // draw control and anchor points
       fill(0, 0, 255);
       rect(cx1-3, cy1-3, 6, 6);
       fill(0, 255, 255);
       rect(cx2-3, cy2-3, 6, 6);
       fill(255, 127, 0);
       ellipse(ax, ay, 6, 6);
       */
  
      theta += rot;
    }
    stroke(255);
    noFill();
    endShape();
  } 