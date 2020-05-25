let frame = 0;
let video;
let poseNet;
let pose;
let state = 'waiting';
let brain = [];

let shoulder;

let switcher = 0, checker;
let canvas;
let Langle, Rangle, Cangle;
let nose;
let left2, left1;
let right1, right2;
var angleRadians;
//     brain stores all json values !


function keyPressed() {
  if (key == 's') {
    // console.log(shoulder);
    // console.log("Left Angle:",Langle, " Right Angle:",Rangle);
    // console.log(Cangle);
  }
}

function setup() {
  var button = document.getElementById("clickme");
  button.onclick = function() {
    checker = switcher / 2
    checker = checker % 1;
    switcher = switcher + 1;
    frame = 0;
    // console.log(checker % 1);
  };
  canvas = createCanvas(640, 480);
  canvas.position(0, 0);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

}



function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    brain.push(pose.keypoints);
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function vectorize(p1, p2, p3, p4) {
  return createVector(p2 - p1, p4 - p3)
}


function draw() {
  image(video, 0, 0, video.width, video.height);

  if (pose && checker == 0) {
    for (let i = 0; i < 7; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 0, 255)
      ellipse(x, y, 10, 10);
    }
    //Creates vectors     
    leftEye = [pose.keypoints[1].position.x, pose.keypoints[1].position.y];
    rightEye = [pose.keypoints[2].position.x, pose.keypoints[2].position.y];
    leftEar = [pose.keypoints[3].position.x, pose.keypoints[3].position.y];
    rightEar = [pose.keypoints[4].position.x, pose.keypoints[4].position.y];
    nose = [pose.keypoints[0].position.x, pose.keypoints[0].position.y];

    left2 = vectorize(leftEye[0], nose[0], leftEye[1], nose[1]);
    left1 = vectorize(leftEye[0], leftEar[0], leftEye[1], leftEar[1]);

    right2 = vectorize(rightEye[0], nose[0], rightEye[1], nose[1]);
    right1 = vectorize(rightEye[0], rightEar[0], rightEye[1], rightEar[1]);
    // draws vectors
    let v1 = createVector(leftEye[0], leftEye[1]);
    let v2 = createVector(rightEye[0], rightEye[1]);
    drawArrow(v1, left2, 'red');
    drawArrow(v1, left1, 'red');

    drawArrow(v2, right2, 'red');
    drawArrow(v2, right1, 'red');
    Langle = left1.angleBetween(left2);
    Rangle = right2.angleBetween(right1);


    var leftShoulder = pose.keypoints[5].position.x;
    var rightShoulder = pose.keypoints[6].position.x;
    shoulder = Math.abs(leftShoulder - rightShoulder);

    // var conf_avg = (pose.keypoints[3].score + pose.keypoints[4].score);
    Cangle = left2.angleBetween(right2);

    
    if (Cangle < -1.45 && Cangle > -1.87){
      if((Langle > 1.60 && Langle < 1.95 ) && (Rangle > 1.60 && Rangle < 1.99)){
        rec("Good Eye Contact",height-35,1);
      } else {rec("Adjust eye contact toward webcam",height-35,0);} 

    } else if (Cangle < -1.87){rec("Move your head lower",height-35,0);}
      else {rec("Move your head up",height-35,0);}


    if (shoulder >= 300 && shoulder <= 400) {
      rec("Good Posture", height - 10, 1);
      // potentially use count to reduce glitchy-ness
    } else if (shoulder < 300){rec("Move closer for better posture", height - 10, 0);} 
    else {rec("Move further away for better posture", height - 10, 0);}
    
  }
}

function rec(output, pos, check) {
  if (check == 1) {
    fill(0, 255, 0);
  } else if (check == 0) {
    fill(255, 0, 0);
  } else {
    fill(239, 145, 17);
  }

  noStroke();
  textSize(25);
  textAlign(RIGHT, CENTER);
  text(output, width, pos);
  
}

function median(values) {
  values.sort(function(a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 0;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}