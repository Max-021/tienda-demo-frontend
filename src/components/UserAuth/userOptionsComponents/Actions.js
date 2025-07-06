import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoadingNotifier } from '../../../hooks/useLoadingNotifier';
import { useNotification } from '../../reusables/NotificationContext';

import { deleteUser, deactivateUser } from '../../../auxiliaries/axios';
import { userId } from '../../../redux/UserSlice';
import ConfirmMessage from '../../reusables/ConfirmMessage';

const Actions = () => {
    const notify = useNotification();
    const userIdData = useSelector(userId);
    const [open, setOpen] = useState(false);
    const [dialogInfo, setDialogInfo] = useState({title: '', msg: '', fc: () => {}})

    const deleteMe = useLoadingNotifier(deleteUser, {successMsg: 'Usuario borrado con éxito. Redirigiendo...'});
    const deactivateMe = useLoadingNotifier(deactivateUser, {successMsg: 'Usuario desactivado con éxito. Redirigiendo...'});
    
    const submitAction = async (action) => {
        setOpen(false);
        if(!userIdData){
            notify('error','Error al intentar enviar información, reintente');
            return;
        }
        try {
            switch(action){
                case 'deactivate':
                    await deactivateMe(userIdData);
                break;
                case 'eliminate':
                    await deleteMe(userIdData);
                break;
                default:
                    notify('error','Ocurrió un error antes de enviar la información, reintente');
                    return;
                }
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
        } catch (error) {
            notify('error', 'Ocurrió un error en el servidor, reintente.');
        }
    }

    const setActiveAction = (action) => {
        switch(action){
            case 'deactivate':
                setDialogInfo(prev => ({...prev, fc: () => submitAction(action), title:'Desactivación', msg: 'El usuario va a ser desactivado y la sesión se cerrará, mientras permanezca en este estado no se podrá realizar ninguna acción. Se le enviará un correo informando sobre este cambio, para revertirlo con iniciar sesión nuevamente es suficiente. Al terminar la sesión se cerrará.'}))
            break;
            case 'eliminate':
                setDialogInfo(prev => ({...prev, fc: () => submitAction(action), title:'Eliminación', msg: 'IMPORTANTE: Esta acción es permanente. La sesión se cerrará y la cuenta se eliminará, los datos no se van a poder recuperar. Al terminar la sesión se cerrará.'}))
            break;
            default:
                notify('error', 'Ocurrió un error intentando ejecutar la acción, reintente1');
                return;
        }
        setOpen(true);
    }

    const actionsList = [
        {text: 'Desactivar cuenta', btnText: 'Desactivar', action: 'deactivate', btnClass: ''},
        {text: 'Eliminar cuenta', btnText: 'Eliminar', action: 'eliminate', btnClass: ''},
    ];

    return (
        <div className='userActionsContainer'>
            {actionsList.map((el, index) => {
                return <div key={index} className='userAction'>
                    <p>{el.text}</p>
                    <button type='button' onClick={() => setActiveAction(el.action)}>{el.btnText}</button>
                </div>
            })}
            <ConfirmMessage dialogClass='actionsDialog' windowStatus={open} cancelFc={setOpen} confirmFc={dialogInfo.fc} titleMsg={dialogInfo.title} textContent={dialogInfo.msg}/>
        </div>
    )
}

export default Actions