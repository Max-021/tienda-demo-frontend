import { configureStore } from "@reduxjs/toolkit";
import SearchBarReducer from './searchBarSlice';
import productsReducer from './ProductsSlice';

//store
export default configureStore({
    reducer: {
        searchBar: SearchBarReducer,
        products: productsReducer
    }
})