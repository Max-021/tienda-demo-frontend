import React,{useState,useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch} from 'react-redux';
import { authenticateStatus, checkLogin } from '../../redux/UserSlice';
import { logout } from '../../auxiliaries/axiosHandlers';
import { MdLogout } from "react-icons/md";

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import Menu from '../Menu/Menu'

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Navbar = () => {

  // const dispatch = useDispatch();
  const location = useLocation();
  
  const [showCats,setShowCats] = useState('')
  const authSt = useSelector(authenticateStatus);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    setShowCats(location.pathname);
  },[location])
  // useEffect(()=> {
  //   dispatch(checkLogin());
  // },[])

  const cerrarSesion = () => {
    setOpen(false);
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
      {console.log(authSt)}
      {
        authSt && <button type='button' title='Cerrar sesión' className='icon-btn logout-btn' onClick={() => setOpen(true)}><MdLogout /></button>
      }
      <Menu showCats={showCats} authSt={authSt}/>
      <Dialog fullWidth maxWidth='90%' open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
        Desea cerrar sesion?
        <button type='button' title='confirmar cierre de sesión' onClick={() => cerrarSesion()}> Sí </button>
        <button type='button' title='No' onClick={() => setOpen(false)}> No </button>
      </Dialog>
    </div>
  )
}

export default Navbar