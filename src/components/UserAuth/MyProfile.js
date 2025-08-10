import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import Buttons from '../reusables/Buttons';
import UserInfoForm from './userOptionsComponents/UserInfoForm';
import UsersList from './userOptionsComponents/UsersList';
import NewUser from './userOptionsComponents/NewUser';
import Actions from './userOptionsComponents/Actions';

import { MdMenu } from "react-icons/md";

const MyProfile = () => {
  const [activeOption, setActiveOption] = useState('myProfile');
  const [isMenuActive, setIsMenuActive] = useState(false);

  useEffect(() => {
    if (!isMenuActive) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    if (scrollbarWidth) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.paddingRight = '';
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
    // opcional: cerrar menú en mobile al seleccionar
    setIsMenuActive(false);
  };

  const btnArray = [
    { name: 'Mi perfil', action: () => selectSwitchOption('myProfile') },
    { name: 'Listar Usuarios', action: () => selectSwitchOption('listUsers') },
    { name: 'Crear Usuario', action: () => selectSwitchOption('newUser') },
    { name: 'Acciones', action: () => selectSwitchOption('actions') },
  ];

  // Menu + overlay se renderizan en body para evitar problemas con ancestors que usan transform
  const menuPortal = createPortal(
    <>
      {isMenuActive && <div className='overlay' onClick={() => setIsMenuActive(false)} />}
      <div className={`optionsList ${isMenuActive ? 'activeOptionsList' : ''}`} role="navigation" aria-label="Menú de usuario">
        <h5>Mi cuenta</h5>
        <Buttons
          btnArray={btnArray}
          btnDivClass='optionsListBtnContainer'
          btnClass='optionsListBtnUnit'
          activeBtnClass='optionsListBtnUnitActive'
          defActiveVal={0}
        />
      </div>
    </>,
    document.body
  );

  return (
    <div className='myProfileContainer'>
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