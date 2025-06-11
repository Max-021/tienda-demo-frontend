import React from 'react'

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import { GrFormClose } from "react-icons/gr";

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const ConfirmMessage = ({textMsg, confirmFc, cancelFc, windowStatus, args = []}) => {
  return (
    <Dialog fullWidth maxWidth='90%' open={windowStatus} onClose={() => cancelFc(false)} TransitionComponent={Transition}>
        <GrFormClose className='closeBtn' onClick={() => cancelFc(false)}/>
        {textMsg}
        {/* ver como impcorporar los args para que si la funcion recibe argumentos se los pueda meter. algo como confirmFc(...args)*/}
        <button type='button' title='confirmar cierre de sesión' onClick={() => confirmFc()}> Sí </button>
        <button type='button' title='No' onClick={() => cancelFc(false)}> No </button>
    </Dialog>
  )
}

export default ConfirmMessage