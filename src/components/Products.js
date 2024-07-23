import React, {useState} from 'react'

import { products } from '../data/products'

const Products = () => {

  const [productView, setProductView] = useState('list')

  return (
    <div className='productsLayout'>
        {products.map((product,index) => {
          return <>
            <div key={index} className={productView === 'list' ? 'productList' : 'productGrid'}>
              {/* falta la imagen */}
              <p>Nombre:{product.name}</p>
              <p>Categoría:{product.category}</p>
              <p>Colores:{product.colors}</p>
              <p>Precio:{product.price}</p>
              {/* en stock agregar alguna validación por si no hay y algún condicional para decir unidad o unidades según lo que haya */}
              <p>Disponible:{product.quantity}</p>
            </div>
            {/* TEMPORAL */}
            <div className='divider'></div>
          </>
        })}
    </div>
  )
}

export default Products