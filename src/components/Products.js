import React, {useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { currentViewValue } from '../redux/searchBarSlice';
import { filteredProducts, noSearchRes, getProductsList } from '../redux/ProductsSlice';
import { authenticateStatus, checkLogin } from '../redux/UserSlice';
import { getAllProducts } from '../auxiliaries/axiosHandlers';

import { GrFormClose } from "react-icons/gr";
import { MdEditSquare } from "react-icons/md";

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';


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
  const dispatch = useDispatch();

  useEffect(()=> {
    const fetchData = async () => {
      const catalogo = await getAllProducts();
      dispatch(getProductsList(catalogo));
    }
    fetchData();
    // checkSession();//temporal, ver cuando lo saco porque el otro está mejor
    // dispatch(checkLogin())
    // console.log(authStatus)
  }, []);

  const handleOpen = (prodInd) =>{
    setOpen(true)
    setProductData({
      ...selectorData[prodInd]
    })
  }

  return (
    <div className='productsLayout'>
      {!noRes ? 
        selectorData.map((product,index) => {//Esta seria la tarjeta de cada producto, se puede sacar a otro archivo
          return <div key={index} className={`productView ${currentView === 'list' ? 'productList' : 'productGrid'}`} onClick={() => handleOpen(index)}>
              <div className='productImgContainer'>
                <img className='productImg' src={product.img[0].startsWith('https') ? product.img[0] : require(`../assets/${product.img[0]}`)} alt={`prod${index}`}/>
              </div>
              <div className='productInfo'>
                <p> {product.name}</p>
                <p>{product.quantity > 0 ? 'Unidades disponibles' : 'No disponible temporalmente, consultar por el producto'}</p>
                <p>$ {product.price}</p>{/*temporal, revisar el $ y pensar alguna manera de hacer esto adaptable por si hay que incluir tipo de moneda  */}
                <p>{product.colors.length} colores</p>
              </div>
              {
                authStatus ?
                <div className='editIconContainer'>
                  <Link to={'/editar-producto'} state={product}>
                    <MdEditSquare /*size={50}*/ className='editBtn'/>
                  </Link>
                </div>
                : null
              }
          </div >
        })
      : 
       <div>La búsqueda no arrojó resultados. CAMBIAR ESTO! temporal</div>
       }
       {/* chequear tambien el atributo fullwidth si sirve */}
    <Dialog fullWidth maxWidth='90%' open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
      <GrFormClose className='closeBtn' onClick={() => setOpen(false)}/>
      <ProductCard {...productData}/>
    </Dialog>
    </div>
  )
}

export default Products