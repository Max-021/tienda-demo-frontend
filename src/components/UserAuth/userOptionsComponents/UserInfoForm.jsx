import React, {useState, useEffect,} from 'react'
import { useSelector } from 'react-redux';
import { useLoadingHook } from '../../../hooks/useLoadingHook.js';
import { useNotification } from '../../reusables/NotificationContext.jsx';
import PasswordForm from '../userComponents.js/PasswordForm.jsx';
import LoadingSpinner from '../../reusables/LoadingSpinner.jsx';
import LoadingError from '../../reusables/LoadingError.jsx';

import TextField from '@mui/material/TextField'
import { FaEdit } from "react-icons/fa";

import { getUserInfo, updateUser } from '../../../auxiliaries/axios'
import { allowedEditingRole, FIELD_LABELS } from '../../../data/permissions'
import { userId } from '../../../redux/UserSlice';

const UserInfoForm = () => {
    const notify = useNotification();
    const userIdData = useSelector(userId)
    const [userInformation, setUserInformation] = useState({});
    const [newuserInfo, setNewUserInfo] = useState({});
    const [isEditingActive, setIsEditingActive] = useState(true);
    const [isChangePasswordActive, setIsChangePasswordActive] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false)
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const sanitizeUserData = (userData) => {
        const {role, ...rest} = userData;
        return rest;
    }

    const {data: userData, loading, error, refetch} = useLoadingHook(getUserInfo, [userIdData], {immediate: Boolean(userIdData)});
    useEffect(()=> {
        if(userData){
            if(!initialLoadDone) setInitialLoadDone(true);
            setUserInformation(userData.data);
            setNewUserInfo(sanitizeUserData(userData.data));
        }
    }, [userData, initialLoadDone]);

    const handleChange = (e) => setNewUserInfo({...newuserInfo, [e.target.name]: e.target.value});
    const toggleEditing = () => {
        setNewUserInfo(sanitizeUserData(userInformation));
        setIsEditingActive(active => !active);
    }

    const submitUserChanges = async (e) => {
        e.preventDefault();
        try {
            setPendingSubmit(true);
            await updateUser(newuserInfo);
            notify('success', 'Datos actualizados!');
        } catch (error) {
            notify('error', error.message);
        }finally{
            setPendingSubmit(false);
            refetch();
        }
    }

    if(!initialLoadDone && loading){
        return <LoadingSpinner containerClass='spinnerStart' spinnerInfo='formSpinner'/>
    }
    if(error){
        return <LoadingError containerClass='userInfoForm' fn={refetch} error={error}/>
    }
    return (
        <div className='userInfoForm'>
            <form className='userInformation' method='post' onSubmit={submitUserChanges}>
                <div className='userInfoTitles'>
                    <div>
                        <p style={{display: 'inline-block'}}>Mis datos </p>
                        <p style={{color: 'grey', display: 'inline-block'}}>&nbsp;{`| ${userInformation.role}`}</p>
                        {/* {userInformation?.role === allowedEditingRole && '| Administrador'} */}
                    </div>
                    { Object.keys(newuserInfo).length && <button className={`userInfoTitleBtn ${isEditingActive ? null : 'active'}`} type='button' onClick={toggleEditing} title='Editar campos'>{isEditingActive ? 'Editar' : 'Cancelar edición'}<FaEdit/></button>}
                </div>
                <div className='userInfoFields'>
                    {Object.keys(newuserInfo || {}).map((el,index) => {
                        if (!el.startsWith('_')) {
                            return (<div key={index} className='userInfoContainer'>
                                <p className='userInfoFieldName'>{FIELD_LABELS[el] || el}:</p>
                                <TextField fullWidth name={el} type={el === 'mail' ? 'email' : 'text'} inputProps={{style:{padding:'12px'}}} value={newuserInfo[el]} onChange={handleChange} disabled={isEditingActive}/>
                            </div>)}else{ return null}
                    })}
                </div>
                {!isEditingActive && <>
                    <button className='userInfoBtn updateBtn' type='submit'>{initialLoadDone && (pendingSubmit || loading) ? <LoadingSpinner spinnerInfo='lightColorSpinner'/> :'Guardar Cambios'}</button>
                </>}
            </form>
            <div className='userPwdInfo'>
                <button className='userInfoBtn togglePwdForm' type='button' onClick={() => setIsChangePasswordActive(active => !active)}>{isChangePasswordActive ?'Cancelar':'Cambiar contraseña'}</button>
                {isChangePasswordActive &&
                    <PasswordForm isChangePasswordActive={isChangePasswordActive} userEmail={userInformation.mail}/>
                }
            </div>
        </div>
    )
}

export default UserInfoForm