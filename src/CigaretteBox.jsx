import * as THREE from 'three';
import {useEffect, useRef, useState} from 'preact/hooks';
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {TGALoader} from "three/addons/loaders/TGALoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {DragControls} from "three/addons/controls/DragControls.js";

const CigaretteBox = (props) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(new THREE.Scene())
  let camera;
  let model;
  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const renderer = new THREE.WebGLRenderer({antialias: true});
    // renderer.setClearColor(props.backgroundColor || 0xffffff);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    // 创建相机
    camera = (new THREE.PerspectiveCamera(45, width / height, 0.1, 500))
    camera.position.z = 300;
    // camera.position.x = 15; //移动端居中
    camera.position.x = 35;
    console.log(camera)
    // 创建模型
    const fbxLoader = new FBXLoader();
    const tgaLoader = new TGALoader();
    fbxLoader.load('/cigarette/Cigarette_Box.fbx', (fbx) => {
      const texture = tgaLoader.load('/cigarette/Cigarette.tga');
      const material = new THREE.MeshBasicMaterial({map: texture});
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
        }
      });
      model = fbx;
      // 翻转到正面
      model.rotation.y = Math.PI + 0.3;
      // 倾斜一点
      model.rotation.x = 0.8;
      scene.add(model);
      // 允许拖动
      let orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableRotate = true;
      let dragControls = new DragControls([model], camera, renderer.domElement);
      dragControls.addEventListener('dragstart', function(event) {
        orbitControls.enabled = false;
      });
      dragControls.addEventListener('dragend', function(event) {
        orbitControls.enabled = true;
      });
      orbitControls.enableRotate = false;
      if (camera) {
        renderer.render(scene, camera);
      }
    });
    // 创建光源
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

    // 渲染场景
    const renderScene = () => {
      if (camera && model) {
        renderer.render(scene, camera);
      }
      requestAnimationFrame(renderScene);
    };
    requestAnimationFrame(renderScene);
    // 在组件卸载时清除渲染器和场景
    return () => {
      camera = null;
      renderer.dispose();
      // scene.dispose();
      scene.clear()
    };
  }, []);

  return <div style={props.style} ref={mountRef}/>;
};

export default CigaretteBox;