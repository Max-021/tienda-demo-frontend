import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  const handleReload = () => window.location.href = '/'

  return (
    <div className='notFoundPageContainer'>
      <div className='notFoundPageInfo'>
        <h3>Ups! Parece que la direccion ingresada no existe.</h3>
        <Link onClick={handleReload}>Volver al inicio</Link>
      </div>
    </div>
  )
}

export default NotFound