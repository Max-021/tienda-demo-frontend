import React, {useState, useEffect} from 'react';
import './sass/App.scss'
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateStatus, checkLogin } from './redux/UserSlice';
import { setView } from './redux/searchBarSlice';

//para el html
import Meta from './Meta.jsx';
//general
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/Footer.jsx'
//product related
import Products from './components/Products.jsx';
import SearchBar from './components/Menu/SearchBar.jsx';
import NewProduct from './components/NewProduct.jsx';
import NotFound from './components/NotFound.jsx';
//for users
import Signup from './components/UserAuth/SignUp.jsx';
import Login from './components/UserAuth/Login.jsx'
import MyProfile from './components/UserAuth/MyProfile.jsx';
import ResetPassword from './components/UserAuth/ResetPassword.jsx';
//cart
import Cart from './components/Cart.jsx';

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

    if (typeof window === 'undefined') return;
    const mq = window.matchMedia ? window.matchMedia('(max-width: 900px)') : { matches: window.innerWidth <= 900 };
    dispatch(setView(mq.matches ? 'list' : 'grid'));

  },[dispatch])
  
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