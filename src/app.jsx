import {useEffect, useRef, useState} from "preact/hooks";
import Stage from "./Stage.jsx";
import Button from "./Button.jsx";
import * as THREE from "three";
import {TGALoader} from "three/addons/loaders/TGALoader.js";
import {smokeEffect} from "./SmokeEffect.js";
import Div100vh from "react-div-100vh";

export function App() {
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
  const stageRef = useRef(null)
  const [modelList, setModelList] = useState([])
  const [isDraw, setIsDraw] = useState(false)
  const [isBurn, setIsBurn] = useState(false)
  const [textureLoaded, setTextureLoaded] = useState(0)
  let smokeTexture;
  useEffect(() => {
    // 加载纹理图
    new THREE.TextureLoader().load("/clouds.png", function (texture) {
      smokeTexture = texture;
    })
  })
  const drawOut = async () => {
    if (modelList.length > 0 && !isDraw) {
      setIsDraw(true)
      const model = modelList.slice(-1)[0].model
      model.position.y += 15;
      await sleep(1000)
      model.rotation.set(Math.PI * 0.1, 0, 0)
      model.position.set(0, -122, 1)
      setIsBurn(true)
    }
  }
  const lit = () => {
    if (isDraw && isBurn) {
      const modelObj = modelList.slice(-1)[0]
      const {model, type} = modelObj;
      // if (type !== 2) {
      //   const tgaLoader = new TGALoader();
      //   const tgaPath = '/cigarette/Cigarette_Lit.tga';
      //   const texture = tgaLoader.load(tgaPath);
      //   const material = new THREE.MeshBasicMaterial({map: texture});
      //   model.traverse((child) => {
      //     if (child.isMesh) {
      //       child.material = material;
      //       modelObj.type = 2;
      //     }
      //   });
      // }
      const scene = stageRef.current.getScene();
      smokeEffect(scene, smokeTexture)
    }
  }

  return (
    <>
      <div className="bg-[#16586A]">
        {
          textureLoaded !== 100 && <div
            className="cover fixed h-[80vh] w-screen mt-10 bg-[#16586A] z-50 flex flex-row items-center justify-center">
            <span className="italic font-bold text-[#faed50] text-2xl">加载中{textureLoaded}%...</span>
          </div>
        }
        <div className="fixed w-screen flex flex-col">
          <Div100vh>
            <div className="flex flex-row items-center h-10 bg-[#faed50]">
              <span className="italic font-bold ml-4">CyberCiga</span>
            </div>
            <div className="w-full flex flex-row-reverse">
              <div className="mr-4 mt-4 flex flex-col">
                <Button text="取一根" onClick={drawOut}/>
                <Button text="抽一口" onClick={lit}/>
                {/*<Button text="帮助" isPlain onClick={() => ({})}/>*/}
              </div>
            </div>
          </Div100vh>
        </div>
        <Div100vh>
          <Stage style={{width: '100vw', height: '100%', overflow: 'hidden'}} ref={stageRef} backgroundColor={0x16586A}
                 loaded={setTextureLoaded} modelList={setModelList}/>
        </Div100vh>
      </div>
    </>
  )
}
