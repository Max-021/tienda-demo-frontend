import React, { useState } from 'react'

import Buttons from '../reusables/Buttons'
import UserInfoForm from './userOptionsComponents/UserInfoForm'
import UsersList from './userOptionsComponents/UsersList'
import NewUser from './userOptionsComponents/NewUser'

import { MdMenu } from "react-icons/md";
import Actions from './userOptionsComponents/Actions'

const MyProfile = () => {
    const [activeOption, setActiveOption] = useState('myProfile')
    const [isMenuActive, setIsMenuActive] = useState(false);

    const renderSelectedOption = (actOp) => {
        switch (actOp) {
            case 'myProfile':
                return <UserInfoForm/>
            case 'listUsers':
                return <UsersList/>
            case 'newUser':
                return <NewUser/>
            case 'actions':
                return <Actions/>
            default:
                return <p>No option implemented yet</p>
        }
    }
    const selectSwitchOption = (text) => {
        if(activeOption !== text) setActiveOption(text);
    }

    const btnArray = [
        {name: 'Mi perfil', action: () => selectSwitchOption('myProfile')},
        {name: 'Listar Usuarios', action: () => selectSwitchOption('listUsers')},
        {name: 'Crear Usuario', action: () => selectSwitchOption('newUser')},
        {name: 'Acciones', action: () => selectSwitchOption('actions')},
    ]

    return (
        <div className='myProfileContainer'>
            <div className='myProfileMenuIcon'><MdMenu title='Menú usuario' onClick={() => setIsMenuActive(prev => !prev)}/></div>
            <div className={`optionsList ${isMenuActive && 'activeOptionsList'}`}>
                <h5>Mi cuenta</h5>
                <Buttons btnArray={btnArray} btnDivClass='optionsListBtnContainer' btnClass='optionsListBtnUnit' activeBtnClass='optionsListBtnUnitActive' defActiveVal={0}/>
            </div>
            <div className={`relatedData`}>
                {isMenuActive && (<div className='overlay' onClick={() => setIsMenuActive(false)}></div>)}
                {renderSelectedOption(activeOption)}
            </div>
        </div>
    )
}

export default MyProfile