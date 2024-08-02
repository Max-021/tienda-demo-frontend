import React from 'react'
import { useSelector } from 'react-redux';
import { BsCart2 } from "react-icons/bs";
import { useDispatch } from 'react-redux';

import { onCategorySelected, activeCategory } from '../../redux/ProductsSlice';

import { categories } from '../../data/categories'

const Menu = () => {
  const dispatch = useDispatch();
  const currentCat = useSelector(activeCategory)

  return (
    <div className='menu'>
        <ul className='categories'>
          {categories.map((cat, index) => {
            return <li className={`${ currentCat === cat ? 'activeCategory' : ''}`} key={index} onClick={() => dispatch(onCategorySelected(cat))} >{cat}</li>
          })}
        </ul>
        <div>
          <a href='#'><BsCart2/></a>
        </div>
    </div>
  )
}

export default Menu