import React, { useEffect, useState } from 'react'

import { listUsers } from '../../../auxiliaries/axiosHandlers'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
                            <TableCell align='left'>{user.userRole}</TableCell>
                            <TableCell align='right'>{user.mail}</TableCell>
                            <TableCell align='right'>icono</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default UsersList