console.log('ml5 version:', ml5.version);

let video;
let posenet;
let pose;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, ()=>console.log("Web cam is onn"));
  video.hide();
  posenet = ml5.poseNet(video, ()=>console.log("PoseNet model loaded"));
  posenet.on("pose", (poses)=>{
    console.log("PoseNet is onn");
    if(poses.length > 0) {
      console.log("len is +ve");
      pose = poses[0].poses;
    }
  });
}

function draw() {
  background(200);
  image(video, 0, 0);
  if(pose) {
    fill(255,0,0);
    ellipse(pose.nose.x, pose.nose.y, 10);
    fill(0,0,255);
    ellipse(pose.rightWrite.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
  }
}