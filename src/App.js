import React, {useState, useEffect} from 'react';
import './sass/App.scss'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateStatus, checkLogin } from './redux/UserSlice';

//general
import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer'
//product related
import Products from './components/Products';
import SearchBar from './components/Menu/SearchBar';
import NewProduct from './components/NewProduct';
import NotFound from './components/NotFound';
//for users
import Signup from './components/UserAuth/SignUp';
import Login from './components/UserAuth/Login'
import MyProfile from './components/UserAuth/MyProfile';
//cart
import Cart from './components/Cart';

function App() {

  const [showSearch,setShowSearch] = useState('');
  const location = useLocation();
  const dispatch = useDispatch();
  const authSt = useSelector(authenticateStatus);

  useEffect(()=>{
    setShowSearch(location.pathname);
  },[location])
  useEffect(()=> {
    dispatch(checkLogin());
  },[])
  
//temporal, trabajar en la redireccion a un "404" si no esta logeado y quiere acceder a las rutas que no corresponden
//dejar fuera del "404" a la ruta del login que es la que permitiria acceder a las otras
//tener en cuenta usar desde el redux el islogged para el tema de los "404"

// /* Para que el signup entre deberia estar logeado otro usuario, solo un usuario existente puede dar de alta otro usuario */
  return (
    <div className="App">
      <Navbar/>
      {/* <SearchBar/> */}
      {showSearch !== '/'  ? null : <SearchBar/> }
      <Routes>
        <Route path='/' element={<Products/>}/>
        {/* temporal, revisar y cambiar segun sea necesario la ruta del /newProduct */}
        <Route path='/login' element={<Login/>}/>
        {/* acá poner el if? está logeado */}
        {
          authSt ?
            <>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/my-profile' element={<MyProfile/>}/>
              <Route path='/nuevo-producto' element={<NewProduct/>}/>
              <Route path='/editar-producto' element={<NewProduct/>}/>
            </> 
          : null
        }
        {/* acá termina el if? está logeado */}
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
