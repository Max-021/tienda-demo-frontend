import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';


import { addNewProductToCart } from '../redux/CartSlice';
//revisar que sirve y que no para construir la tarjeta expandida

const cardSx = {
    width:'100%',
    height: 'auto',
  }
  const linkCard = {
    textDecoration: 'underline',
    color: 'black',
    transition: 'all 0.6s',
    "&:hover": {
      color: '#EEF0EB !important',
    }
  }

// const ProductCard = ({productInfo}) => {
const ProductCard = (props) => {

  const {name,descr,img,category,colors,price,quantity} = {...props}
  const [amountChosen,setAmountChosen] = useState('');
  const [activeColor, setActiveColor] = useState(0);
  const [prodToCart,setProdToCart] = useState({
    name,
    price,
    quantity: 1,
    color: colors[0],
  })
  const dispatch = useDispatch();

  const setColorsData = (color,index) => {
    setProdToCart({...prodToCart, color})
    setActiveColor(index)
  }
  const addToCart = () => {
    console.log(prodToCart)
    dispatch(addNewProductToCart(prodToCart))
  }

    return (
      <div className='productCard'>
        {img.length === 1 ?
          <div>
            <img className='productDetailImg' src={img[0].startsWith('https') ? img[0] : require(`../assets/${img}`)} alt={`${img}`}/>
          </div>
        :
        <div className='swiperContainer'>
          <Swiper navigation={true} modules={[Navigation]} className='mySwiper' loop={true}>
            {img.map((image, index) => {
              return <SwiperSlide>
                <img className='productDetailImg' src={image.startsWith('https') ? image : require(`../assets/${image}`)} alt={`${image}`}/>
              </SwiperSlide>
            })}
          </Swiper>
        </div>
        }
        <div className='productDetails'>
          <div className='productDetailTitle'>
            <p className='productDetailCategory'>{category}</p>
            <h2 className='productDetailName'>
              {name}
            </h2>
          </div>
          <div className='productDetailColors'>
            <p>Colores</p>
            {colors.map((color,index) => {
              return <button key={index} className={`colorBtn ${activeColor === index ? 'activeColorBtn':null}`}  onClick={() => setColorsData(color,index)}>
                {color}
              </button>
            })}
          </div>
          <div className='productDetailAmount'>
            <InputLabel id={`quantity-select`} />
            <p>Cantidad</p>
            <TextField
              value={prodToCart.quantity} onChange={(e) => setProdToCart({...prodToCart, quantity: Number(e.target.value)})} 
              name={`prod-quantity`} id={`prod-quantity`} type='number' inputProps={{style:{padding:5}}}/>
          </div>
          <div className='productDetailDescr'>
            <p>Descripción</p>
            <p>{descr}</p>
          </div>
          <button className='addToCartBtn' onClick={() => addToCart()}> Agregar al carrito</button>
        </div>
      </div>


    )
}

export default ProductCard