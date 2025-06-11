import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLoadingNotifier } from '../../hooks/useLoadingNotifier';
import { useNotification } from '../reusables/NotificationContext';

import { login, passwordForgotten } from '../../auxiliaries/axios';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'

const Login = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const [userData, setUserData] = useState({ mail: '',password: '', });
  const [isForgotten, setIsForgotten] = useState(false);

  const loginUser = useLoadingNotifier(login, {successMsg: 'Inicio de sesión exitoso.'});
  const recoverPassword = useLoadingNotifier(passwordForgotten, {successMsg: 'Email enviado.'})
  
  const verifyUserData = () => {
    if (!userData.mail.trim())     return false;
    if (!isForgotten && !userData.password.trim()) return false;
    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if(!verifyUserData()){
      notify('error', 'Completa todos los campos antes de continuar');
      return;
    }
    if(isForgotten){
      await recoverPassword(userData.password);
    }else{
      const loginStatus = await loginUser(userData);
      // if(loginStatus.status) {
      //   navigate('/');
      //   navigate(0);
      // }
    }
  }
  const handleChange = (e) => setUserData({...userData, [e.target.name]: e.target.value });

  return (
    <div className='logSection'>
      <div className='signupContainer'>
        <h3>Inicio de Sesión</h3>
        <Box component='form' className='signForm' onSubmit={submitForm}>
          <FormControl>
            <TextField required label={'Email'} value={userData.mail} onChange={handleChange} name={`mail`} id={`email-id`} type='email'/>
          </FormControl>
          <div style={{width: '100%'}}>
            {!isForgotten &&
              <FormControl>
                <TextField required={!isForgotten} label={'Contraseña'} value={userData.password} onChange={handleChange} name={`password`} id={`password-id`} type='password'/>
              </FormControl>
            }
            <button type='button' className='forgotPwdBtn' onClick={() => setIsForgotten(prev => !prev)}>{!isForgotten ? 'Olvide mi contraseña' : 'Volver a inicio de sesión'}</button>
          </div>
          <Button type='submit'>{!isForgotten ? 'Iniciar sesión' : 'Recuperar contraseña'}</Button>
        </Box>
      </div>
    </div>
  )
}

export default Login