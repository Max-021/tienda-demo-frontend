import React from 'react'
import _, { forIn } from 'lodash'

import { productTemplate } from '../../data/products'

const toBeExcluded = ['name', 'category','quantity','img']

const FilterOptions = () => {
    var productKeys = Object.keys(productTemplate)
    var filteredProducts = _.remove(productKeys, function(key) {
        for (let index = 0; index < toBeExcluded.length; index++) {
            if(key === toBeExcluded[index]) {
                return key
            }
        }
    })
  return (
    <div className='filterOptions'>
        {productKeys.map((prod,index) => {
            return <div key={index}>
                {productTemplate[prod] instanceof Array ?
                    productTemplate.colors.map((el,ind) => {
                        return <div key={ind}>{el}</div>
                    })
                :
                    <div>{prod}</div>
                 }
            </div>;
        })}
    </div>
  )
}

export default FilterOptions