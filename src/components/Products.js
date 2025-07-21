import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';
import { fetchActiveProducts } from '../redux/ProductsSlice';
import { currentViewValue } from '../redux/searchBarSlice';

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
  const dispatch = useDispatch();
  const currentView = useSelector(currentViewValue);
  const [open,setOpen] = useState(false);
  const [productData, setProductData] = useState({});
  const {filteredProducts, totalCount, loading, error, noSearchRes, page, limit} = useSelector((s) => s.products)

  const handleOpen = (prodInd) =>{
    setOpen(true)
    setProductData({ ...filteredProducts[prodInd] })
  }

  useEffect(() => {
    dispatch(fetchActiveProducts({page: 1, limit: limit}));
  }, [dispatch, limit])

  const loadMore = useCallback(() => {
    if(filteredProducts.length < totalCount && loading !== 'pending'){
      dispatch(fetchActiveProducts({page: page + 1, limit: limit}))
    }
  }, [dispatch, filteredProducts.length, totalCount, page, limit, loading])

  if(loading === 'pending' && page === 0) return <LoadingSpinner containerClass='productsLayout' spinnerInfo='bigSpinner'/>
  if(error !== null)                      return <LoadingError containerClass='productsLayout'/>
  if(noSearchRes)                         return <div className='productsLayout'>
                                                    <div>La búsqueda no arrojó resultados. CAMBIAR ESTE TEXTO! temporal</div>
                                                  </div>

  return (
    <div className='productsLayoutList'>
      {currentView === 'list' ? 
        <Virtuoso
          useWindowScroll
          style={{width:'100%',}}
          totalCount={totalCount}
          data={filteredProducts}
          endReached={loadMore}
          overscan={200}
          itemContent={(index, product) => (
            <div className='virtItem'>
              <ProductPreview ind={index} product={product} handleOpen={handleOpen}/>
            </div>
          )}
          components={{
            Footer: () => {
              if(filteredProducts.length < totalCount) return <div style={{marginTop:'12px', textAlign:'center'}}><LoadingSpinner spinnerInfo='mediumSpinner'/></div>
              return (
                  <p style={{textAlign:'center', margin: '1rem 0'}}>- No hay más productos -</p>
              )
            }
          }}
        />
      :
        <VirtuosoGrid
          useWindowScroll
          style={{width: '100%'}}
          totalCount={totalCount}
          data={filteredProducts}
          endReached={loadMore}
          overscan={200}
          listClassName='productsGridList'
          itemClassName='productsGridItem'
          itemContent={(index, product) => (
            <ProductPreview ind={index} product={product} handleOpen={handleOpen}/>
          )}
          components={{
            Footer: () => {
              if(filteredProducts.length < totalCount) return <div style={{marginTop:'12px', textAlign:'center'}}><LoadingSpinner spinnerInfo='mediumSpinner'/></div>
              return (
                <div className='virtGridFooter'>
                  <p style={{textAlign:'center', margin: '1rem 0'}}>- No hay más productos -</p>
                </div>
              )              
            }
          }}
        />
      }
      <Dialog
        fullWidth maxWidth='90%' open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}
        PaperProps={{
          sx:{
            boxSizing: 'border-box', transition: '0.7s all',
            maxHeight:'90vh',
            height: {lg:'auto',md: 'fit-content', },
            width: {md: '90%',sm: 'auto', xs: 'fit-content'},
            // width: {md: '90%',sm: 'fit-content', xs: 'fit-content'},
          }
        }}
      >
        <GrFormClose className='closeBtn' onClick={() => setOpen(false)}/>
        <ProductCard {...productData}/>
      </Dialog>
    </div>
  )
}

export default Products