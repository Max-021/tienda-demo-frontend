import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import { login, passwordForgotten } from '../../auxiliaries/axiosHandlers';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ mail: '',password: '', });
  const [isForgotten, setIsForgotten] = useState(false);

  const loginUser = async(mail, password) => {
    const loginStatus = await login(mail, password)
    console.log("loginsatus")
    console.log(loginStatus)
    if(loginStatus.status) {
      // navigate('/');
      // navigate(0);
    }
  }
  
  const verifyUserData = () => {
    if(userData.mail === '' || userData.password === '') return false;//temporal, seguir completando y ver si la puedo factorizar con la de login
  }

  const submitForm = async (e) => {
    e.preventDefault();
    if(!isForgotten){
      if(verifyUserData) {
        loginUser(userData.mail,userData.password);
      }else{
        alert('fallo!')//aca hacer aparecer/ temporal
      }
    }else{
      const res = await passwordForgotten(userData.mail);
    }
  }
  const handleChange = (e) => {
    setUserData({
        ...userData,
        [e.target.name]: e.target.value
    })
}

  return (
    <div className='logSection'>
      <div className='signupContainer'>
        <h3>Inicio de Sesión</h3>
        <Box component='form' className='signForm' onSubmit={submitForm}>
          <FormControl>
            <TextField required={!isForgotten} label={'Email'} value={userData.mail} onChange={handleChange} name={`mail`} id={`email-id`} type='email'/>
          </FormControl>
          <div>
            {!isForgotten &&
              <FormControl>
                <TextField required label={'Contraseña'} value={userData.password} onChange={handleChange} name={`password`} id={`password-id`} type='password'/>
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