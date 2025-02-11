import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsCart2 } from "react-icons/bs";

import Links from '../reusables/Links';

import { onCategorySelected, activeCategory } from '../../redux/ProductsSlice';
import { totalProducts } from '../../redux/CartSlice';
import { currentCategories, setCategories } from '../../redux/searchBarSlice';

import { categories } from '../../data/categories'//temporal, tengo que armar el menu de categorias desde un axios.get
import { sessionBtns } from '../../data/iconsArray';
import { getCategoriesList } from '../../auxiliaries/axiosHandlers';

const Menu = ({showCats, authSt}) => {
  const dispatch = useDispatch();
  const activeCat = useSelector(activeCategory)
  let prodsInCart = useSelector(totalProducts)
  const currentCats = useSelector(currentCategories)
  

  useEffect(()=>{
    console.log(currentCats)
    const getCategories = async () => {
      const cats = await getCategoriesList()
      if(currentCats.length === 0) {
        dispatch(setCategories(cats))
      }
    }
    getCategories();
  },[currentCats,dispatch])


  return (
    showCats !== '/' ? null : <div className='menu' style={{justifyContent: showCats === '/cart'?'flex-end':null}}>
      {showCats==='/cart'? null :
          <ul className='categories'>
            {currentCats.map((cat, index) => {
              return <li className={`${ activeCat === cat ? 'activeCategory' : ''}`} key={index} onClick={() => dispatch(onCategorySelected(cat))} >{cat}</li>
            })}
          </ul>
        }
        <div className='rightSide'>
          {authSt && <Links linkArray={sessionBtns}/>}
          <Link to='/cart'><BsCart2/>{prodsInCart}</Link>
        </div>
    </div>
  )
}

export default Menu