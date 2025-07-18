import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

import styles from '../../sass/variables.scss'

const LoadingSpinner = ({containerClass = '', spinnerInfo = ''}) => {

  let spinnerProps = {
    color: styles.secondColorShade,
    size: 40,
    thickness: 3.6,
  }
  //para el spinner
  if(spinnerInfo.includes('lightColorSpinner')){
    spinnerProps = {...spinnerProps, color: styles.lightColor}
  }
  if(spinnerInfo.includes('bigSpinner')){
    spinnerProps = {...spinnerProps, size:'130px', thickness: 1.8}
  }
  if(spinnerInfo.includes('formSpinner') || spinnerInfo.includes('mediumSpinner')){
    spinnerProps = {...spinnerProps, size: '50px'}
  }
  if(spinnerInfo.includes('smallSpinner')){
    spinnerProps = {...spinnerProps, size: '25px'}
  }

  return (
    <div className={containerClass}>
      <CircularProgress sx={{color: spinnerProps.color}} size={spinnerProps.size} thickness={spinnerProps.thickness}/>
      {/* <CircularProgress */}
    </div>
  )
}

export default LoadingSpinner;