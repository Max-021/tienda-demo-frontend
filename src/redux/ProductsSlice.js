import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts, getProductsByEditorFilter } from "../auxiliaries/axios";

export const fetchActiveProducts = createAsyncThunk(
    "products/fetchActive",
    async (_, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await getAllProducts();
            console.log(res)
            return res.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const fetchEditorProducts = createAsyncThunk(
    "products/fetchEditor",
    async (editorFilters, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const res = await getProductsByEditorFilter(editorFilters);
            return res.data;
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
            state.noSearchResults = false
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
            state.filteredProducts = state.products
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
            let result = state.products;
            if(state.activeCat)     result = result.filter(p => p.category === state.activeCat);
            if(state.searchText)    result = result.filter(p => p.name.toLowerCase().includes(state.searchText.toLocaleLowerCase()));

            result = result.filter(prod => {
                const cumpleMax = state.filters.maxPrice !== null ? prod.price <= state.filters.maxPrice : true;
                const cumpleMin = state.filters.minPrice !== null ? prod.price >= state.filters.minPrice : true;

                const cumpleArrays = Object.entries(state.filters).every(([k, val]) => {
                    if(k === 'minPrice' || k === 'maxPrice') return true;
                    if(!Array.isArray(val) || val.length === 0) return true;

                    return Array.isArray(prod[k]) ? prod[k].some(item => val.includes(item)) : val.includes(prod[k]);
                });

                return cumpleMax && cumpleMin && cumpleArrays;
            });
            state.filteredProducts = result;
            state.noSearchResults = result.length === 0;
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
                state.loading = "success";
                state.products = action.payload;
                state.filteredProducts = action.payload;
                state.noSearchResults = action.payload.length === 0;
            })
            .addCase(fetchActiveProducts.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
        builder
            .addCase(fetchEditorProducts.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(fetchEditorProducts.fulfilled, (state, action) => {
                state.loading = "success";
                state.filteredProducts = action.payload;
                state.products = action.payload;
                state.noSearchResults = action.payload.length === 0;
            })
            .addCase(fetchEditorProducts.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
    }
})

export const {getProductsList, onCategorySelected, searchProduct, setFilters, filterProducts, empyFilters, cleanArrayFilter, cleanTextFilter} = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults
export const activeFilters = (state) => state.products.filters

export default productsSlice.reducer;