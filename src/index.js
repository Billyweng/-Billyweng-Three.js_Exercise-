import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { OrbitControls, PrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

console.log(ARButton);



const renderer = new THREE.WebGLRenderer({
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
renderer.xr.enabled = true;

var RotationAngleX = 0;
var RotationAngleY = 0;
var RotationAngleZ = 0;





/* 鏡頭控制器 */
const controls = new TrackballControls(camera, renderer.domElement);



/* 鏡頭控制器自動旋轉啟動 */
/* controls.autoRotate = true; */

/* 相機位置 */
camera.position.set(0, 7, 9);
camera.rotation.set(-0.60, 0, 0);

/* -----------------------------------------------------增加光源 AmbientLight 平行光---------------------------- */

renderer.physicallyCorrectLights = true;


/* ------------------------------------------------------------load model--------------------------------------------- */


const UR3Loader = new GLTFLoader();

UR3Loader.load('../static/model/hand.gltf', function (UR3gltf) {

  let UR3model = UR3gltf.scene;
  scene.add(UR3model);

}, undefined, function (error) {
  console.error(error);
});


const button = ARButton.createButton(renderer);
console.log(button);
document.body.appendChild(button);



/* -------------------------------------------------------------格線----------------------------------------------- */
const size = 12;
const divisions = 12;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

/*----------------------------------------------------- 動畫--------------------------------------------- */



function animate() {
  requestAnimationFrame(animate);
  /* 鏡頭控制器旋轉 */
  controls.update();
  renderer.render(scene, camera);

};



animate();








