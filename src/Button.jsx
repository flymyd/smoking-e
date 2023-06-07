import Btn from './assets/img/button.png';
import ActiveBtn from './assets/img/button-active.png';

const Button = (props) => {
  return (
    <div onClick={() => props.onClick()} className="cursor-pointer">
      <span className="relative italic font-bold"
            style={{top: 32, left: props.isPlain ? 45 : 37, color: '#fce93d'}}>{props.text}</span>
      <img alt="button" src={props.isPlain ? Btn : ActiveBtn}/>
    </div>
  )
}
export default Button;