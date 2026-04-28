
import { useState} from "react"
import './index.css'

export default function Bouton() {
    const [display, setDisplay] = useState("")
    const boutons = ['7','8','9','/','4','5','6','*','1','2','3', '-', '0', '+',]
    const operators = ['+','-', '*', '/']
    const handleClick = (e)=>{

        return setDisplay(display+''+e.target.value)}
    const handleClick2 = (e)=>{
        return setDisplay(display+" "+e.target.value+" ")
    }
    const items = boutons.map(bouton =>
        <button key= {bouton}  value= {bouton}onClick={operators.includes(bouton)?handleClick2:handleClick}>{ bouton}</button>
    )
    function handleDelete(){
        let len = display.length
        if(display.charAt(len-1)==" " ){len = len-2}
        
        return setDisplay(display.slice(0, len-1))
    }
    function handleOperation(){
        
        const res =eval(display)
        return setDisplay(res.toString())
        
    }

    return(
        <div className="app">
            <div className="screen">
                {display}
            </div>
            <div className="boutons-num"> 
                {items}
                <button onClick={handleDelete}>suppr</button>
                <button onClick = {handleOperation}>=</button>
                
            </div>
        </div>
    )
}