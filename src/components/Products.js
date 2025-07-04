import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { filteredProducts, noSearchRes, getProductsList } from '../redux/ProductsSlice';
import { getAllProducts } from '../auxiliaries/axios';

import { GrFormClose } from "react-icons/gr";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import ProductPreview from './productsSection/ProductPreview';
import ProductCard from './ProductCard';
import LoadingSpinner from './reusables/LoadingSpinner';
import LoadingError from './reusables/LoadingError'
import { useLoadingHook } from '../hooks/useLoadingHook';

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Products = () => {
  const [open,setOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const selectorData = useSelector(filteredProducts);
  const noRes = useSelector(noSearchRes);
  const dispatch = useDispatch();

  const handleOpen = (prodInd) =>{
    setOpen(true)
    setProductData({ ...selectorData[prodInd] })
  }

  const {data: products, loading, error, refetch} = useLoadingHook(getAllProducts, []);

  useEffect(() => {
    if(products) {
      dispatch(getProductsList(products))
    };
  }, [products, dispatch])

  if(loading) return <LoadingSpinner containerClass='productsLayout'/>
  if(error)   return <LoadingError containerClass='productsLayout'/>
  if(noRes)   return <div className='productsLayout'>
                        <div>La búsqueda no arrojó resultados. CAMBIAR ESTO! temporal</div>
                      </div>

  return (
    <div className='productsLayout'>
      {selectorData.length > 0 ? selectorData.map((product,index) => {//Esta seria la tarjeta de cada producto, se puede sacar a otro archivo
          return <ProductPreview key={index} ind={index} product={product} handleOpen={handleOpen}/>
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