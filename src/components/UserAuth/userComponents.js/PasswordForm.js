import React, {useState} from 'react'
import { useNotification } from '../../reusables/NotificationContext';
import LoadingSpinner from '../../reusables/LoadingSpinner';
import PasswordRules from './PasswordRules';
import IconPopOver from '../../reusables/IconPopOver';
import { updatePassword } from '../../../auxiliaries/axios';
import { testPwd } from '../../../auxiliaries/validationFunctions';

import TextField from '@mui/material/TextField';
import { IconButton, InputAdornment } from '@mui/material';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const PasswordForm = ({isChangePasswordActive}) => {
    const notify = useNotification();
    const [userPwd, setUserPwd] = useState({password:'', newPassword:'',confirmNewPassword:''});
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [newPwdError, setNewPwdError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePwd = (e) => setUserPwd(prev => ({...prev, [e.target.name]: e.target.value}));

    const submitUpdatedPassword = async (e) => {
        e.preventDefault();
        if(!isFormValid){
            notify('error', 'Corrige los errores antes de continuar');
            return;
        }
        try {
            setLoadingStatus(true);
            await new Promise(resolve => setTimeout(resolve, 30000));
            //dejar que esto pase solo cuando las validaciones del formulario son correctas
            await updatePassword(userPwd)
            notify('success', 'Actualización de contraseña exitosa');
        } catch (error) {
            notify('error', 'Ocurrio un error al intentar actualizar la contraseña, reintente.');
        }finally{
            setLoadingStatus(false);
        }
    }
    const isMismatch = userPwd.confirmNewPassword !== '' && userPwd.confirmNewPassword !== userPwd.newPassword;
    const isFormValid = userPwd.password && userPwd.newPassword && userPwd.confirmNewPassword && !newPwdError && !isMismatch;

    return (<>       
        <form className='pwdChangeContainer' method='post' onSubmit={submitUpdatedPassword}>
            <div className='userInfoContainer pwdUserInfoContainer'>
                <p title='Contraseña' className='userInfoFieldName pwdField'>Contraseña</p>
                <TextField required name={'password'} type={showPassword?'text':'password'} inputProps={{style:{padding:'12px'}}} value={userPwd.password} onChange={handlePwd} disabled={!isChangePasswordActive}
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
                <p title='Nueva contraseña' className='userInfoFieldName pwdField'>
                    Nueva contraseña
                    <IconPopOver setAnchorEl={setAnchorEl} anchorEl={anchorEl} shownElement={<PasswordRules oldPwd={userPwd.password} newPwd={userPwd.newPassword}/>}/>
                </p>
                <TextField required name={'newPassword'} type={showNewPassword?'text':'password'} disabled={!isChangePasswordActive}
                    value={userPwd.newPassword} 
                    onChange={e =>{
                        handlePwd(e);
                        setNewPwdError(testPwd(e.target.value));
                        if(e.target.value === userPwd.password) setNewPwdError('La nueva contraseña no puede ser igual a la anterior');
                    }}
                    onBlur={e => setNewPwdError(testPwd(e.target.value))}
                    error={!!newPwdError} helperText={newPwdError || '\u00A0'}
                    inputProps={{style:{padding:'12px'}}} 
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
                <p title='Confirmar nueva contraseña' className='userInfoFieldName pwdField'>Confirmar nueva contraseña</p>
                <TextField required disabled={!isChangePasswordActive} sx={{position: 'relative',marginBottom: '16px'}}
                    name={`confirmNewPassword`} type={showConfirmNewPassword?'text':'password'} 
                    value={userPwd.confirmNewPassword} onChange={handlePwd} 
                    error={isMismatch}
                    helperText={isMismatch ? 'Las contraseñas no coinciden' : '\u00A0'}
                    FormHelperTextProps={{style:{fontWeight: 'bold',position:'absolute',bottom:0,left:0,transform: 'translateX(-10px) translateY(20px)', fontSize:' 0.75rem', lineHeight:'1rem', flex:'0 !important',}}}
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
            <button className='userInfoBtn updatePwdBtn' type='submit'>
                {!loadingStatus ? 'Actualizar contraseña': <LoadingSpinner spinnerInfo='lightColorSpinner smallSpinner' containerClass='spinnerCenter'/>}
            </button>
        </form>
    </>)
}

export default PasswordForm