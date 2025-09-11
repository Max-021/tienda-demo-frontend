import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Buttons from '../reusables/Buttons.jsx';
import UserInfoForm from './userOptionsComponents/UserInfoForm.jsx';
import UsersList from './userOptionsComponents/UsersList.jsx';
import NewUser from './userOptionsComponents/NewUser.jsx';
import Actions from './userOptionsComponents/Actions.jsx';
import { username, userRole } from '../../redux/UserSlice';
import { MdMenu } from "react-icons/md";
import { highLevelRoles } from '../../data/permissions';

const MyProfile = () => {
  const user = useSelector(username);
  const userRl = useSelector(userRole);

  const [activeOption, setActiveOption] = useState('myProfile');
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [validBtnArrayOptions, setValidBtnArrayOptions] = useState([]);

  const scrollYRef = useRef(0);
  const firstButtonRef = useRef(null);

  const selectSwitchOption = useCallback((text) => {
    setActiveOption(text);
    setIsMenuActive(false);
  }, []);

  const btnArray = useMemo(() => ([
    { id: 'myProfile', name: 'Mi perfil',       userLevel: [] },
    { id: 'listUsers', name: 'Listar Usuarios', userLevel: highLevelRoles },
    { id: 'newUser',   name: 'Crear Usuario',   userLevel: highLevelRoles },
    { id: 'actions',   name: 'Acciones',        userLevel: [] },
  ]), []);

  useEffect(() => {
    const filtered = btnArray
    .filter(item => {
      if (!Array.isArray(item.userLevel) || item.userLevel.length === 0) return true;
        return item.userLevel.includes(userRl);
      })
    .map(item => ({
      ...item,
      action: () => selectSwitchOption(item.id)
    }));

    setValidBtnArrayOptions(filtered);

    const isActiveStillValid = filtered.some(it => it.id === activeOption);
    if (!isActiveStillValid) {
      const fallback = filtered[0]?.id || 'myProfile';
      setActiveOption(fallback);
    }
  }, [btnArray, userRl]);

  useEffect(() => {
    if (!isMenuActive) return;

    scrollYRef.current = window.scrollY || window.pageYOffset || 0;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('has-open-mobile-menu');

    setTimeout(() => {
      if (firstButtonRef.current && typeof firstButtonRef.current.focus === 'function') {
        firstButtonRef.current.focus();
      }
    }, 0);

    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuActive(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.classList.remove('has-open-mobile-menu');

      window.scrollTo(0, scrollYRef.current);
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

  const menuPortal = (
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

        {/* Pasamos el array filtrado. Para accesibilidad, pasamos una ref al primer botón */}
        <Buttons
          btnArray={validBtnArrayOptions.map((b, i) => ({
            ...b,
            ref: i === 0 ? firstButtonRef : undefined
          }))}
          btnDivClass='optionsListBtnContainer'
          btnClass='optionsListBtnUnit'
          activeBtnClass='optionsListBtnUnitActive'
          defActiveVal={0}
        />
      </div>
    </>
  );

  return (
    <div className='myProfileContainer' style={isMenuActive ? { overflow: 'hidden' } : {}}>
      <div className='myProfileMenuIcon'>
        <MdMenu
          title='Menú usuario'
          onClick={() => setIsMenuActive(prev => !prev)}
          aria-expanded={isMenuActive}
          aria-controls="user-options-list"
        />
      </div>
      {menuPortal}
      <div className='relatedData'>
        {renderSelectedOption(activeOption)}
      </div>
    </div>
  );
};

export default MyProfile;