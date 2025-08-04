import React, { useEffect, useState } from 'react'
import { useLoadingHook } from '../../../hooks/useLoadingHook';
import { useNotification } from '../../reusables/NotificationContext';
import LoadingSpinner from '../../reusables/LoadingSpinner';
import LoadingError from '../../reusables/LoadingError';

import { listUsers, toggleSuspension, setNewUserRole, getRolesList } from '../../../auxiliaries/axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import { FaCog } from "react-icons/fa";
import { MdPersonOff } from "react-icons/md";
import { GrFormClose } from "react-icons/gr";

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const UsersList = () => {
    const notify = useNotification();
    const [usersList, setUsersList] = useState(null);
    const [open, setOpen] = useState(false)
    const [rolesList, setRolesList] = useState([])
    const [selectedUser, setSelectedUser] = useState({});
    const [newRole, setNewRole] = useState("");
    const [auxLoading, setAuxLoading] = useState(false);

    useEffect(()=>{
        const getUsers = async () => {
            const roles = await getRolesList();
            setRolesList(roles.data.roles);
        }
        getUsers();
    },[])

    const {data: list, loading, error, refetch} = useLoadingHook(listUsers, []);
    useEffect(()=>{
        if(list){
            setUsersList(list);
        }
    }, [list]);

    const openDialog = (user) => {
        setOpen(true)
        setSelectedUser(user)
    }
    const cancelDialog = () => {
        setOpen(false);
        setTimeout(() => {
            setNewRole("");
            setSelectedUser({});
        }, 700);
    }
    const awaitAndRefetch = async (fn,data, msg='Acción realizada con éxito!') => {
        try {
            setAuxLoading(true);
            await fn(...data);
            notify('success', msg);
        } catch (error) {
            notify('error', error.message);
        }finally{
            setAuxLoading(false);
            refetch();
        }
    }
    const changeRole = (user, role) => {
        cancelDialog();
        awaitAndRefetch(setNewUserRole,[user, role], 'Rol actualizado.')
    }
    const selectRowStatus = (status) => {
        switch (status) {
            case "suspended":
                return 'suspendedUser';
            case "inactive":
                return 'inactiveUser';
            case "locked":
                return 'lockedUser';        
            default:
                return '';
        }
    }
    if(loading || auxLoading) return <LoadingSpinner containerClass={'spinnerStart'} spinnerInfo='formSpinner'/>
    if(error)   return <LoadingError containerClass='spinnerStart' fn={refetch} error={error}/>

    return <>
        <TableContainer component={Paper}>
            <Table aria-label="client-list-table">
                <TableHead>
                    <TableRow>
                        <TableCell align='left'>Usuario</TableCell>
                        <TableCell align='left'>Rol</TableCell>
                        <TableCell align='right'>Mail</TableCell>
                        <TableCell align='right'>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(usersList) && usersList.map((user,index) => (
                        <TableRow key={index} className={selectRowStatus(user.status)}>
                            <TableCell component={'th'} scope='row' align='left'>{user.username}</TableCell>
                            <TableCell align='left'>{user.role}</TableCell>
                            <TableCell align='right'>{user.mail}</TableCell>
                            <TableCell align='right' style={{display:'flex', gap:'10px', fontSize: '140%'}}>
                                <FaCog title='Cambiar rol de usuario' onClick={() => openDialog(user)} style={{color: '#3B82F6'}}/>
                                <MdPersonOff title={user.status === 'active' ? 'Suspender usuario' : 'Activar usuario'} onClick={() => awaitAndRefetch(toggleSuspension,[user],'Usuario suspendido.')} style={{color: 'grey'}}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog PaperProps={{sx:{boxSizing: 'border-box', padding: '0 12px 12px 12px', }}} fullWidth maxWidth='xs' open={open} onClose={cancelDialog} TransitionComponent={Transition}>
            <GrFormClose className='closeBtn' onClick={() => setOpen(false)} style={{right: '0', top: '4px'}}/>
            <div className='currentRoleContainer'>
                <p className=''>Rol actual:</p>
                <p className='selectedUser'>{rolesList.find(rol => rol === selectedUser.role)}</p>
            </div>
            <div className='separator'></div>
            <div className='rolesAvContainer'>
                <p className='title'>Roles disponibles</p>
                <div className='rolesAv'>
                    {rolesList && rolesList.filter((e) => e !== selectedUser.role).map((role, index) => {
                        //tempora, ver si cambio el p por un button o algo mejor, dejar p por ahora
                        return <p className={`${newRole === role ? 'activeNewRole':''}`} key={index} onClick={() => setNewRole(role)}>{role}</p>
                    })}
                </div>
            </div>
            <div className="rolesBtns">
                <button type='button' onClick={cancelDialog}>Cancelar</button>
                <button type='button' onClick={() => changeRole(selectedUser, newRole)} disabled={newRole === '' ? true : false}>Actualizar</button>
            </div>
        </Dialog>
    </>
}

export default UsersList