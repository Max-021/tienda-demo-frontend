import React, {useState, useEffect} from 'react';
import { useNotification } from '../reusables/NotificationContext';
import { useLoadingNotifier } from '../../hooks/useLoadingNotifier';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../reusables/LoadingSpinner';

import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment } from '@mui/material'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

import { resetPassword, validateResetToken } from '../../auxiliaries/axios';

const ResetPassword = () => {
  const notify = useNotification();
  const {token} = useParams();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({password: '', confirmPassword: ''});
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValid, setIsValid] = useState(null)

  const sendResetPassword = useLoadingNotifier(resetPassword, {successMsg: 'Cambio de contraseña exitoso.', errorMsg: 'Ocurrió un error al intentar cambiar la contraseña, por favor reintente.'})

  useEffect(()=>{
    const checkToken = async () => {
      try {
        await validateResetToken(token);
        setIsValid(true);
        notify('success', 'Token válido!');
      } catch (error) {
        setIsValid(false);
        navigate('/notfound');
      } finally {

      }
    }
    checkToken();
  }, [token, navigate]);


  const handlePwd = (e) => setPasswordData(prev => ({...prev, [e.target.name]: e.target.value}))

  const submitResetPassword = async (e) => {
      e.preventDefault();
      await sendResetPassword(passwordData, token);//hacer algo con la info que recibo
  }

  const isMismatch = passwordData.confirmPassword !== '' && passwordData.confirmPassword !== passwordData.password;

  if (isValid === null) {
    return <div className='resetPwdSection'>
        <LoadingSpinner/>
        <p>Validando enlace…</p>
      </div>
  }

  return (
    <div className='resetPwdSection'>
      {isValid ?
        <form className='pwdResetContainer' method='post' onSubmit={submitResetPassword}> 
          <div className='newUserTitle'>
            <p style={{textAlign: 'center', margin:0, marginTop: '1rem'}}>Recuperación de contraseña</p>
          </div>
          <div className='userInfoContainer pwdUserInfoContainer'>
            <p title='Contraseña' className='userInfoFieldName'>Nueva contraseña:</p>
            <TextField name={'password'} type={showPassword?'text':'password'} inputProps={{style:{padding:'12px'}}} value={passwordData.password} onChange={handlePwd} required
              InputProps={{endAdornment:(
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                  </IconButton>
                </InputAdornment>
              )}}
            />
          </div>
          <div className='userInfoContainer pwdUserInfoContainer'>
            <p title='Confirmar nueva contraseña' className='userInfoFieldName'>Confirmar contraseña:</p>
            <TextField required sx={{position: 'relative',}}
              name={`confirmPassword`} type={showConfirmPassword?'text':'password'} 
              value={passwordData.confirmPassword} onChange={handlePwd} 
              error={isMismatch}
              helperText={isMismatch ? 'Las contraseñas no coinciden' : '\u00A0'}
              FormHelperTextProps={{style:{fontWeight: 'bold',position:'absolute',bottom:0,left:0,transform: 'translateX(-10px) translateY(20px)', fontSize:' 0.75rem', lineHeight:'1rem', flex:'0 !important',}}}
              inputProps={{style:{padding:'12px'}}}
              InputProps={{endAdornment:(
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={() => setShowConfirmPassword(prev => !prev)}>
                    {showConfirmPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                  </IconButton>
                </InputAdornment>
              )}}
            />
          </div>
            <button className='userInfoBtn updatePwdBtn' type='submit'>Actualizar contraseña</button>
        </form>
        :
        <div className='pwdResetContainer'>
          <p>El token para reiniciar la contraseña no es válido o ya ha expirado. Por favor vuelva a repetir el proceso de reinicio de contraseña</p>
        </div>
      }
    </div>
  )
}

export default ResetPassword