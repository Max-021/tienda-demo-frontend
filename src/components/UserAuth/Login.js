import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import { login } from '../../auxiliaries/axiosHandlers';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    mail: '',
    password: '',
  })

  const loginUser = async(mail, password) => {
    const loginStatus = await login(mail, password)
    console.log("loginsatus")
    console.log(loginStatus)
    if(loginStatus) {
      navigate('/');
    }
  }
  
  const verifyUserData = () => {
    if(userData.username === '' || userData.mail === '' || userData.password === '') return false;//temporal, seguir completando y ver si la puedo factorizar con la de login
  }

  const submitForm = (e) => {
    e.preventDefault();
    if(verifyUserData) {
      loginUser(userData.mail,userData.password);
    }else{
      alert('fallo!')//aca hacer aparecer/ temporal
    }
  }
  const handleChange = (e) => {
    setUserData({
        ...userData,
        [e.target.name]: e.target.value
    })
}

  return (
    <div className='signContainer'>
        <h3>Iniciar Sesión</h3>
        <Box component='form' className='signForm' onSubmit={submitForm}>
          <FormControl>
            <TextField required label={'Email'} value={userData.mail} onChange={handleChange} name={`mail`} id={`email-id`} type='email'/>
          </FormControl>
          <FormControl>
            <TextField required label={'Contraseña'} value={userData.password} onChange={handleChange} name={`password`} id={`password-id`} type='password'/>
          </FormControl>
          <Button type='submit'>Iniciar sesión</Button>
        </Box>
    </div>
  )
}

export default Login