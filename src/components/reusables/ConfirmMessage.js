import React from 'react'

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

import { GrFormClose } from "react-icons/gr";

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const ConfirmMessage = ({dialogClass='',titleMsg, textContent = '', confirmFc, cancelFc, windowStatus, yesTxt = 'Sí', noTxt = 'No', yesTitle = 'Sí', noTitle = 'No', args = []}) => {
  return (
    <Dialog PaperProps={{className: `confirmMsg ${dialogClass}`}} maxWidth='90%' open={windowStatus} onClose={() => cancelFc(false)} TransitionComponent={Transition}>
    {/* <Dialog className={dialogClass} fullWidth maxWidth='90%' open={windowStatus} onClose={() => cancelFc(false)} TransitionComponent={Transition}> */}
        <GrFormClose className='closeBtn' onClick={() => cancelFc(false)}/>
          <DialogTitle sx={{padding:0, fontSize:`180%`}}>{titleMsg}</DialogTitle>
          <DialogContent sx={{padding: 0}}>
            <DialogContentText>
              {textContent}
            </DialogContentText>
          </DialogContent>
        {/* ver como impcorporar los args para que si la funcion recibe argumentos se los pueda meter. algo como confirmFc(...args)*/}
        <div className='confirmBtns'>
          <button type='button' title={yesTitle} onClick={() => confirmFc()}> <span className='confirmBtnLabel'> {yesTxt} </span></button>
          <button type='button' title={noTitle} onClick={() => cancelFc(false)}><span className='confirmBtnLabel'> {noTxt} </span></button>
        </div>
    </Dialog>
  )
}

export default ConfirmMessage