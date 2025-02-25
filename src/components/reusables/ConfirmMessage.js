import React from 'react'

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const ConfirmMessage = ({textMsg, confirmFc, cancelFc, windowStatus}) => {
  return (
    <Dialog fullWidth maxWidth='90%' open={windowStatus} onClose={() => cancelFc(false)} TransitionComponent={Transition}>
        {textMsg}
        <button type='button' title='confirmar cierre de sesión' onClick={() => confirmFc()}> Sí </button>
        <button type='button' title='No' onClick={() => cancelFc(false)}> No </button>
    </Dialog>
  )
}

export default ConfirmMessage