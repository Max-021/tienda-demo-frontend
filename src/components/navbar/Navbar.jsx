import React,{useState,useEffect} from 'react'
import { Link, useLocation, } from 'react-router-dom'
import { useSelector} from 'react-redux';
import { authenticateStatus, userRole } from '../../redux/UserSlice';
import { logout } from '../../auxiliaries/axios';
import { MdLogout } from "react-icons/md";
import { useNotification } from '../reusables/NotificationContext.jsx';

import Menu from '../Menu/Menu.jsx'
import SearchBar from '../Menu/SearchBar.jsx';
import ConfirmMessage from '../reusables/ConfirmMessage.jsx';

const Navbar = () => {
  const notify = useNotification();
  const location = useLocation();
  
  const [showCats,setShowCats] = useState('')
  const authSt = useSelector(authenticateStatus);
  const userRl = useSelector(userRole);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    setShowCats(location.pathname);//mover esto de setShowCats para que solo se ejecute dentro de manu, asi no se ejecuta cada vez que voy a otra pestaña
  },[location])

  const cerrarSesion = () => {
    setOpen(false);
    try {
      logout();
      window.location.replace('/');            
    } catch (error) {
      notify('error', error) 
    }
  }
  const titleText = () => {//Agregar dependiendo del contenido que quiera al texto del titulo
    switch (showCats) {
      case '/nuevo-producto':
        return ' - Nuevo producto'
      case '/editar-producto':
        return ' - Editar producto'
      default:
        return '';
    }
  }

  return (
    <div className={`navBar ${showCats === '/nuevo-producto' || showCats === '/editar-producto' ? 'navBarSimple' : null}`}>
      <h1>
        <Link to='/' reloadDocument>{import.meta.env.VITE_SHOP_NAME}</Link>
        {titleText()}
      </h1>
      { authSt && <button type='button' title='Cerrar sesión' className='icon-btn logout-btn' onClick={() => setOpen(true)}><MdLogout /></button> }
      <Menu showCats={showCats} authSt={authSt} role={userRl}/>
      <ConfirmMessage 
        windowStatus={open}
        confirmFc={cerrarSesion} cancelFc={setOpen} 
        titleMsg={"¿Desea cerrar sesion?"}
        yesTitle='Confirmar cierre de sesión' yesTxt='Confirmar'
        noTitle='Cancelar' noTxt='Cancelar'
      />
    </div>
  )
}

export default Navbar