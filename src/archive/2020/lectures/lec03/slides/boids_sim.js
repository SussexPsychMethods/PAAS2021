/*  Boids
 *  Agent and GUI script
 *  Copyright 2016 Harmen de Weerd
 */

simulationInfo = {
  roost: {x: 0.5, y: 0.5, z: 0},
  boids: [],
  predators: [],
  boardSize: 500,
  nBoids: 100,
  nPredators: 0,
  birdSpeed: 0.001,
  predatorSpeed: 0.006,
  avoidanceRange: 0.00005,
  alignmentRange: 0.0008,
  attractionRange: 0.005,
  avoidanceStrength: 0.5,
  alignmentStrength: 0.2,
  attractionStrength: 0.01,
  roostActive: true,
  roostRange: 0.1,
  roostStrength: 0.3,
  blindArc: 0.5,
  predatorAvoidance: 0.01,
  predatorAvoidanceStrength: 2,
  zoom: 1,
  handle: 0,
  tick: 0,
  show: {avoid: false, align: false, attract: false, flee: false, roost: false}
};


function getNewBoid() {
  var retVal = {position: {x: Math.random(), y: Math.random(), z: 0}, speed: [{x: Math.random()-0.5, y: Math.random()-0.5, z: 0}, {x: Math.random()-0.5, y: Math.random()-0.5, z: 0}], highlight: false};
  normalize(retVal.speed[0]);
  normalize(retVal.speed[1]);
  return retVal;
}

function init() {
  var i;
  simulationInfo.board = document.createElement("canvas");
  simulationInfo.board.width = simulationInfo.boardSize;
  simulationInfo.board.height = simulationInfo.boardSize;
  addMouseTracker(document.getElementById("viewport"));
  for (i = 0; i < simulationInfo.nBoids; ++i) {
    simulationInfo.boids[i] = getNewBoid();
  }
  for (i = 0; i < simulationInfo.nPredators; ++i) {
    simulationInfo.predators[i] = {position: {x: Math.random(), y: Math.random(), z: 0}, speed: {x: Math.random()-0.5, y: Math.random()-0.5, z: 0}};
    normalize(simulationInfo.predators[i].speed);
  }
  simulationInfo.boids[0].highlight = true;

    // toggleAvoid(document.getElementById("showAvoid").checked);
    // toggleAlign(document.getElementById("showAlign").checked);
    // toggleAttract(document.getElementById("showAttract").checked);
    // toggleFleeing(document.getElementById("showFleeing").checked);
    // toggleRoost(document.getElementById("showRoost").checked);
    // setAvoidRange(document.getElementById("avoidRange").value);
    // setAlignRange(document.getElementById("alignRange").value);
    // setAttractRange(document.getElementById("attractRange").value);
    // setAvoidStrength(document.getElementById("avoidStrength").value);
    // setAlignStrength(document.getElementById("alignStrength").value);
    // setAttractStrength(document.getElementById("attractStrength").value);
    // setFleeStrength(document.getElementById("fleeStrength").value);
    // setFleeRange(document.getElementById("fleeingRange").value);
    // setBoidNumber(document.getElementById("boidDial").value);
    // setPredatorNumber(document.getElementById("predatorDial").value)
    // setRoostSize(document.getElementById("roostDial").value);
    // setBoidSpeed(document.getElementById("speedDial").value);
    // setPredatorSpeed(document.getElementById("predatorSpeedDial").value);
    // setZoom(document.getElementById("zoomDial").value);
  
  step();
}

function normalize(vec) {
  var len = Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
  if (len > 0) {
    len = Math.sqrt(len);
    vec.x /= len;
    vec.y /= len;
    vec.z /= len;
  }
  return vec;
}

function getLength(vec) {
  return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
}

function getDistance(firstVec, secondVec) {
  var dist = Math.pow(firstVec.x - secondVec.x, 2) + Math.pow(firstVec.y - secondVec.y, 2) + Math.pow(firstVec.z - secondVec.z, 2);
  return dist;
}

function multiplyVector(vec, scalar) {
  return {x: vec.x*scalar, y: vec.y*scalar, z: vec.z*scalar};
}

function addVector(firstVec, secondVec) {
  return {x: firstVec.x + secondVec.x, y: firstVec.y + secondVec.y, z: firstVec.z + secondVec.z};
}

function getAngle(firstVec, secondVec) {
  return Math.acos((firstVec.x * secondVec.x + firstVec.y * secondVec.y + firstVec.z * secondVec.z)/(getLength(firstVec)*getLength(secondVec)));
}

function updateAvoidAlignAttract(boidActor, boidObject, avoid, align, attract) {
  var dist = getDistance(boidActor.position, boidObject.position);
  if (dist < simulationInfo.avoidanceRange) {
    avoid.x += (boidActor.position.x - boidObject.position.x)*Math.pow((simulationInfo.avoidanceRange - dist)/simulationInfo.avoidanceRange,2);
    avoid.y += (boidActor.position.y - boidObject.position.y)*Math.pow((simulationInfo.avoidanceRange - dist)/simulationInfo.avoidanceRange,2);
    avoid.z += (boidActor.position.z - boidObject.position.z)*Math.pow((simulationInfo.avoidanceRange - dist)/simulationInfo.avoidanceRange,2);
  }  
  if (dist < simulationInfo.alignmentRange) {
    align.x += (boidObject.speed[simulationInfo.tick].x);
    align.y += (boidObject.speed[simulationInfo.tick].y);
    align.z += (boidObject.speed[simulationInfo.tick].z);
  } 
  if (dist < simulationInfo.attractionRange) {
    attract.x += (boidObject.position.x - boidActor.position.x);
    attract.y += (boidObject.position.y - boidActor.position.y);
    attract.z += (boidObject.position.z - boidActor.position.z);
  }
}

function recalculateSpeeds() {
  var i, j, avoid, align, attract, maxRange, angle, minPoint, countEffectors, skippedEffectors;
  minPoint = 0;
  maxRange = Math.max(Math.sqrt(simulationInfo.attractionRange), Math.sqrt(simulationInfo.alignmentRange), Math.sqrt(simulationInfo.avoidanceRange));
  for (i = 0; i < simulationInfo.boids.length; ++i) {
    avoid = {x: 0, y: 0, z: 0};
    align = {x: 0, y: 0, z: 0};
    attract = {x: 0, y: 0, z: 0};
    for (j = minPoint; j < i; ++j) {
      if (simulationInfo.boids[i].position.x - simulationInfo.boids[j].position.x > maxRange) {
        minPoint++;
        continue;
      }
      if (Math.pow(simulationInfo.boids[i].position.y - simulationInfo.boids[j].position.y,2) > simulationInfo.attractionRange) continue;
      updateAvoidAlignAttract(simulationInfo.boids[i], simulationInfo.boids[j], avoid, align, attract);
    }
    for (j = i+1; j < simulationInfo.boids.length; ++j) {
      if (simulationInfo.boids[j].position.x - simulationInfo.boids[i].position.x > maxRange) break;
      if (Math.pow(simulationInfo.boids[i].position.y - simulationInfo.boids[j].position.y,2) > simulationInfo.attractionRange) continue;
      updateAvoidAlignAttract(simulationInfo.boids[i], simulationInfo.boids[j], avoid, align, attract);
    }
    if (avoid.x != 0 || avoid.y != 0 || avoid.z != 0) {
      avoid = multiplyVector(normalize(avoid), simulationInfo.avoidanceStrength);
    } else {
      avoid = addVector(multiplyVector(normalize(align), simulationInfo.alignmentStrength), multiplyVector(normalize(attract), simulationInfo.attractionStrength));
    }
    simulationInfo.boids[i].speed[1 - simulationInfo.tick] = {x: simulationInfo.boids[i].speed[simulationInfo.tick].x, y: simulationInfo.boids[i].speed[simulationInfo.tick].y, z: simulationInfo.boids[i].speed[simulationInfo.tick].z};
    if (simulationInfo.roostActive && getDistance(simulationInfo.boids[i].position, simulationInfo.roost) > simulationInfo.roostRange) {
      simulationInfo.boids[i].speed[1 - simulationInfo.tick] = normalize(addVector(simulationInfo.boids[i].speed[1 - simulationInfo.tick], multiplyVector(normalize({x: 0.5 - simulationInfo.boids[i].position.x, y: 0.5 - simulationInfo.boids[i].position.y, z: -simulationInfo.boids[i].position.z}), simulationInfo.roostStrength)));
    }
    simulationInfo.boids[i].speed[1 - simulationInfo.tick] = normalize(addVector(simulationInfo.boids[i].speed[1 - simulationInfo.tick], avoid));
    avoid = getPredatorAvoidance(simulationInfo.boids[i]);
    if (avoid.x != 0 || avoid.y != 0 || avoid.z != 0) {
      simulationInfo.boids[i].speed[1 - simulationInfo.tick] = normalize(addVector(simulationInfo.boids[i].speed[1 - simulationInfo.tick], multiplyVector(normalize(avoid), simulationInfo.predatorAvoidanceStrength)));
    }
    if (document.getElementById("viewport").mouse.hasFocus && getDistance(simulationInfo.boids[i].position, getMousePosition()) < simulationInfo.predatorAvoidance) {
      simulationInfo.boids[i].speed[1 - simulationInfo.tick] = multiplyVector(normalize(addVector(simulationInfo.boids[i].speed[1 - simulationInfo.tick], multiplyVector(normalize(getMouseAvoidance(simulationInfo.boids[i])), simulationInfo.predatorAvoidanceStrength))),2);
    }
  }
  reorientPredators();
  simulationInfo.tick = 1 - simulationInfo.tick;
}

function step() {
  var i, j, avoid, align, attract, maxRange, angle, minPoint, countEffectors, skippedEffectors;
  recalculateSpeeds();
  for (i = 0; i < simulationInfo.predators.length; ++i) {
    simulationInfo.predators[i].position.x = (simulationInfo.predators[i].position.x + 1 + simulationInfo.predatorSpeed*simulationInfo.predators[i].speed.x)%1;
    simulationInfo.predators[i].position.y = (simulationInfo.predators[i].position.y + 1 + simulationInfo.predatorSpeed*simulationInfo.predators[i].speed.y)%1;
    simulationInfo.predators[i].position.z = simulationInfo.predators[i].position.z + simulationInfo.predatorSpeed*simulationInfo.predators[i].speed.z;
  }
  for (i = 0; i < simulationInfo.boids.length; ++i) {
    simulationInfo.boids[i].position.x = (simulationInfo.boids[i].position.x + 1 + simulationInfo.birdSpeed*simulationInfo.boids[i].speed[simulationInfo.tick].x)%1;
    simulationInfo.boids[i].position.y = (simulationInfo.boids[i].position.y + 1 + simulationInfo.birdSpeed*simulationInfo.boids[i].speed[simulationInfo.tick].y)%1;
    simulationInfo.boids[i].position.z = simulationInfo.boids[i].position.z + simulationInfo.birdSpeed*simulationInfo.boids[i].speed[simulationInfo.tick].z;
  }
  requestRepaint();
  simulationInfo.boids.sort(function(a, b){
    return a.position.x - b.position.x;
  });
  setTimeout("step();", 20);
}

function reorientPredators() {
  var i, j, minDist, curDist, targetBoid;
  for (i = 0; i < simulationInfo.predators.length; ++i) {
    minDist = getDistance(simulationInfo.predators[i].position, simulationInfo.boids[0].position);
    targetBoid = 0;
    for (j = 1; j < simulationInfo.boids.length; ++j) {
      curDist = getDistance(simulationInfo.predators[i].position, simulationInfo.boids[j].position);
      if (curDist < minDist) {
        minDist = curDist;
        targetBoid = j;
      }
    }
    simulationInfo.predators[i].speed = normalize(addVector(simulationInfo.predators[i].speed, multiplyVector(normalize({x: (simulationInfo.boids[targetBoid].position.x - simulationInfo.predators[i].position.x),
             y: (simulationInfo.boids[targetBoid].position.y - simulationInfo.predators[i].position.y),
             z: (simulationInfo.boids[targetBoid].position.z - simulationInfo.predators[i].position.z)}), 0.1)));
    
  }
}

function getPredatorAvoidance(boidActor) {
  var j, avoid, dist;
  avoid = {x: 0, y: 0, z: 0};
  for (j = 0; j < simulationInfo.predators.length; ++j) {
    dist = getDistance(boidActor.position, simulationInfo.predators[j].position);
    if (dist < simulationInfo.predatorAvoidance) {
      avoid.x += (boidActor.position.x - simulationInfo.predators[j].position.x)*Math.pow((simulationInfo.predatorAvoidance - dist)/simulationInfo.predatorAvoidance, 2);
      avoid.y += (boidActor.position.y - simulationInfo.predators[j].position.y)*Math.pow((simulationInfo.predatorAvoidance - dist)/simulationInfo.predatorAvoidance, 2);
      avoid.z += (boidActor.position.z - simulationInfo.predators[j].position.z)*Math.pow((simulationInfo.predatorAvoidance - dist)/simulationInfo.predatorAvoidance, 2);
    }
  }
  return avoid;
}

function getMouseAvoidance(boidActor) {
  var mousePos = getMousePosition();
  return {x: (boidActor.position.x - mousePos.x), y: (boidActor.position.y - mousePos.y), z: 0};
}

function requestRepaint() {
  if (simulationInfo.handle == 0) {
    simulationInfo.handle = window.requestAnimationFrame(repaint);
  }
}

function getMousePosition() {
return {x: document.getElementById("viewport").mouse.x/(document.getElementById("viewport").width*simulationInfo.zoom) + (1 - 1/simulationInfo.zoom)/2, y: document.getElementById("viewport").mouse.y/(document.getElementById("viewport").height*simulationInfo.zoom) + (1 - 1/simulationInfo.zoom)/2, z: 0};
}

function repaint() {
  var i, ctx;
  ctx = simulationInfo.board.getContext("2d");
  ctx.clearRect(0,0,simulationInfo.boardSize,simulationInfo.boardSize);
  if (simulationInfo.show.roost) {
    ctx.beginPath();
    ctx.arc(simulationInfo.boardSize/2, simulationInfo.boardSize/2, Math.sqrt(simulationInfo.roostRange)*simulationInfo.boardSize, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = "#DDFFFF";
    ctx.fill();
  }
  ctx.fillStyle = "black";
  for (i = 0; i < simulationInfo.predators.length; ++i) {
    ctx.save();
    ctx.translate(simulationInfo.predators[i].position.x*simulationInfo.boardSize, simulationInfo.predators[i].position.y*simulationInfo.boardSize);
    if (simulationInfo.predators[i].speed.y < 0) {
      ctx.rotate(2*Math.PI - Math.acos(simulationInfo.predators[i].speed.x));
    } else {
      ctx.rotate(Math.acos(simulationInfo.predators[i].speed.x));
    }
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(-9,15);
    ctx.lineTo(30,0);
    ctx.lineTo(-9,-15);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();
  }
  for (i = 0; i < simulationInfo.boids.length; ++i) {
    ctx.save();
    ctx.translate(simulationInfo.boids[i].position.x*simulationInfo.boardSize, simulationInfo.boids[i].position.y*simulationInfo.boardSize);
    if (simulationInfo.boids[i].speed[simulationInfo.tick].y < 0) {
      ctx.rotate(2*Math.PI - Math.acos(simulationInfo.boids[i].speed[simulationInfo.tick].x));
    } else {
      ctx.rotate(Math.acos(simulationInfo.boids[i].speed[simulationInfo.tick].x));
    }
    ctx.fillStyle = "black";
    if (simulationInfo.boids[i].highlight) {
      ctx.lineWidth = 4;
      if (simulationInfo.show.flee) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.sqrt(simulationInfo.predatorAvoidance)*simulationInfo.boardSize, 0, 2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#DD00DD";
        ctx.stroke();
      }
      if (simulationInfo.show.attract) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.sqrt(simulationInfo.attractionRange)*simulationInfo.boardSize, 0, 2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#007700";
        ctx.stroke();
      }
      if (simulationInfo.show.align) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.sqrt(simulationInfo.alignmentRange)*simulationInfo.boardSize, 0, 2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#0000FF";
        ctx.stroke();
      }
      if (simulationInfo.show.avoid) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.sqrt(simulationInfo.avoidanceRange)*simulationInfo.boardSize, 0, 2*Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(-3,5);
    ctx.lineTo(10,0);
    ctx.lineTo(-3,-5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx = document.getElementById("viewport").getContext("2d");
  ctx.clearRect(0,0,document.getElementById("viewport").width,document.getElementById("viewport").height);
  ctx.drawImage(simulationInfo.board, simulationInfo.boardSize*(1 - 1/simulationInfo.zoom)/2, simulationInfo.boardSize*(1 - 1/simulationInfo.zoom)/2, simulationInfo.boardSize/simulationInfo.zoom, simulationInfo.boardSize/simulationInfo.zoom, 0, 0, document.getElementById("viewport").width, document.getElementById("viewport").height);
  simulationInfo.handle = 0;
}

function toggleFleeing(newVal) {
  simulationInfo.show.flee = newVal;
}

function toggleRoost(newVal) {
  simulationInfo.show.roost = newVal;
}

function toggleAvoid(newVal) {
  simulationInfo.show.avoid = newVal;
}

function toggleAlign(newVal) {
  simulationInfo.show.align = newVal;
}

function toggleAttract(newVal) {
  simulationInfo.show.attract = newVal;
}

function setFleeRange(newVal) {
  simulationInfo.predatorAvoidance = Math.pow(newVal/1000, 2);
  document.getElementById("fleeingRange").value = newVal;
}

function setAttractRange(newVal) {
  simulationInfo.attractionRange = Math.pow(newVal/1000, 2);
  document.getElementById("attractRange").value = newVal;
}

function setAlignRange(newVal) {
  simulationInfo.alignmentRange = Math.pow(newVal/1000, 2);
  document.getElementById("alignRange").value = newVal;
}

function setAvoidRange(newVal) {
  simulationInfo.avoidanceRange = Math.pow(newVal/1000, 2);
  document.getElementById("avoidRange").value = newVal;
}

function setFleeStrength(newVal) {
  simulationInfo.predatorAvoidanceStrength = Math.pow(newVal/100, 2);
  document.getElementById("fleeStrength").value = newVal;
}

function setAttractStrength(newVal) {
  simulationInfo.attractionStrength = Math.pow(newVal/100, 2);
  document.getElementById("attractStrength").value = newVal;
}

function setAlignStrength(newVal) {
  simulationInfo.alignStrength = Math.pow(newVal/100, 2);
  document.getElementById("alignStrength").value = newVal;
}

function setAvoidStrength(newVal) {
  simulationInfo.avoidanceStrength = Math.pow(newVal/100, 2);
  document.getElementById("avoidStrength").value = newVal;
}

function setRoostStrength(newVal) {
  simulationInfo.roostStrength = Math.pow(newVal/100, 2);
  document.getElementById("roostStrength").value = newVal;
}

function setBoidSpeed(newVal) {
  simulationInfo.birdSpeed = newVal/10000;
}

function setPredatorSpeed(newVal) {
  simulationInfo.predatorSpeed = newVal/10000;
}

function setZoom(newVal) {
  simulationInfo.zoom = newVal/10;
}

function setRoostSize(newVal) {
  simulationInfo.roostRange = Math.pow(newVal/100, 2);
  simulationInfo.roostActive = (simulationInfo.roostRange > 0);
}

function setBoidNumber(newVal) {
  var i, highlightFound;
  simulationInfo.nBoids = newVal;
  while (simulationInfo.boids.length > newVal) {
    simulationInfo.boids.splice(Math.floor(Math.random()*simulationInfo.boids.length),1);
  }
  while (simulationInfo.boids.length < newVal) {
    i = simulationInfo.boids.length;
    simulationInfo.boids[i] = getNewBoid();
  }
  highlightFound = false;
  for (i = 0; !highlightFound && i < simulationInfo.boids.length; ++i) {
    if (simulationInfo.boids[i].highlight) {
      highlightFound = true;
    }
  }
  if (!highlightFound) {
    simulationInfo.boids[0].highlight = true;
  }
  document.getElementById("boidLabel").innerHTML = newVal;
}

function setPredatorNumber(newVal) {
  var i, highlightFound;
  simulationInfo.nPredators = newVal;
  if (simulationInfo.predators.length > newVal) {
    simulationInfo.predators.length = newVal;
  }
  while (simulationInfo.predators.length < newVal) {
    i = simulationInfo.predators.length;
    simulationInfo.predators[i] = {position: {x: Math.random(), y: Math.random(), z: 0}, speed: {x: Math.random()-0.5, y: Math.random()-0.5, z: 0}};
    normalize(simulationInfo.predators[i].speed);
  }
  document.getElementById("predatorLabel").innerHTML = newVal;
}