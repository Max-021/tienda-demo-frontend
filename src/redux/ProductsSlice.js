import { createSlice } from "@reduxjs/toolkit";

//esto es temporal, cuando termine todo veo como hacer un ajax a la base de datos posta
import { products } from "../data/products";

const initialState = {
    activeCat: '',
    searchText: '',
    filterSelection: [],
    products: products,//cambiar acá despues por la base de datos posta, temporal
    filteredProducts: products,

}

export const productsSlice = createSlice({
    name:'products',
    initialState,
    reducers: {
        onCategorySelected: (state, action) => {
            state.activeCat = action.payload
            state.filteredProducts = state.products.filter((product) => product.category === action.payload)
            if(state.filteredProducts.length === 0) {
                state.filteredProducts = state.products
            }
        },
    }
})

export const {onCategorySelected} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat

export default productsSlice.reducer;