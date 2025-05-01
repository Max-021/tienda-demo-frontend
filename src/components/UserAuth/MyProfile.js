import React, { useEffect, useState } from 'react'
import { getUserInfo } from '../../auxiliaries/axiosHandlers'

import Buttons from '../reusables/Buttons'
import UserInfoForm from './userOptionsComponents/UserInfoForm'
import UsersList from './userOptionsComponents/UsersList'

const MyProfile = () => {
    const [activeOption, setActiveOption] = useState('myProfile')

    const renderSelectedOption = (actOp) => {
        switch (actOp) {
            case 'myProfile':
                return <UserInfoForm/>
            break;
            case 'listUsers':
                return <UsersList/>
            break;
                
            default:
                return <p>No option implemented yet</p>
            break;
        }
    }
    const selectSwitchOption = (text) => {
        if(activeOption !== text) setActiveOption(text);
    }

    const btnArray = [
        {name: 'Mi perfil', action: () => selectSwitchOption('myProfile')},
        {name: 'Listar Usuarios', action: () => selectSwitchOption('listUsers')},
        {name: 'Crear Usuario', action: () => selectSwitchOption('newUser')},
    ]

    return (
        <div className='myProfileContainer'>
            <div className='optionsList'>
                <h5>Mi cuenta</h5>
                <Buttons btnArray={btnArray} btnDivClass='optionsListBtnContainer' btnClass='optionsListBtnUnit'/>
            </div>
            <div className='relatedData'>
                {renderSelectedOption(activeOption)}
            </div>
        </div>
    )
}

export default MyProfile