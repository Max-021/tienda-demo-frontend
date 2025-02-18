import React, { useEffect, useState } from 'react'

import { listUsers } from '../../../auxiliaries/axiosHandlers'

const UsersList = () => {
    const [usersList, setUsersList] = useState(null);

    useEffect(()=>{
        const getUsers = async () => {
            const list = await listUsers();
            setUsersList(list);
        }
        getUsers();
    },[])
    return <div>
        {usersList === null ?
            <div>No users yet, temporal, cambiar</div>
        :
            usersList.map((user,index)=>{
                return <div key={index}>
                    <p>Usuario: {user.username}</p>
                    <p>Mail: {user.mail}</p>
                    <p>Rol: {user.userRole}</p>
                </div>
            })
        }
    </div>
}

export default UsersList