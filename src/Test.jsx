import React, {useRef} from 'react';
import * as THREE from 'three';
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {TGALoader} from "three/addons/loaders/TGALoader.js";

function Test() {
  let scene, camera, renderer, obj;

  // 创建场景、相机和渲染器
  scene = new THREE.Scene();


  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;


  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  // 创建一个点光源
  const light = new THREE.PointLight(0xffffff, 1, 1000);
  // 将光源放置在相机位置上方
  light.position.set(0, 100, 0);
  // 将光源添加到场景中
  scene.add(light);
  
  const fbxLoader = new FBXLoader();
  const tgaLoader = new TGALoader();
  fbxLoader.load('/cigarette/Cigarette_Box.fbx', function (fbx) {
    const texture = tgaLoader.load('/cigarette/Cigarette.tga');
    const material = new THREE.MeshBasicMaterial({map: texture});
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
    // 将模型添加到场景中
    scene.add(fbx);
    // 渲染场景
    renderer.render(scene, camera);
  });
  // 创建一个控制器
  const controls = new OrbitControls(camera, renderer.domElement);

  // 启用控制器的鼠标事件
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

// 渲染场景
  renderer.render(scene, camera);

  // 渲染场景
  function animate() {
    requestAnimationFrame(animate);
    // if (obj) {
    //   obj.rotation.y += 0.01;
    // }
    renderer.render(scene, camera);
  }

  animate();

  // 将渲染器添加到DOM中
  return <div/>;
}

export default Test;