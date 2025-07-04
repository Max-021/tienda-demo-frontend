import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText'
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { addNewProductToCart } from '../redux/CartSlice';

const ProductCard = (props) => {

  const {name,descr,img,category,price,stock} = props;
  const [errorQty ,setErrorQty] = useState('');
  const [activeColor, setActiveColor] = useState(0);
  const [prodToCart,setProdToCart] = useState({
    name,
    price,
    color: stock[0]?.color || '',
    quantity: stock[0]?.quantity > 0 ? 1 : 0,
  })
  const dispatch = useDispatch();

  const setColorsData = (color,index) => {
    setProdToCart(prev =>({...prev, color, quantity: stock[index].quantity < 1 ? 0 : 1}));
    setActiveColor(index);
    setErrorQty('');
  }
  const addToCart = () => {
    console.log(prodToCart)
    dispatch(addNewProductToCart(prodToCart))
  }
  const validateAmount = (e) => {
    const max = stock[activeColor].quantity;
    const val = Number(e.target.value);
    if(val>max){
      setErrorQty(`Solo hay ${max} unidad${max > 1 && 's'} disponible${max > 1 && 's'}`)
    }else if(val < 1){
      setErrorQty('Mínimo una unidad poder agregar el producto al carrito')
    }else{
      setErrorQty('');
      setProdToCart(prev =>({...prev, quantity: Number(e.target.value)}))
    }
  }

    return (
      <div className='productCard'>
        {img.length === 1 ?
          <div>
            <img className='productDetailImg' src={img[0].startsWith('https') ? img[0] : require(`../assets/${img[0]}`)} alt={`${name}-${category}`}/>
          </div>
        :
        <div className='swiperContainer'>
          <Swiper navigation={true} modules={[Navigation]} className='mySwiper' loop={true}>
            {img.map((image, index) => {
              return <SwiperSlide key={index}>
                <img className='productDetailImg' src={image.startsWith('https') ? image : require(`../assets/${image}`)} alt={`${name}-${index}`}/>
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
          {stock.length > 0 && 
            <>
              <div className='productDetailColors'>
                <p>Colores</p>
                {stock.map((color,index) => {
                  return <button key={`${index}-${color.color}`} className={`colorBtn ${activeColor === index ? 'activeColorBtn':null}`}  onClick={() => setColorsData(color.color,index)}>
                            {color.color}
                  </button>
                })}
              </div>
              <div className='productDetailAvailableUnits'>
                <p>{stock[activeColor].quantity > 0 ? `${stock[activeColor].quantity} unidad${stock[activeColor].quantity > 1 && 'es'} disponible${stock[activeColor].quantity > 1 && 's'}` : 'No hay unidades disponibles'}</p>
              </div>
            </>
          }
          <div className='productDetailAmount'>
            <p>Cantidad</p>
            <TextField
              value={prodToCart.quantity} onChange={(e) => validateAmount(e)} 
              name={`prod-quantity`} id={`prod-quantity`} type='number' inputProps={{min: 1, max: stock[activeColor]?.quantity, style:{padding:5}}}/>
            {errorQty && <FormHelperText error>{errorQty}</FormHelperText>}
          </div>
          <div className='productDetailDescr'>
            <p>Descripción</p>
            <p>{descr}</p>
          </div>
          <button className='addToCartBtn' onClick={() => addToCart()} disabled={stock[activeColor]?.quantity < 1 || errorQty !== ''}> Agregar al carrito</button>
        </div>
      </div>


    )
}

export default ProductCard