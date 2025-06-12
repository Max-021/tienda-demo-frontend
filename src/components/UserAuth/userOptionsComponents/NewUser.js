import React, { useState } from 'react'
import { useNotification } from '../../reusables/NotificationContext';

import LoadingSpinner from '../../reusables/LoadingSpinner';
import TextField from '@mui/material/TextField'
import { createUser } from '../../../auxiliaries/axios';

const NewUser = () => {
    const notify = useNotification();
    const [newUser, setNewUser] = useState({username: '', mail: '',})
    const [loading, setLoading] = useState(false);

    const submitNewUser = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await createUser(newUser);
            notify('success','Usuario creado con exito, el mismo recibirá en su casilla de correo instrucciones sobre como empezar a utilizar la cuenta.');
        } catch (error) {
            notify('error','Error al crear el usuario, reintente.');
        }finally{
            setLoading(false);
        }
    }
    const handleChange = (e) => setNewUser(prev => ({...prev, [e.target.name]: e.target.value}))

    return (
    <div className='newUserContainer'>
        <div className='newUserTitle'>
            <p>Nuevo usuario</p>
        </div>
        <form method='post' onSubmit={submitNewUser} className='newUserForm'>
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
            <button type='submit' className='userInfoBtn updateBtn'>{loading ? <LoadingSpinner/> : 'Crear usuario'}</button>
        </form>
    </div>)
}

export default NewUser