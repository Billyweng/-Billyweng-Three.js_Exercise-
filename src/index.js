import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { OrbitControls, PrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';


document.addEventListener('DOMContentLoaded', () => {
  const initialize = async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial();
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', () => {

      const ur3Loader = new GLTFLoader();
      ur3Loader.load('../static/model/hand.gltf', function (ur3gltf) {
        let ur3model = ur3gltf.scene;
        scene.add(ur3model);


        console.log(ur3gltf);
        const mixer = new THREE.AnimationMixer(ur3gltf);
        const action = mixer.clipAction(ur3gltf.animations[0]);
        action.play();
      }, undefined, function (error) {
        console.error(error);
      });
      /* const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.setFromMatrixPosition(reticle.matrix);
      mesh.scale.y = Math.random() * 2 + 1;
      scene.add(mesh); */



    });

    /* ----------------------------------------------------------------------------------------- */

    /* --------------------------------------------------------------------------------------------- */



    renderer.xr.addEventListener("sessionstart", async (e) => {
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({ space: viewerReferenceSpace });

      renderer.setAnimationLoop((timestamp, frame) => {
        if (!frame) return;

        const hitTestResults = frame.getHitTestResults(hitTestSource);

        if (hitTestResults.length) {
          const hit = hitTestResults[0];
          const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
          const hitPose = hit.getPose(referenceSpace);

          reticle.visible = true;
          reticle.matrix.fromArray(hitPose.transform.matrix);
        } else {
          reticle.visible = false;
        }

        renderer.render(scene, camera);
      });
    });

    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });

  }

  initialize();
});