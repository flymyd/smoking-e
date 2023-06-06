import {useEffect, useImperativeHandle, useRef, useState} from 'preact/hooks';
import {forwardRef} from "preact/compat";
import * as THREE from 'three';
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {TGALoader} from "three/addons/loaders/TGALoader.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {DragControls} from "three/addons/controls/DragControls.js";

const Stage = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  // 场景
  const [scene, setScene] = useState(new THREE.Scene())
  // 渲染器实例
  let renderer;
  // 公共相机（烟盒相机）、公共光源
  let publicCamera, publicLight;
  // 计时器ID
  let animationIdList = []
  // 组件宽高
  let width, height
  /**
   * 在场景中新增一个模型
   * @param type 0 烟盒 1 烟杆 2 点燃的烟杆
   * @param canDrag 允许拖动
   * @param {Function} [cameraCreator] 相机创建函数
   * @param {Function} [modelAdjustor] 模型调整函数
   * @param {Function} [lightCreator] 光源创建函数
   * @returns {{light, camera}}
   */
  const addModel = (type, canDrag, cameraCreator, modelAdjustor, lightCreator) => {
    let camera, light, model;
    if (cameraCreator) {
      camera = cameraCreator()
    } else {
      camera = (new THREE.PerspectiveCamera(45, width / height, 0.1, 500))
      camera.position.z = 300;
      camera.position.x = 35;
    }
    // 创建模型
    const fbxLoader = new FBXLoader();
    const tgaLoader = new TGALoader();
    let fbxPath, tgaPath;
    switch (type) {
      case 0:
        fbxPath = '/cigarette/Cigarette_Box.fbx';
        tgaPath = '/cigarette/Cigarette.tga';
        break;
      case 1:
        fbxPath = '/cigarette/Cigarette.fbx';
        tgaPath = '/cigarette/Cigarette.tga';
        break;
      case 2:
        fbxPath = '/cigarette/Cigarette.fbx';
        tgaPath = '/cigarette/Cigarette_Lit.tga';
        break;
    }
    fbxLoader.load(fbxPath, (fbx) => {
      const texture = tgaLoader.load(tgaPath);
      const material = new THREE.MeshBasicMaterial({map: texture});
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
        }
      });
      model = fbx;
      if (modelAdjustor) {
        modelAdjustor(model)
      }
      scene.add(model);
      // 拖动逻辑
      if (canDrag) {
        let orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableRotate = true;
        orbitControls.enableZoom = false;
        let dragControls = new DragControls([model], camera, renderer.domElement);
        dragControls.addEventListener('dragstart', function (event) {
          orbitControls.enabled = false;
        });
        dragControls.addEventListener('dragend', function (event) {
          orbitControls.enabled = true;
        });
        orbitControls.enableRotate = false;
      }
      if (camera) {
        renderer.render(scene, camera);
      }
    });
    if (lightCreator) {
      light = lightCreator()
    } else {
      light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, 5);
      scene.add(light);
    }
    // 渲染场景
    const renderScene = () => {
      if (camera && model) {
        renderer.render(scene, camera);
      }
      const id = requestAnimationFrame(renderScene);
      animationIdList.push(id)
    };
    const id = requestAnimationFrame(renderScene);
    animationIdList.push(id)
    return {
      camera, light
    }
  }
  const getPublicCamera = () => publicCamera;
  const getPublicLight = () => publicLight;
  useImperativeHandle(ref, () => ({
    addModel, getPublicCamera, getPublicLight
  }));

  useEffect(() => {
    width = mountRef.current.clientWidth;
    height = mountRef.current.clientHeight;
    renderer = new THREE.WebGLRenderer({antialias: true});
    // renderer.setClearColor(props.backgroundColor || 0xffffff);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // 初始化烟盒
    const {camera, light} = addModel(0, false, () => {
      let camera = (new THREE.PerspectiveCamera(45, width / height, 0.1, 1000))
      camera.position.set(35, 0, 300);
      // camera.position.x = 15; //移动端居中
      camera.lookAt(scene.position);
      return camera;
    }, model => {
      // 翻转到正面
      model.rotation.y = Math.PI + 0.3;
      // 倾斜一点
      model.rotation.x = 0.8;
    })
    publicCamera = camera;
    publicLight = light;
    // 在组件卸载时清除渲染器和场景
    return () => {
      animationIdList.forEach(id => cancelAnimationFrame(id))
      renderer.dispose();
      scene.clear()
    };
  }, []);

  return <div style={props.style} ref={mountRef}/>;
});

export default Stage;