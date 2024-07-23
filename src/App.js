import React from 'react';
import './sass/App.scss'

import Navbar from './components/navbar/Navbar';
import Footer from './components/Footer'
import Products from './components/Products';
import SearchBar from './components/Menu/SearchBar';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <SearchBar/>
      <Products/>
      <Footer/>
    </div>
  );
}

export default App;
