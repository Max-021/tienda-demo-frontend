import React, {useState, useEffect} from 'react';
import './sass/App.scss'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateStatus, checkLogin } from './redux/UserSlice';

//para el html
import Meta from './Meta';
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
import ResetPassword from './components/UserAuth/ResetPassword';
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
  
  return (
    <div className="App">
      <Meta/>
      <Navbar/>
      {showSearch !== '/'  ? null : <SearchBar/> }
      <Routes>
        <Route path='/' element={<Products/>}/>
        <Route path='/login' element={<Login/>}/>
        {/* <Route path='/signup' element={<Signup/>}/> */}{/* desactivado si no corresponde, */}
        {
          authSt ?
            <>
              {/* <Route path='/signup' element={<Signup/>}/> */}
              <Route path='/my-profile' element={<MyProfile/>}/>
              <Route path='/nuevo-producto' element={<NewProduct/>}/>
              <Route path='/editar-producto' element={<NewProduct/>}/>
            </> 
          : null
        }
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;