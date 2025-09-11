import React, { useState, useEffect } from 'react'
import { useNotification } from '../../reusables/NotificationContext.jsx';
import { useLoadingHook } from '../../../hooks/useLoadingHook.js';

import LoadingSpinner from '../../reusables/LoadingSpinner.jsx';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createUser, getRolesList } from '../../../auxiliaries/axios';

const NewUser = () => {
    const notify = useNotification();
    const [newUser, setNewUser] = useState({username: '', mail: '', role: ''})
    const [loading, setLoading] = useState(false);
    const [rolesList, setRolesList] = useState([]);

    const {data: listRoles, loading: rolesLoading, error: rolesError, refetch} = useLoadingHook(getRolesList, []);
    useEffect(() => {
        if(listRoles){
            setRolesList(listRoles.roles);
            setNewUser(prev => ({...prev, role: listRoles.roles[0]}));
        }
    }, [listRoles, rolesList])

    const submitNewUser = async (e) => {
        if(loading) return;//otra traba a mandar lo mismo 2 veces, aunque con el disabled del boton debería bastar, lo dejo igual
        e.preventDefault();
        setLoading(true)
        try {
            await createUser(newUser);
            notify('success','Usuario creado con exito, el mismo recibirá en su casilla de correo instrucciones sobre como empezar a utilizar la cuenta.');
        } catch (error) {
            notify('error', error.message);
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
                <p className='userInfoFieldName'>Rol:</p>
                <Select required name={'role'} onChange={handleChange} value={rolesLoading ? '' : newUser.role}>
                    {rolesLoading && <MenuItem disabled value='loading'><LoadingSpinner/>Esperando lista de roles...</MenuItem>}
                    {rolesList.length > 0 &&
                        rolesList.map((rol, index) => {
                            return <MenuItem key={index} value={rol}>{rol}</MenuItem>
                        })
                    }
                </Select>
            <div className='userInfoContainer'>
                <p className='userInfoFieldName'>Email:</p>
                <TextField name={'mail'} type={'email'} inputProps={{style:{padding:'12px'}}} value={newUser.mail} onChange={handleChange} required/>
            </div>
            <div className='userInfoContainer'>
                <div></div>
                <p style={{textAlign: 'right', margin:0}}>*La contraseña la podrá establecer el usuario a través de un link provisto al mail dado.</p>
            </div>
            </div>
            <button type='submit' className='userInfoBtn updateBtn' disabled={loading}>
                {loading ? <LoadingSpinner spinnerInfo='lightColorSpinner'/> : 'Crear usuario'}
            </button>
        </form>
    </div>)
}

export default NewUser