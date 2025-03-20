import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeCat: '',
    searchText: '',
    colorFilter: [],
    priceFilter:{min:null, max:null},
    products: [],
    filteredProducts: [],
    noSearchResults: true,
}

export const productsSlice = createSlice({
    name:'products',
    initialState,
    reducers: {
        getProductsList: (state,action) => {
            state.noSearchResults=false;
            state.products = action.payload;
            state.filteredProducts = state.products;
        },
        onCategorySelected: (state, action) => {
            state.noSearchRes = false
            if(state.activeCat === action.payload){
                state.activeCat = '';
                state.filteredProducts = state.products;
            }else{
                state.activeCat = action.payload;
                state.filteredProducts = state.products.filter((product) => product.category === action.payload)
                if(state.filteredProducts.length === 0) {
                    state.filteredProducts = state.products
                }
            }
        },
        searchProduct: (state,action) => {
            if(action.payload !== '') {
                state.searchText = action.payload;
                //temporal, revisar que si se hacen dos busquedas seguidas se busca sobre el filtro de la anterior busqueda
                //es importante que cuando se haga la busqueda se tenga en cuenta volver a productos en general pero respetando los otros filtros
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
        },
        empyFilters: (state) => {
            state.colorFilter = [];
            state.priceFilter.max = null;
            state.priceFilter.min = null;
            state.filteredProducts = state.products
        },
        setFilters: (state, action) => {
            let priceMin = Number(action.payload.priceMin);
            let priceMax = Number(action.payload.priceMax);
            console.log(action.payload)

            //asignaciones con verificaciones
            if(priceMax === 0 && priceMin === 0){
                priceMax = null;
                priceMin = null;
            }else {   
                if (priceMin > priceMax) {
                    console.log('Está al revés');
                    state.priceFilter.max = priceMin;
                    state.priceFilter.min = priceMax;
                } else {
                    state.priceFilter.max = priceMax;
                    state.priceFilter.min = priceMin;
                }
            }
            state.colorFilter = action.payload.colors;
            state.filteredProducts = state.products;

            const compareLength = () => state.products.length === state.filteredProducts.length

            //configurar filtro por precios
            if(state.priceFilter.max !== null) {
                if(compareLength()) state.filteredProducts = state.products.filter(prod => prod.price < state.priceFilter.max)
                else state.filteredProducts = state.filteredProducts.filter(prod => prod.price < state.priceFilter.max)
            }
            if(state.priceFilter.min !== null) {
                if(compareLength()) state.filteredProducts = state.products.filter(prod => prod.price > state.priceFilter.min)
                else state.filteredProducts = state.filteredProducts.filter(prod => prod.price > state.priceFilter.min)
            }

            //configurar filtro por colores
            if(state.colorFilter.length > 0){
                if(compareLength()) {
                    state.filteredProducts = state.products.filter(prod => {
                        return prod.colors.some(color => state.colorFilter.includes(color));
                    })
                }
            }
        },
    }
})

export const {getProductsList, onCategorySelected, searchProduct, setFilters, empyFilters} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults
export const colorsFilter = (state) => state.products.colorFilter
export const pricesFilter = (state) => state.products.priceFilter

export default productsSlice.reducer;