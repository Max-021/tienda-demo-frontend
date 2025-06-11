import React, { useState } from 'react'

import TextField from '@mui/material/TextField'
import { signup } from '../../../auxiliaries/axios';

const NewUser = () => {
    const [newUser, setNewUser] = useState({username: '', mail: '',})//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

    const createUser = (e) => {//hacer async la llamada para que tenga notificaciones
        e.preventDefault();
        signup(newUser);
        alert("Hacer algo!")//temporal, adicionalmente cuando recibo el sí tengo que limpiar el form y cuando no mostrarlo bien
    }
    const handleChange = (e) => setNewUser(prev => ({...prev, [e.target.name]: e.target.value}))

    return (
    <div className='newUserContainer'>
        <div className='newUserTitle'>
            <p>Nuevo usuario</p>
        </div>
        <form method='post' onSubmit={createUser} className='newUserForm'>
            <div className='userInfoContainer'>
                <p className='userInfoFieldName'>Nombre de usuario:</p>
                <TextField name={'username'} type={'text'} inputProps={{style:{padding:'12px'}}} value={newUser.username} onChange={handleChange} required/>
            </div>
            <div className='userInfoContainer'>
                <p className='userInfoFieldName'>Email:</p>
                <TextField name={'mail'} type={'email'} inputProps={{style:{padding:'12px'}}} value={newUser.mail} onChange={handleChange} required/>
            </div>
            <div className='userInfoContainer'>
                <div></div>
                <p style={{textAlign: 'right', margin:0}}>*La contraseña la podrá establecer el usuario a través de un link provisto al mail dado.</p>
            </div>
            <button type='submit' className='userInfoBtn updateBtn'>Crear usuario</button>
        </form>
    </div>)
}

export default NewUser