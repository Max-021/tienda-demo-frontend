import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, getProductsByEditorFilter } from "../auxiliaries/axios";
import { applyFilters, prepareQuery } from "./reduxAux/filterHelper";

const PAGE_SIZE_DEFAULT = 8;//temporal, cambiar a 15/20 en produccion

export const fetchActiveProducts = createAsyncThunk(
    "products/fetchActive",
    async (params = {page: 1, limit: PAGE_SIZE_DEFAULT, filters: {}}, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const queryObj = prepareQuery(params)
            console.log('queryobj')
            console.log(queryObj)
            const res = await getAllProducts(queryObj);
            console.log(res)
            return {...res.data};
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const fetchEditorProducts = createAsyncThunk(    
    "products/fetchEditor",
    async (params = {editorFilters: {}, page: 1, limit: PAGE_SIZE_DEFAULT}, { rejectWithValue }) => {
        try {
            const {editorFilters, page, limit} = params
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await getProductsByEditorFilter({...editorFilters, page, limit});
            console.log(res)
            return {...res.data};
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

const initialState = {
    activeCat: '',
    searchText: '',
    filters: {//aca agregar los filtros segun corresponda
        minPrice: null,
        maxPrice: null,
        colors: [],
    },
    products: [],
    filteredProducts: [],
    totalCount: 0,
    totalFilteredCount: 0,
    page: 0,
    limit: PAGE_SIZE_DEFAULT,
    noSearchResults: true,
    loading: "idle",
    error: null,
}

export const productsSlice = createSlice({
    name:'products',
    initialState,
    reducers: {
        onCategorySelected: (state, action) => {
            state.activeCat = state.activeCat === action.payload ? '' : action.payload;
            state.filteredProducts = applyFilters(state.products, {activeCat: state.activeCat, searchText: state.searchText, filters: state.filters});
            state.noSearchResults = state.filteredProducts.length === 0;
        },
        searchProduct: (state,action) => {
                state.searchText = action.payload;
                // LLEVAR A OTRO LADO ESTA FUNCION QUE ES MAS POTENTE. temporal
                // state.filteredProducts = state.filteredProducts.filter((product) => {
                //     for(const prop in product) {
                //         if(product.hasOwnProperty(prop) && product[prop].toLowerCase() === action.payload.toLowerCase())
                //             return product
                //     }
                // })
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
            if(Array.isArray(state.filters[arrayType])) state.filters[arrayType] = state.filters[arrayType].filter(item => item !== val);
        },
        emptyFilters: (state) => {
            state.filters.colors = [];
            state.filters.maxPrice = null;
            state.filters.minPrice = null;
            state.filteredProducts = state.products;
            state.noSearchResults = state.filteredProducts.length === 0;
        },
        setFilters: (state, action) => {
            let priceMin = Number(action.payload.priceMin) || null;
            let priceMax = Number(action.payload.priceMax) || null;
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
            Object.entries(action.payload).forEach(([key, val]) => {
                if(key === 'priceMin' || key === 'priceMax') return;
                state.filters[key] = Array.isArray(val) ? val: state.filters[key];
            });

            state.filteredProducts = state.products;
        },
        filterProducts : (state) => {
            state.filteredProducts = applyFilters(state.products, {activeCat: state.activeCat, searchText: state.searchText, filters: state.filters});
            state.noSearchResults = state.filteredProducts.length === 0;
        },
    },
    extraReducers: (builder) => {
        //para fetchActiveProds
        builder
            .addCase(fetchActiveProducts.pending, (state) => {
                state.error = null;
                state.loading = "pending";
            })
            .addCase(fetchActiveProducts.fulfilled, (state, action) => {
                const {docs, page, limit, totalCount, totalFilteredCount} = action.payload;
                console.log(totalFilteredCount)
                state.loading = "success";
                if(page === 1){
                    state.products = docs;
                } else {
                    state.products.push(...docs);
                }
                state.filteredProducts = applyFilters(state.products, {activeCat: state.activeCat, searchText: state.searchText, filters: state.filters});
                state.noSearchResults = state.filteredProducts.length === 0;
                state.totalCount = totalCount;
                state.totalFilteredCount = totalFilteredCount;
                state.page = page;
                state.limit = limit;
            })
            .addCase(fetchActiveProducts.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
        builder//para el fetch pero con los editor filters
            .addCase(fetchEditorProducts.pending, (state,action) => {
                state.loading = "pending";
                state.error = null;
                if(action.meta.arg.page === 1) state.products = [];
            })
            .addCase(fetchEditorProducts.fulfilled, (state, action) => {
                const {docs, page, limit, totalCount, totalFilteredCount} = action.payload;
                state.loading = "success";
                if(page === 1) {
                    state.products = docs;
                } else {
                    state.products.push(...docs);
                }
                state.filteredProducts = applyFilters(state.products, {activeCat: state.activeCat, searchText: state.searchText, filters: state.filters});
                // state.filteredProducts = state.products;
                state.noSearchResults = state.filteredProducts.length === 0;
                state.totalCount = totalCount;
                state.totalFilteredCount = totalFilteredCount;
                state.page = page;
                state.limit = limit;
            })
            .addCase(fetchEditorProducts.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
    }
})

export const { onCategorySelected, searchProduct, setFilters, filterProducts, emptyFilters, cleanArrayFilter, cleanTextFilter} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults
export const activeFilters = (state) => state.products.filters

export default productsSlice.reducer;