import { useState } from "react";
// import "./styles.css";

export default function ClockComponent({className}) {
  let time  = new Date().toLocaleTimeString()

  const [ctime,setTime] = useState(time)
  const UpdateTime=()=>{
    time =  new Date().toLocaleTimeString()
    setTime(time)
  }
  setInterval(UpdateTime)
  return <span className={className}>{ctime}</span>
}
