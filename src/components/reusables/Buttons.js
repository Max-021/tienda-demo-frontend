import React from 'react'
import { Link } from 'react-router-dom'

const Buttons = ({icon, btnType = 'button'}) => {
  return (
    <div>
        {props.linkArray.map((icon, index) => {
            return <button key={index} type={btnType}>
                {icon}
            </button>
        })}
    </div>
  )
}

export default Buttons