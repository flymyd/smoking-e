import {useRef, useState} from "preact/hooks";
import Cigarette from "./Cigarette.jsx";
import CigaretteBox from "./CigaretteBox.jsx";
import Stage from "./Stage.jsx";
import * as THREE from "three";

export function App() {
  const stageRef = useRef(null)
  let count = 1;
  const addCig = (isBurn) => {
    const publicCamera = stageRef.current.getPublicCamera();
    const publicLight = stageRef.current.getPublicLight();
    stageRef.current.addModel(isBurn ? 2 : 1, true, () => publicCamera, model => {
      count += 1;
      model.rotation.x = Math.PI + 0.3;
      model.position.set(-50, 100, count)
    }, () => publicLight)
  }
  const addBox = ()=>{
    const publicCamera = stageRef.current.getPublicCamera();
    const publicLight = stageRef.current.getPublicLight();
    stageRef.current.addModel(0, true, ()=>publicCamera, model => {
      // 翻转到正面
      model.rotation.y = Math.PI + 0.3;
      // 倾斜一点
      model.rotation.x = 0.8;
      model.position.z = 1;
      model.position.x = 10;
    }, ()=>publicLight)
  }
  return (
    <>
      <div className="h-screen w-screen bg-black">
        <button style={{background: 'white'}} onClick={() => addCig()}>add cig</button>
        <button style={{background: 'white'}} onClick={() => addCig(1)}>add burn cig</button>
        <button style={{background: 'white'}} onClick={() => addBox()}>add box</button>
        {/*<img src="/box.jpg" alt="芙蓉王" />*/}
        <Stage style={{width: '100vw', height: '100vh'}} ref={stageRef}/>
      </div>
    </>
  )
}
