import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../reusables/NotificationContext';

import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl';
import InputLabel   from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select       from '@mui/material/Select';
import MenuItem     from '@mui/material/MenuItem';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import { addNewProductToCart, cartList } from '../../redux/CartSlice';

const ProductCard = (props) => {
  const notify = useNotification();
  const cartItems = useSelector(cartList);
  const {_id,name,descr,img,category,price,stock} = props;
  const [errorQty ,setErrorQty] = useState('');
  const [activeColor, setActiveColor] = useState(0);
  const [prodToCart,setProdToCart] = useState({
    _id,
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
  const addToCart = (prod) => dispatch(addNewProductToCart(prod));

  const handleChange = (e) => setProdToCart(prev => ({...prev, [e.target.name]: e.target.value}));

  const validateAmount = () => {
    const max = stock[activeColor].quantity;
    const val = prodToCart.quantity;
    if(val > max){
      return `Solo hay ${max} unidad${max > 1 && 'es'} disponible${max > 1 && 's'}`;
    }else if(val < 1){
      return 'Mínimo una unidad poder agregar el producto al carrito';
    }else{
      return '';
    }
  }
  const verifyBeforeAddingToCart = async () => {
    const valRes = validateAmount();
    if(valRes !== '') {
      setErrorQty(valRes);
      return;
    }
    const qtyToAdd = parseInt(prodToCart.quantity);
    if(isNaN(qtyToAdd)){
      setErrorQty("Cantidad inválida.");
      return;
    }

    const itemInCart = cartItems.find(itm => (itm._id === prodToCart._id && prodToCart.color === itm.color));
    const qtyInCart = itemInCart ? itemInCart.quantity : 0;
    const maxAvailable = stock[activeColor].quantity;

    if(qtyInCart + qtyToAdd > maxAvailable){
      const remaining = maxAvailable - qtyInCart;
      setErrorQty(`Ya tienes ${qtyInCart} en el carrito, solo quedan ${remaining} unidades disponibles.`)
      notify('error', 'La cantidad agregada al producto ya presente en el carrito excede la cantidad disponible.');
      return;
    }
    setErrorQty('');
    addToCart({...prodToCart, quantity: qtyToAdd})
  }

    return (
      <div className='productCard'>
        {img.length === 1 ?
          <div>
            <img className='productDetailImg' src={img[0].startsWith('https') ? img[0] : require(`../../assets/${img[0]}`)} alt={`${name}-${category}`}/>
          </div>
        :
        <div className='swiperContainer'>
          <Swiper navigation={true} modules={[Navigation]} className='mySwiper' loop={true}>
            {img.map((image, index) => {
              return <SwiperSlide key={index}>
                <img className='productDetailImg' src={image.startsWith('https') ? image : require(`../../assets/${image}`)} alt={`${name}-${index}`}/>
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
          <div className='productDetailPrice'>
            <p className=''>${price}</p>
          </div>
          {stock.length > 0 && 
            <>
              <FormControl variant="outlined" size="small" sx={{display:'flex', flexDirection:{sm: 'column', md:'row'},alignItems:{md:'center', sm: 'flex-start'},mb: 0, width:'auto'}}>
                <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                  <InputLabel className='productCardFieldTitle' id="color-select-label" htmlFor="color-select" sx={{mr:1, position:'static', transform: 'none'}} shrink>
                    Color
                  </InputLabel>
                  <Select
                    labelId="color-select-label"
                    id="color-select"
                    value={activeColor}
                    label=""
                    sx={{minWidth: 100}}
                    onChange={(e) => setColorsData(stock[e.target.value].color, e.target.value)}
                  >
                    {stock.map((item, index) => (
                      <MenuItem key={index} value={index}>
                        {item.color}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className='productDetailAvailableUnits'>
                  <p>
                    {stock[activeColor].quantity > 0
                      ? `${stock[activeColor].quantity} unidad${stock[activeColor].quantity > 1 ? 'es' : ''} disponible${stock[activeColor].quantity > 1 ? 's' : ''}`
                      : 'No hay unidades disponibles'}
                  </p>
                </div>
              </FormControl>
            </>
          }
          <div className='productDetailAmount'>
            <FormControl variant='outlined' size='small' sx={{display:'flex', flexDirection: 'column', alignItems: 'flex-start', mb:1,mt:1, width:'auto'}}>
              <div style={{display:'flex', flexDirection: 'row', alignItems: 'center', width:'100%'}}>
                <InputLabel className='productCardFieldTitle' htmlFor="quantity" shrink sx={{position: 'static', transform:'none', mr:1}} id="quantity-label">
                  Cantidad
                </InputLabel>
                <OutlinedInput
                  id='quantity' type='number' name='quantity'
                  value={prodToCart.quantity}
                  onChange={handleChange}
                  error={!!errorQty} helperText={errorQty || '\u00A0'}
                  inputProps={{min:1, max: stock[activeColor]?.quantity, style:{padding:5}, 'aria-labelledby': 'quantity-label'}}
                  label=""
                  sx={{minWidth:80}}
                />
              </div>
              {errorQty && (<FormHelperText error sx={{ml: 1,fontSize: '0.75rem',lineHeight: 1.2,}}>{errorQty}</FormHelperText>)}
            </FormControl>
          </div>
          <div className='productDetailDescr'>
            <p className='productCardFieldTitle'>Descripción</p>
            <p>{descr}</p>
          </div>
          <button className='addToCartBtn' onClick={() => verifyBeforeAddingToCart()}> Agregar al carrito</button>
        </div>
      </div>


    )
}

export default ProductCard