import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsCart2 } from "react-icons/bs";

import { onCategorySelected, activeCategory } from '../../redux/ProductsSlice';
import { totalProducts } from '../../redux/CartSlice';

import { categories } from '../../data/categories'//temporal, tengo que armar el menu de categorias desde un axios.get

const Menu = ({showCats}) => {
  const dispatch = useDispatch();
  const currentCat = useSelector(activeCategory)
  let prodsInCart = useSelector(totalProducts)

  return (
    showCats !== '/' ? null : <div className='menu' style={{justifyContent: showCats === '/cart'?'flex-end':null}}>
      {showCats==='/cart'? null :
          <ul className='categories'>
            {categories.map((cat, index) => {
              return <li className={`${ currentCat === cat ? 'activeCategory' : ''}`} key={index} onClick={() => dispatch(onCategorySelected(cat))} >{cat}</li>
            })}
          </ul>
        }
        <div className="cartIcon">
          <Link to='/cart'><BsCart2/>{prodsInCart}</Link>
        </div>
    </div>
  )
}

export default Menu