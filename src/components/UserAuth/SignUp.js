import React, {useState} from 'react'

import { signup } from '../../auxiliaries/axios'

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'


//TEMPORAL, COMPONENTE SIN TERMINAR
const SignUp = () => {

    const [userData, setUserData] = useState({//IMPORTANTE EN ALGUN lugar agregar algun tipo de encriptado o ver como se hace para cuidar la contraseña cuando se ingresa en el front
        username:'',
        mail:'',
        password:'',
        confirmedPassword:'',
    })

    const createUser = async(username, mail, password) => {//ver como la puedo factorizar con la de login
        const signupStatus = await signup(username, mail, password);
        console.log(signupStatus)
    }

    const verifyUserData = () => {
        if(userData.username === '' || userData.mail === '' || userData.password === '') return false;//temporal, seguir completando y ver si la puedo factorizar con la de login
    }

    const submitForm = (e) => {
        e.preventDefault();
        if(verifyUserData) {//esto se podria refactorizar junto con el verify user data y el create user
            createUser(userData.username,userData.mail,userData.password);
        }else{
            alert('fallo!')//aca hacer aparecer
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
            <h3>Nuevo Usuario</h3>
            <Box component='form' className='signForm' onSubmit={submitForm}>
                <FormControl>
                    <TextField required label={'Usuario'} value={userData.username} onChange={handleChange} name={`username`} id={`user-id`} type='text'/>
                </FormControl>
                <FormControl>
                    <TextField required label={'Email'} value={userData.mail} onChange={handleChange} name={`mail`} id={`email-id`} type='email'/>
                </FormControl>
                <FormControl>
                    <TextField required label={'Contraseña'} value={userData.password} onChange={handleChange} name={`password`} id={`password-id`} type='password'/>
                </FormControl>
                <FormControl>
                    <TextField required label={'Confirmar contraseña'} value={userData.password} onChange={handleChange} name={`confirmPassword`} id={`confirmPassword-id`} type='password'/>
                </FormControl>
                <Button type='submit'>Crear Cuenta</Button>
            </Box>
        </div>
    )
}

export default SignUp