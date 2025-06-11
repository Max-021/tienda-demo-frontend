import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = ({containerClass = ''}) => {
  return (
    <div className={containerClass}>
      <CircularProgress/>
    </div>
  )
}

export default LoadingSpinner