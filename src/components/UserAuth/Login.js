import React, {useState, useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLoadingNotifier } from '../../hooks/useLoadingNotifier';
import { useNotification } from '../reusables/NotificationContext';
import { login, passwordForgotten } from '../../auxiliaries/axios';
import { isValidEmail } from '../../auxiliaries/validationFunctions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment } from '@mui/material'

import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const redirectTimeout = useRef(null);
  const [userData, setUserData] = useState({ mail: '',password: '', });
  const [isForgotten, setIsForgotten] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ mail: '', password: '' });

  const loginUser = useLoadingNotifier(login, {successMsg: 'Inicio de sesión exitoso. redirigiendo...'});
  const recoverPassword = useLoadingNotifier(passwordForgotten, {successMsg: 'Email de recuperación enviado, puede demorar unos minutos en aparecer. Si el correo no aparece por favor reintente el proceso.'});

  useEffect(() => {
    return () => {
      if(redirectTimeout.current !== null){
        clearTimeout(redirectTimeout.current);
      }
    }
  }, []);

  const validateField = (name, val) => {
    let msg = '';

    if(name === 'mail'){
      if(!val.trim()) msg = 'El email es obligatorio.';
      else if(!isValidEmail(val)) msg = 'Formato de email incorrecto.'
    }
    if(name === 'password'){
      if(!val.trim()) msg = 'La contraseña es obligatoria.'
      else if(val.length < 12) msg = 'Mínimo 12 caracteres.'
    }
    setErrors(prev => ({...prev, [name]: msg}));
  };

  const preparePasswordReset = () => {
    setIsForgotten(prev => !prev);
    setErrors({password: '', mail: ''});
    setUserData(prev => ({...prev, password: ''}))
  }

  const submitForm = async (e) => {
    e.preventDefault();

    validateField('mail', userData.mail)
    if(!isForgotten)validateField('password', userData.password);
    if(!isFormValid){
      notify('error', "Alguno de los campos contiene errores, completa los campos correctamente antes de avanzar.");
      return;
    }
      if(isForgotten){
        await recoverPassword(userData.mail);
      }else{
        const loginStatus = await loginUser(userData);
        if(loginStatus.data.status === 'success') {//temporal, revisar y poner de buena manera
          redirectTimeout.current = window.setTimeout(() => {
            navigate('/');
            navigate(0);
          } , 2000);
        }
      }
  }
  const handleChange = (e) => setUserData(prev => ({...prev, [e.target.name]: e.target.value }));
  const isFormValid = userData.mail.trim() && (!errors.mail) && (isForgotten || (userData.password.trim() &&  !errors.password));

  return (
    <div className='logSection'>
      <div className='signupContainer'>
        <h3>Inicio de Sesión</h3>
        <Box component='form' className='signForm' onSubmit={submitForm} noValidate>
          <FormControl>
            <TextField required label={'Email'} value={userData.mail} autoComplete='email' autoFocus
              name={`mail`} id={`email-id`} type='email'
              onChange={handleChange} onBlur={e => validateField(e.target.name, e.target.value)}
              error={!!errors.mail} helperText={errors.mail}
            />
          </FormControl>
          <div style={{width: '100%'}}>
            {!isForgotten &&
              <FormControl>
                <TextField required={!isForgotten} label={'Contraseña'} value={userData.password} 
                  name={`password`} id={`password-id`} type={showPassword?'text':'password'}
                  onChange={handleChange} onBlur={e => validateField(e.target.name, e.target.value)}
                  error={!!errors.password} helperText={errors.password}
                  InputProps={{endAdornment:(
                      <InputAdornment position='end' sx={{height:'100%',display:'flex',alignItems:'center'}}>
                          <IconButton edge='end' onClick={() => setShowPassword(prev => !prev)}>
                              {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                          </IconButton>
                      </InputAdornment>
                  )}}
                />
              </FormControl>
            }
            <button type='button' className='forgotPwdBtn' onClick={preparePasswordReset}>
              {!isForgotten ? 'Olvide mi contraseña' : 'Volver a inicio de sesión'}
            </button>
          </div>
          <Button type='submit' disabled={!isFormValid}>
            {!isForgotten ? 'Iniciar sesión' : 'Recuperar contraseña'}
          </Button>
        </Box>
      </div>
    </div>
  )
}

export default Login