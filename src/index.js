import * as THREE from 'three'
import { WEBGL } from './webgl'
import './modal'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'




function initializeAR() {

  let action0;
  let action1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();




  /* -------------------------------------做標點顯示圖標----------------------------------------------------- */
  const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2);
  const reticleMaterial = new THREE.MeshBasicMaterial();
  const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);
  /*-------------------------------------------------------------------------------------------------------  */

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;

  const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(arButton);

  const controller = renderer.xr.getController(0);
  scene.add(controller);


  /* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */



  let ur3model = false;

  controller.addEventListener('select', () => {
    if (ur3model) return;
    ur3model = true;


    let mixer;
    const clock = new THREE.Clock();
    const ur3Loader = new GLTFLoader();
    ur3Loader.load('../static/model/hand.gltf', function (ur3gltf) {
      const ur3model = ur3gltf.scene;
      ur3model.position.setFromMatrixPosition(reticle.matrix);
      scene.add(ur3model);



      /* console.log(ur3gltf);
      console.log(ur3gltf.scene.children[11].children[0].children[0]); */




      /* ---------------------------------------------取出骨架資訊------------------------------------------- */
      const bone1 = ur3gltf.scene.children[11].children[0].children[0];
      const bone2 = ur3gltf.scene.children[11].children[0].children[0].children[0];
      const bone3 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0];
      const bone4 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0].children[0];
      const bone5 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0].children[0].children[0];
      const bone6 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0].children[0].children[0].children[0];
      const bone7 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0];
      const bone8 = ur3gltf.scene.children[11].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0];
      /* ---------------------------------------------骨架旋轉資訊------------------------------------------------- */
      bone1.rotation.x = 0;
      bone2.rotation.x = 0;
      bone3.rotation.x = 0;
      bone4.rotation.x = 0;
      bone5.rotation.x = 0;
      bone6.rotation.x = 0;
      bone7.rotation.x = 0;
      bone8.rotation.x = 0;
      /* ------------------------------------------------------------------------------------------------------------ */

      /* -------------------------------------------------動畫載入  ------------------------------------------------------------- */
      mixer = new THREE.AnimationMixer(ur3model);
      action0 = mixer.clipAction(ur3gltf.animations[0]);
      action0.setLoop(THREE.LoopOnce);
      action0.clampWhenFinished = true;

      action1 = mixer.clipAction(ur3gltf.animations[1]);
      action1.setLoop(THREE.LoopRepeat);


      /* action1.play(); */





      let isAnimation0Playing = false;
      let isAnimation1Playing = false;

      // 綁定按鈕的點擊事件
      document.getElementById('playAnimation0').addEventListener('click', () => {
        isAnimation0Playing = !isAnimation0Playing; // 切換動畫狀態
        if (isAnimation0Playing) {
          // 如果要播放動畫0
          mixer.stopAllAction(); // 停止所有動畫
          const action = mixer.clipAction(ur3gltf.animations[0]);
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
          action.play(); // 播放動畫0
          isAnimation1Playing = false; // 確保另一個動畫不在播放
        } else {
          // 如果要停止播放動畫0
          mixer.stopAllAction(); // 停止所有動畫
        }
      });

      document.getElementById('playAnimation1').addEventListener('click', () => {
        isAnimation1Playing = !isAnimation1Playing; // 切換動畫狀態
        if (isAnimation1Playing) {
          // 如果要播放動畫1
          mixer.stopAllAction(); // 停止所有動畫
          const action = mixer.clipAction(ur3gltf.animations[1]);
          action.setLoop(THREE.LoopRepeat);
          action.play(); // 播放動畫1
          isAnimation0Playing = false; // 確保另一個動畫不在播放
        } else {
          // 如果要停止播放動畫1
          mixer.stopAllAction(); // 停止所有動畫
        }
      });

      document.getElementById('playAnimation2').addEventListener('click', () => {
        mixer.stopAllAction();
      });


      animate();



    }, undefined, function (error) {
      console.error(error);
    });


    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      mixer.update(delta);
    };

    /* --------------------------------------------------------------------------------------------------------------------- */



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


};

initializeAR();







