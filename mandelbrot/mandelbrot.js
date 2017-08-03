var canvasWidth, canvasHeight;
var scene, aspect_ratio, camera, renderer, controls;
var fractalMesh;

var lastScale = 1;

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

var shouldUpdate = true;

var lastEventUnix = Date.now();
var normalPixelRatio = true;

window.onload = function(){
  init();
  addListeners(renderer);
  createFractal();
  resize();

  render();
}


function render(){
  stats.begin();
  if(!normalPixelRatio && Date.now() - lastEventUnix > 150){
    renderer.setPixelRatio(1.0);
    normalPixelRatio = true;
    shouldUpdate = true;
  }

  if(shouldUpdate){
    renderer.render(scene, camera);
    shouldUpdate = false;
 }
  stats.end();
  requestAnimationFrame(render);
}

function createFractal(){
  var geometry = new THREE.PlaneGeometry(2, 2, 0);
  var material = new THREE.ShaderMaterial({
      uniforms: {
          zoom: { type: 'f', value: 1},
          coloring: { type: 'i', value: 2},
          aspect_ratio: {type: 'f', value: 1.0},
          //origin: {type: '2f', value: new THREE.Vector2(0.001643721971153, -0.822467633298876)}
          origin: {type: '2f', value: new THREE.Vector2(0.0, 0.0)},
          color_offset: {type: 'f', value: 0.0},
          color_density: {type: 'f', value: 1.0}
      },
      vertexShader: document.getElementById('fractal-vertex').innerHTML,
      fragmentShader: document.getElementById('fractal-fragment').innerHTML
  });
  fractalMesh = new THREE.Mesh(geometry, material);
  scene.add(fractalMesh);
}

function resize(){
  canvasWidth = Math.floor(getBrowserWidth() * window.devicePixelRatio);
  canvasHeight = Math.floor(getBrowserHeight() * window.devicePixelRatio);
  var aspectRatio = canvasWidth / canvasHeight;
  fractalMesh.scale.copy( new THREE.Vector3(aspectRatio, 1.0, 1 ) );
  fractalMesh.material.uniforms.aspect_ratio.value = aspectRatio;
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.domElement.style.width = getBrowserWidth() + "px";
  renderer.domElement.style.height = getBrowserHeight() + "px";
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();

}

function decreasePixelRatio(){
  lastEventUnix = Date.now();
  renderer.setPixelRatio(0.1);
  normalPixelRatio = false;
  shouldUpdate = true;
}

function setColoring(coloring){
  fractalMesh.material.uniforms.coloring.value = coloring;
  shouldUpdate = true;
}

function setColorDensity(density){
  fractalMesh.material.uniforms.color_density.value = density;
  shouldUpdate = true;
}

function setColorOffset(offset){
  fractalMesh.material.uniforms.color_offset.value = offset;
  shouldUpdate = true;
}


function init(){
  scene = new THREE.Scene();

  canvasWidth = getBrowserWidth();
  canvasHeight = getBrowserHeight();
  aspectRatio = canvasWidth / canvasHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

  //position camera
  var dist = 1.0 / Math.tan(Math.PI * camera.fov / 360);
  camera.position.z =  dist;


  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(canvasWidth, canvasHeight);
  scene.background = new THREE.Color(0x0f0f0f);

  renderer.domElement.style="position:absolute; top:0px; left:0px; margin:0px; width: 100%; height: 100%;"
  document.getElementById('bellowAbout').appendChild(renderer.domElement);
}
