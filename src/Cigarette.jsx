import {h} from 'preact';
import * as THREE from 'three';
import {useEffect, useRef, useState} from 'preact/hooks';

const Cigarette = (props) => {
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
    camera.position.z = 4;

    // 创建立方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);

    // 创建光源
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 5);

    // 创建场景
    // const scene = new THREE.Scene();
    scene.add(cube);
    scene.add(light);

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

export default Cigarette;