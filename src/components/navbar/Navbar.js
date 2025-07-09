import React,{useState,useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector} from 'react-redux';
import { authenticateStatus } from '../../redux/UserSlice';
import { logout } from '../../auxiliaries/axios';
import { MdLogout } from "react-icons/md";

import Menu from '../Menu/Menu'
import SearchBar from '../Menu/SearchBar';
import ConfirmMessage from '../reusables/ConfirmMessage';

const Navbar = () => {

  const location = useLocation();
  
  const [showCats,setShowCats] = useState('')
  const authSt = useSelector(authenticateStatus);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    setShowCats(location.pathname);//mover esto de setShowCats para que solo se ejecute dentro de manu, asi no se ejecuta cada vez que voy a otra pestaña
  },[location])

  const cerrarSesion = () => {
    setOpen(false);
    alert('aca')
    logout();
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
        <Link to='/'>Fly shop</Link>
        {/* temporal, ver como refactorizar rutas para que sean de comodo acceso a toda la app y sensibles al idioma */}
        {titleText()}
      </h1>
      { authSt && <button type='button' title='Cerrar sesión' className='icon-btn logout-btn' onClick={() => setOpen(true)}><MdLogout /></button> }
      <Menu showCats={showCats} authSt={authSt}/>
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