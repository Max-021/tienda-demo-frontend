import { createSlice } from "@reduxjs/toolkit";

//esto es temporal, cuando termine todo veo como hacer un ajax a la base de datos posta
import { products } from "../data/products";

const initialState = {
    activeCat: '',
    searchText: '',
    colorFilter: [],
    priceFilter:{min:null, max:null},
    products: products,//cambiar acá despues por la base de datos posta, temporal
    filteredProducts: products,
    noSearchResults: false,
}

export const productsSlice = createSlice({
    name:'products',
    initialState,
    reducers: {
        onCategorySelected: (state, action) => {
            state.noSearchRes = false
            state.activeCat = action.payload
            state.filteredProducts = state.products.filter((product) => product.category === action.payload)
            if(state.filteredProducts.length === 0) {
                state.filteredProducts = state.products
            }
        },
        searchProduct: (state,action) => {
            if(action.payload !== '') {
                state.searchText = action.payload;
                state.filteredProducts = state.filteredProducts.filter((product) => product.name.toLowerCase() === action.payload.toLowerCase());
                // LLEVAR A OTRO LADO ESTA FUNCION QUE ES MAS POTENTE. temporal
                // state.filteredProducts = state.filteredProducts.filter((product) => {
                //     for(const prop in product) {
                //         if(product.hasOwnProperty(prop) && product[prop].toLowerCase() === action.payload.toLowerCase())
                //             return product
                //     }
                // })
                console.log(state.filteredProducts)
                state.filteredProducts.length > 0 ? state.noSearchResults = false : state.noSearchResults = true
            } else {
                //temporal, hacer que si no se carga nada en la barra de busqueda siga respetando los otros valores de filtro
                state.noSearchResults = false
                state.filteredProducts = state.products
            }
        }
    }
})

export const {onCategorySelected, searchProduct} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults

export default productsSlice.reducer;