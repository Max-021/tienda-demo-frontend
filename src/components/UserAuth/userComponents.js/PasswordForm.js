import React, {useState} from 'react'

import { updatePassword } from '../../../auxiliaries/axiosHandlers';

import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment } from '@mui/material'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const PasswordForm = ({isChangePasswordActive}) => {
    const [userPwd, setUserPwd] = useState({password:'', newPassword:'',confirmNewPassword:''})
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

    const handlePwd = (e) => setUserPwd(prev => ({...prev, [e.target.name]: e.target.value}))

    const submitUpdatedPassword = (e) => {
        e.preventDefault();

        //dejar que esto pase solo cuando las validaciones del formulario son correctas
        updatePassword(userPwd)
    }
    const isMismatch = userPwd.confirmNewPassword !== '' && userPwd.confirmNewPassword !== userPwd.newPassword;

    return (
        <form className='pwdChangeContainer' method='post' onSubmit={submitUpdatedPassword}>
            <div className='userInfoContainer pwdUserInfoContainer'>
                <p title='Contraseña' className='userInfoFieldName pwdField'>Contraseña:</p>
                <TextField name={'password'} type={showPassword?'text':'password'} inputProps={{style:{padding:'12px'}}} value={userPwd.password} onChange={handlePwd} disabled={!isChangePasswordActive}
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
                <p title='Nueva contraseña' className='userInfoFieldName pwdField'>Nueva contraseña:</p>
                <TextField name={'newPassword'} type={showNewPassword?'text':'password'} inputProps={{style:{padding:'12px'}}} value={userPwd.newPassword} onChange={handlePwd} disabled={!isChangePasswordActive}
                    InputProps={{endAdornment:(
                        <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(prev => !prev)}>
                                {showNewPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                            </IconButton>
                        </InputAdornment>
                    )}}
                    />
            </div>
            <div className='userInfoContainer pwdUserInfoContainer'>
                <p title='Confirmar nueva contraseña' className='userInfoFieldName pwdField'>Confirmar nueva contraseña:</p>
                <TextField disabled={!isChangePasswordActive} sx={{position: 'relative',}}
                    name={`confirmNewPassword`} type={showConfirmNewPassword?'text':'password'} 
                    value={userPwd.confirmNewPassword} onChange={handlePwd} 
                    error={isMismatch}
                    helperText={isMismatch ? 'Las contraseñas no coinciden' : '\u00A0'}
                    FormHelperTextProps={{style:{position:'absolute',bottom:0,left:0,transform: 'translateX(-10px) translateY(20px)', fontSize:' 0.75rem', lineHeight:'1rem', flex:'0 !important',}}}
                    inputProps={{style:{padding:'12px'}}}
                    InputProps={{endAdornment:(
                        <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(prev => !prev)}>
                                {showConfirmNewPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                            </IconButton>
                        </InputAdornment>
                    )}}
                />
            </div>
            <button className='userInfoBtn updatePwdBtn' type='submit'>Actualizar contraseña</button>
        </form>
    )
}

export default PasswordForm