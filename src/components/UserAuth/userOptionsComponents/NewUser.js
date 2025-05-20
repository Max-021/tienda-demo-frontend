import React, { useState } from 'react'

import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment } from '@mui/material'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const NewUser = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [newUser, setNewUser] = useState({
        username: '',
        mail: '',
        password:'',
        confirmPassword:'',
    })

    const createUser = (e) => {
        e.preventDefault();
    }
    const handleChange = (e) => setNewUser(prev => ({...prev, [e.target.name]: e.target.value}))

    const isMismatch = newUser.confirmPassword !== '' && newUser.confirmPassword !== newUser.password;

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
            {/* <div className='userInfoContainer pwdUserInfoContainer'> */}
            <div className='userInfoContainer'>
            {/* <p title='Nueva contraseña' className='userInfoFieldName pwdField'>Contraseña:</p> */}
            <p title='Nueva contraseña' className='userInfoFieldName'>Contraseña:</p>
            <TextField name={'password'} type={showPassword?'text':'password'} inputProps={{style:{padding:'12px'}}} value={newUser.password} onChange={handleChange} required
                InputProps={{endAdornment:(
                    <InputAdornment position='end'>
                        <IconButton edge='end' onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                        </IconButton>
                    </InputAdornment>
                )}}
                />
            </div>
            {/* <div className='userInfoContainer pwdUserInfoContainer'> */}
            <div className='userInfoContainer'>
                <p title='Confirmar nueva contraseña' className='userInfoFieldName'>Confirmar contraseña:</p>
                {/* <p title='Confirmar nueva contraseña' className='userInfoFieldName pwdField'>Confirmar contraseña:</p> */}
                <TextField sx={{position: 'relative',}} required
                    name={`confirmPassword`} type={showConfirmPassword?'text':'password'} 
                    value={newUser.confirmPassword} onChange={handleChange} 
                    error={isMismatch}
                    helperText={isMismatch ? 'Las contraseñas no coinciden' : '\u00A0'}
                    FormHelperTextProps={{style:{position:'absolute',bottom:0,left:0,transform: 'translateX(-10px) translateY(20px)', fontSize:' 0.75rem', lineHeight:'1rem', flex:'0 !important',}}}
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
            <button type='submit' className='userInfoBtn updateBtn'>Crear usuario</button>
        </form>
    </div>)
}

export default NewUser