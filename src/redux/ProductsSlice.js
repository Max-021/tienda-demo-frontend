import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeCat: '',
    searchText: '',
    colorFilter: [],
    priceFilter:{min:null, max:null},
    filters: {//aca agregar los filtros segun corresponda
        colorFilter: [],
        minPrice: null,
        maxPrice: null,
    },
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

                if(state.filteredProducts.length === 0) state.filteredProducts = state.products
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
        cleanTextFilter: (state, action) => {
            switch (action.payload) {
                case 'maxPrice':
                    state.filters.maxPrice = null;
                    break;
                case 'minPrice':
                    state.filters.minPrice = null
                    break;
                default:
                    break;
            }
        },
        cleanArrayFilter: (state, action) => {
            const [val, arrayType] = [...action.payload];
            switch (arrayType) {
                case 'color':
                    const updatedArr = state.filters.colorFilter.filter(col => col !== val);
                    state.filters.colorFilter = [...updatedArr]
                    break;
                default:
                    break;
            }
        },
        empyFilters: (state) => {
            state.filters.colorFilter = [];
            state.filters.maxPrice = null;
            state.filters.minPrice = null;
            state.filteredProducts = state.products
        },
        setFilters: (state, action) => {
            let priceMin = Number(action.payload.priceMin);
            let priceMax = Number(action.payload.priceMax);
            if(isNaN(priceMin)) priceMin = null;
            if(isNaN(priceMax)) priceMax = null;
            if(priceMax === 0) priceMax = null;//condicion extra porque number(action.payload.priceMax) lo pone a 0 y puede saltear el isNan

            if(priceMin === 0 && priceMax === 0){
                priceMin = null;
                priceMax = null;
            } else {
                if(priceMin !== null && priceMax !== null && priceMin > priceMax){
                    [priceMin, priceMax] = [priceMax, priceMin];
                }
            }
            // Asignar a los filtros del estado
            state.filters.minPrice = priceMin;
            state.filters.maxPrice = priceMax;
            state.filters.colorFilter = action.payload.colors || [];

            state.filteredProducts = state.products;
        },
        filterProducts : (state) => {

            const result = state.products.filter(prod => {
                const cumpleMax = state.filters.maxPrice !== null ? prod.price <= state.filters.maxPrice : true;
                const cumpleMin = state.filters.minPrice !== null ? prod.price >= state.filters.minPrice : true;
                const cumpleColores = state.filters.colorFilter.length > 0 ? prod.colors.some(color => state.filters.colorFilter.includes(color)) : true;
                return cumpleMax && cumpleMin && cumpleColores;
            });
            state.filteredProducts = result;
        },
    }
})

export const {getProductsList, onCategorySelected, searchProduct, setFilters, filterProducts, empyFilters, cleanArrayFilter, cleanTextFilter} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults
export const activeFilters = (state) => state.products.filters

export default productsSlice.reducer;