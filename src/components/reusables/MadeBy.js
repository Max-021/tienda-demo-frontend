import React from 'react'
import { Link } from 'react-router-dom'

import { BsPersonWorkspace } from "react-icons/bs";

const MadeBy = () => {
    const portfolioLink = `https://www.maximilianofrega.com`
  return (
    <div className='madeContainer'>
        {/* <p>Creado por:</p> */}
        <Link to={portfolioLink} target='_blank'><BsPersonWorkspace /></Link>
        {/* <Link to={portfolioLink} target='_blank'>Maximiliano Frega, temporal</Link> */}
    </div>
  )
}

export default MadeBy