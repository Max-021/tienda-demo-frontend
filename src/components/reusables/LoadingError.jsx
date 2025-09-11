import React from 'react'

const LoadingError = ({containerClass = '', fn, error}) => {
  return (
    <div className={containerClass}>
        <p>Error: {error}. <button className='retryBtn' onClick={() => fn()}>Reintentar</button></p>
    </div>
  )
}

export default LoadingError