import React, { useEffect, useState } from 'react'

import { listUsers } from '../../../auxiliaries/axiosHandlers'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { FaCog } from "react-icons/fa";
import { MdPersonOff } from "react-icons/md";

const UsersList = () => {
    const [usersList, setUsersList] = useState(null);

    useEffect(()=>{
        const getUsers = async () => {
            const list = await listUsers();
            setUsersList(list);
            console.log(list)
        }
        getUsers();
    },[])
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
                    {console.log(usersList)}
                    {Array.isArray(usersList) && usersList.map((user,index) => (
                        <TableRow key={index}>
                            <TableCell component={'th'} scope='row' align='left'>{user.username}</TableCell>
                            <TableCell align='left'>{user.role}</TableCell>
                            <TableCell align='right'>{user.mail}</TableCell>
                            <TableCell align='right' style={{display:'flex', gap:'10px', fontSize: '140%'}}>
                                <FaCog title='Cambiar rol de usuario' onClick={() => alert("reasigned!")} style={{color: '#3B82F6'}}/>
                                <MdPersonOff title='Suspender usuario' onClick={() => alert("user suspended!")} style={{color: 'grey'}}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default UsersList