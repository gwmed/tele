let video;
let poseNet;
let pose;
let state = 'waiting';
let brain = []

let canvas;

function keyPressed(){
  if (key == 's'){
    console.log(brain)
  }  

  
}

function setup() {
  canvas = createCanvas(640,480);
  canvas.position(0,0);
  video = createCapture(VIDEO);
  video.hide();            
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

}

function gotPoses(poses){
  // console.log(poses);
  if(poses.length > 0){
    pose = poses[0].pose;
    brain.push(pose.keypoints);

  }

}

function modelLoaded(){
  console.log('poseNet ready');  
}

function draw(){
  image(video, 0 ,0, video.width, video.height);
  
  if (pose){
    for (let i=0; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill (0,0,255)
      ellipse(x,y,10,10);
    }
    
  }
}