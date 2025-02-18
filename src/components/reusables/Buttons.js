import React from 'react'
import { Link } from 'react-router-dom'

const Buttons = (props) => {
  return (
    <div>
        {props.btnArray.map((btn, index) => {
            return <button key={index} type={'button'} onClick={btn.action} title={btn.name}>
              {btn.name}
            </button>
        })}
    </div>
  )
}

export default Buttons