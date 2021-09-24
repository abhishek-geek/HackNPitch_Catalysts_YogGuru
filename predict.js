let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";

let state = 'waiting';
let targetLabel;

let input = "";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  
  // LOAD PRETRAINED MODEL
  const modelInfo = {
    model: './model/model.json',
    metadata: './model/model_meta.json',
    weights: './model/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);

  // LOAD TRAINING DATA
  // brain.loadData("./data/rl.json", dataReady);
}

function brainLoaded() {
  console.log("loaded pretrained model");
  // state = "predicting";
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  let res = results[0];
  if(res.label == "p") {
    if (results[0].confidence > 0.9999999) {
      poseLabel = results[0].label.toUpperCase();
    } else {
      poseLabel = "";
    }
    classifyPose();
  }
  if(res.label == "w") {
    if (results[0].confidence > 0.75) {
      poseLabel = results[0].label.toUpperCase();
    } else {
      poseLabel = "";
    }
    classifyPose();
  }
}

function dataReady() {
  brain.normalizeData();
  brain.train({
    epochs: 50
  }, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
  classifyPose();
}

function gotPoses(poses) {
  // console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}


function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
  
  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  let t = document.getElementById("tree");
  let w = document.getElementById("war");
  w.addEventListener("click", () => {
    console.log("warrr");
    input = "W";
  })

  t.addEventListener("click", () => {
    console.log("treee");
    input = "P";
  })

  fill(255, 0, 255);
  noStroke();
  textSize(50);
  textAlign(CENTER, CENTER);
  // console.log(input);
  if(input == "") {
    text("Choose pose", width/2, height/2);
  }
  else if(input == "P") {
    if(poseLabel == "P")
      text("Correct Pose", width / 2, height / 2);
    else
      text("Wrong Pose", width / 2, height / 2);
  }
  else if(input == "W") {
    if(poseLabel == "W")
      text("Correct Pose", width / 2, height / 2);
    else
      text("Wrong Pose", width / 2, height / 2);
  }
  // text(poseLabel, width / 2, height / 2);
  // if(poseLabel == "P")
  //   text("Tree Pose", width / 2, height / 2);
  // if(poseLabel == "W")
  //   text("Warrior Pose", width / 2, height / 2);
}