import {useState} from "preact/hooks";
import Cigarette from "./Cigarette.jsx";
import CigaretteBox from "./CigaretteBox.jsx";

export function App() {
  const [sw, setSw] = useState(false)
  return (
    <>
      <div>
        <button onClick={() => setSw((state) => !state)}>test</button>
        {
          sw ? <Cigarette style={{width: '80vw', height: '80vh'}} backgroundColor={0xffffff}/> :
            <CigaretteBox style={{width: '80vw', height: '80vh'}} backgroundColor={0xff02ff}/>
        }
      </div>
    </>
  )
}
