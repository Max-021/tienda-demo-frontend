import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Buttons from '../reusables/Buttons';
import UserInfoForm from './userOptionsComponents/UserInfoForm';
import UsersList from './userOptionsComponents/UsersList';
import NewUser from './userOptionsComponents/NewUser';
import Actions from './userOptionsComponents/Actions';
import { username } from '../../redux/UserSlice';

import { MdMenu } from "react-icons/md";

const MyProfile = () => {
    const user = useSelector(username);
    const [activeOption, setActiveOption] = useState('myProfile');
    const [isMenuActive, setIsMenuActive] = useState(false);

    useEffect(() => {
        if (!isMenuActive) return;

        // 1) calcular scroll actual
        const scrollY = window.scrollY || window.pageYOffset || 0;

        // 2) compensación por scrollbar para evitar layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        // 3) fijar body y preservar la posición (evita que el fondo scrollee)
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';

        // opcional: marcar que el menú está abierto (clase en html) para CSS adicional
        document.documentElement.classList.add('has-open-mobile-menu');

        return () => {
            // restaurar estilos
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.classList.remove('has-open-mobile-menu');

            // restaurar scroll a la posición previa
            window.scrollTo(0, scrollY);
        };
    }, [isMenuActive]);

    const renderSelectedOption = (actOp) => {
        switch (actOp) {
        case 'myProfile':
            return <UserInfoForm />;
        case 'listUsers':
            return <UsersList />;
        case 'newUser':
            return <NewUser />;
        case 'actions':
            return <Actions />;
        default:
            return <p>No option implemented yet</p>;
        }
    };

    const selectSwitchOption = (text) => {
        if (activeOption !== text) setActiveOption(text);
        setIsMenuActive(false);
    };

    const btnArray = [
        { name: 'Mi perfil', action: () => selectSwitchOption('myProfile') },
        { name: 'Listar Usuarios', action: () => selectSwitchOption('listUsers') },
        { name: 'Crear Usuario', action: () => selectSwitchOption('newUser') },
        { name: 'Acciones', action: () => selectSwitchOption('actions') },
    ];

    const menuPortal = 
        <>
            {isMenuActive && <div className='overlay' onClick={() => setIsMenuActive(false)} />}
            <div className={`optionsList ${isMenuActive ? 'activeOptionsList' : ''}`} role="navigation" aria-label="Menú de usuario">
                <div className='optionsListUpper'>
                    <div className='optionsListTitle'>
                        <MdMenu title='Menú usuario' onClick={() => setIsMenuActive(prev => !prev)} />
                        <p>Mi cuenta</p>
                    </div>
                    <p className='optionsListUsername'>{user}</p>
                </div>
                <div className='menuSeparator'></div>
                <Buttons
                    btnArray={btnArray}
                    btnDivClass='optionsListBtnContainer'
                    btnClass='optionsListBtnUnit'
                    activeBtnClass='optionsListBtnUnitActive'
                    defActiveVal={0}
                />
            </div>
        </>;

    return (
        <div className='myProfileContainer' style={isMenuActive ? {overflow: 'hidden'} : {}}>
        <div className='myProfileMenuIcon'>
            <MdMenu title='Menú usuario' onClick={() => setIsMenuActive(prev => !prev)} />
        </div>
            {menuPortal}
        <div className='relatedData'>
            {renderSelectedOption(activeOption)}
        </div>
        </div>
    );
};

export default MyProfile;