import React from 'react'
import { Link } from 'react-router-dom'

import { BsPersonWorkspace } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa6";

const MadeBy = () => {
    const portfolioLink = `https://www.maximilianofrega.com`
  return (
    <div className='madeContainer'>
      <Link to={portfolioLink} target='_blank' style={{display: 'flex'}}><FaLaptopCode/></Link>
    </div>
  )
}

export default MadeBy