import React, {useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { currentViewValue } from '../redux/searchBarSlice';
import { filteredProducts, noSearchRes, getProductsList } from '../redux/ProductsSlice';
import { authenticateStatus, userRole } from '../redux/UserSlice';
import { allowedEditingRole } from '../data/permissions';
import { getAllProducts } from '../auxiliaries/axios';

import { GrFormClose } from "react-icons/gr";
import { MdEditSquare } from "react-icons/md";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import ProductCard from './ProductCard';
import LoadingSpinner from './reusables/LoadingSpinner';
import LoadingError from './reusables/LoadingError'
import { useLoadingHook } from '../hooks/useLoadingHook';

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Products = (props) => {
  const [open,setOpen] = useState(false)
  const [productData, setProductData] = useState({})

  const currentView = useSelector(currentViewValue);
  const selectorData = useSelector(filteredProducts);
  const noRes = useSelector(noSearchRes);
  const authStatus = useSelector(authenticateStatus)
  const role = useSelector(userRole);
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
      {
        selectorData.map((product,index) => {//Esta seria la tarjeta de cada producto, se puede sacar a otro archivo
          return <div key={index} className={`productView ${currentView === 'list' ? 'productList' : 'productGrid'}`} onClick={() => handleOpen(index)}>
            <div className='productImgContainer'>
              <img className='productImg' src={product.img[0].startsWith('https') ? product.img[0] : require(`../assets/${product.img[0]}`)} alt={`prod${index}`}/>
            </div>
            <div className='productInfo'>
              <p key={`${index}-prodName`} title={product.name}>{product.name}</p>
              <p>{product.quantity > 0 ? 'Unidades disponibles' : 'No disponible temporalmente, consultar por el producto'}</p>
              <p>$ {product.price}</p>{/*temporal, revisar el $ y pensar alguna manera de hacer esto adaptable por si hay que incluir tipo de moneda  */}
              <p>{product.colors.length} colores</p>
            </div>
            {
              authStatus && role === allowedEditingRole ?
                <Link className='editIconContainer' to={'/editar-producto'} state={product} title='Editar Producto'>
                  <MdEditSquare className='editBtn'/>
                </Link>
              : null
            }
          </div >
        })
      }
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