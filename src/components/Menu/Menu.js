import React from 'react'
import { BsCart2 } from "react-icons/bs";

import { categories } from '../../data/categories'

const Menu = () => {
  return (
    <div className='menu'>
        <ul className='categories'>
          {categories.map((cat, index) => {
            return <li key={index}>{cat}</li>
          })}
        </ul>
        <div>
          <a href='#'><BsCart2/></a>
        </div>
    </div>
  )
}

export default Menu