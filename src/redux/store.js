import { configureStore, combineReducers,  } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, createTransform, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import SearchBarReducer from './searchBarSlice';
import productsReducer from './ProductsSlice';
import cartReducer from './CartSlice';
import userReducer from './UserSlice';

const productTransform = createTransform(
    (inboundState, key) => ({
        activeCat: inboundState.activeCat,
        filters: inboundState.filters,
        // editorFilters: inboundState.editorFilters,
    }),
    (outboundState, key) => ({
        ...productsReducer(undefined, {type: '@@INIT'}),
        activeCat: outboundState.activeCat,
        filters: outboundState.filters,
        // editorFilters: outboundState.editorFilters,
    }),
    {whitelist: ['products']}
);

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'products'],
    transforms: [productTransform],
    version: 1,
}

const rootReducer = combineReducers({
    searchBar: SearchBarReducer,
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    })
});

export const persistor = persistStore(store);