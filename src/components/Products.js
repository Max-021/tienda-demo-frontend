import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  fetchActiveProducts } from '../redux/ProductsSlice';

import { GrFormClose } from "react-icons/gr";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import ProductPreview from './productsSection/ProductPreview';
import ProductCard from './ProductCard';
import LoadingSpinner from './reusables/LoadingSpinner';
import LoadingError from './reusables/LoadingError'

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Products = () => {
  const [open,setOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const {filteredProducts, loading, error, noSearchRes, } = useSelector((s) => s.products)
  const dispatch = useDispatch();

  const handleOpen = (prodInd) =>{
    setOpen(true)
    setProductData({ ...filteredProducts[prodInd] })
  }

  useEffect(() => {
    dispatch(fetchActiveProducts());
  }, [dispatch])

  if(loading === 'pending') return <LoadingSpinner containerClass='productsLayout' spinnerInfo='bigSpinner'/>
  if(error !== null)   return <LoadingError containerClass='productsLayout'/>
  if(noSearchRes)   return <div className='productsLayout'>
                        <div>La búsqueda no arrojó resultados. CAMBIAR ESTE TEXTO! temporal</div>
                      </div>

  return (
    <div className='productsLayout'>
      {filteredProducts.length > 0 ? filteredProducts.map((product,index) => {//Esta seria la tarjeta de cada producto, se puede sacar a otro archivo
          return <ProductPreview key={`${product._id}`} ind={index} product={product} handleOpen={handleOpen}/>
      }) : 
      <div>No hay articulos por el momento, temporal, cambiar esto</div>}
    <Dialog PaperProps={{
      sx:{
        boxSizing: 'border-box',
        transition: '0.7s all',
        height: {lg:'auto',md: '50vh', },
        width: {md: '90%',sm: 'fit-content', xs: 'fit-content'},
      }
    }} 
    fullWidth maxWidth='90%' open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
      <GrFormClose className='closeBtn' onClick={() => setOpen(false)}/>
      <ProductCard {...productData}/>
    </Dialog>
    </div>
  )
}

export default Products