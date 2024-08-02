import React from 'react'
import { useSelector } from 'react-redux';
import { currentViewValue } from '../redux/searchBarSlice';
import { filteredProducts } from '../redux/ProductsSlice';


const Products = (props) => {

  const vista = true;
  const currentView = useSelector(currentViewValue)
  const productList = useSelector(filteredProducts)

  return (
    <div className='productsLayout'>
        {/* {products.map((product,index) => { */}
        {productList.map((product,index) => {
          return <>
            <div key={index} className={`productView ${currentView === 'list' ? 'productList' : 'productGrid'}`}>
              {/* falta la imagen */}
              <p>Nombre:{product.name}</p>
              <p>Categoría:{product.category}</p>
              <p>Colores:{product.colors}</p>
              <p>Precio:{product.price}</p>
              {/* en stock agregar alguna validación por si no hay y algún condicional para decir unidad o unidades según lo que haya */}
              <p>Disponible:{product.quantity}</p>
            </div>
            {/* TEMPORAL */}
            {/* <div className='divider'></div> */}
          </>
        })}
    </div>
  )
}

export default Products