import { configureStore } from "@reduxjs/toolkit";
import SearchBarReducer from './searchBarSlice';
import productsReducer from './ProductsSlice';
import cartReducer from './CartSlice';
import userReducer from './UserSlice';

//store
export default configureStore({
    reducer: {
        searchBar: SearchBarReducer,
        products: productsReducer,
        cart: cartReducer,
        user: userReducer,
    }
})