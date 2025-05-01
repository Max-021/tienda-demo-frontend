import React, {useState, useEffect,} from 'react'
import PasswordForm from '../userComponents.js/PasswordForm';

import TextField from '@mui/material/TextField'
import { FaEdit } from "react-icons/fa";

import { getUserInfo, updateUser } from '../../../auxiliaries/axiosHandlers'
import { allowedEditingRole, FIELD_LABELS } from '../../../data/permissions'

const UserInfoForm = () => {
    const [userInformation, setUserInformation] = useState({});
    const [newuserInfo, setNewUserInfo] = useState({});
    const [isEditingActive, setIsEditingActive] = useState(true);
    const [isChangePasswordActive, setIsChangePasswordActive] = useState(false);

    useEffect(() => {
        const userData = async () => {
            const resp = await getUserInfo()
            setUserInformation(resp)
            setNewUserInfo(resp);
            console.log(resp)//temporal, borrar
        }
        userData();
    },[])

    const handleChange = (e) => {
        setNewUserInfo({...newuserInfo, [e.target.name]: e.target.value});
    }
    const toggleEditing = () => {
        setNewUserInfo(userInformation);
        setIsEditingActive(active => !active);
    }

    const submitUserChanges = (e) => {
        e.preventDefault();
        const updatedUserData = {_id: userInformation._id,...newuserInfo}
        console.log(userInformation)
        console.log(updatedUserData)
        updateUser(newuserInfo);
    }
    return (
        <div className='userInfoForm'>
            <form className='userInformation' method='post' onSubmit={submitUserChanges}>
                <div className='userInfoTitles'>
                    <p>Mis datos {userInformation.role === allowedEditingRole && '| Administrador'}</p>
                    <button className={`userInfoTitleBtn ${isEditingActive ? null : 'active'}`} type='button' onClick={toggleEditing} title='Editar campos'>{isEditingActive ? 'Editar' : 'Cancelar edición'}<FaEdit/></button>
                </div>
                <div className='userInfoFields'>
                    {Object.keys(newuserInfo).map((el,index) => {
                            if (!el.startsWith('_')) {
                                return (<div key={index} className='userInfoContainer'>
                                    <p className='userInfoFieldName'>{FIELD_LABELS[el] || el}:</p>
                                    <TextField name={el} type={el === 'mail' ? 'email' : 'text'} inputProps={{style:{padding:'12px'}}} value={newuserInfo[el]} onChange={handleChange} disabled={isEditingActive}/>
                                </div>)}
                    })}
                </div>
                {!isEditingActive && <>
                    <button className='userInfoBtn updateBtn' type='submit'>Guardar Cambios</button>
                </>}
            </form>
            <div className='userPwdInfo'>
                <button className='userInfoBtn togglePwdForm' type='button' onClick={() => setIsChangePasswordActive(active => !active)}>{isChangePasswordActive ?'Cancelar':'Cambiar contraseña'}</button>
                {isChangePasswordActive &&
                    <PasswordForm isChangePasswordActive={isChangePasswordActive}/>
                }
            </div>
        </div>
    )
}

export default UserInfoForm