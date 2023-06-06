import * as THREE from 'three';
import {useEffect, useRef, useState} from 'preact/hooks';
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {TGALoader} from "three/addons/loaders/TGALoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const CigaretteBox = (props) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(new THREE.Scene())
  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(props.backgroundColor || 0xffffff);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 200;

    // 创建模型
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

    // 创建光源
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);
    scene.add(light);

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
    const renderScene = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
    };
    requestAnimationFrame(renderScene);

    // 在组件卸载时清除渲染器和场景
    return () => {
      console.log(scene)
      renderer.dispose();
      // scene.dispose();
      scene.clear()
    };
  }, []);

  return <div style={props.style} ref={mountRef}/>;
};

export default CigaretteBox;