import React from 'react'

const LoadingError = ({containerClass = '', fn, error}) => {
  return (
    <div className={containerClass}>
        <p>Error: {error}, <button className='retryBtn' onClick={() => fn()}>reintente</button></p>
    </div>
  )
}

export default LoadingError