import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts } from "../auxiliaries/axios";
import { applyFilters, prepareQuery } from "./reduxAux/filterHelper";

const PAGE_SIZE_DEFAULT = 15;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = { page: 1, limit: PAGE_SIZE_DEFAULT, filters: {}, editorFilters: {} }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = PAGE_SIZE_DEFAULT, filters = {}, editorFilters = {} } = params;

      const queryObj = prepareQuery({ page, limit, filters, editorFilters });

      const res = await getAllProducts(queryObj);
      return { ...res.data, page, limit };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
    activeCat: '',
    searchText: '',
    filters: {//aca agregar los filtros segun corresponda
        minPrice: null,
        maxPrice: null,
        colors: [],
    },
    editorFilters: {
        showAll: false,
        showInactive: false,
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
            if(priceMax === 0) priceMax = null;

            if(priceMin === 0 && priceMax === 0){
                priceMin = null;
                priceMax = null;
            } else {
                if(priceMin !== null && priceMax !== null && priceMin > priceMax){
                    [priceMin, priceMax] = [priceMax, priceMin];
                }
            }
            state.filters.minPrice = priceMin;
            state.filters.maxPrice = priceMax;
            Object.entries(action.payload).forEach(([key, val]) => {
                if(key === 'priceMin' || key === 'priceMax') return;
                state.filters[key] = Array.isArray(val) ? val: state.filters[key];
            });

            state.filteredProducts = state.products;
        },
        setEditorFilters: (state, action) => {
            state.editorFilters = {
                ...state.editorFilters,
                ...action.payload
            };
        },
        updateEditorFilter: (state, action) => {
            const { key, value } = action.payload;
            if (key === 'showAll' && value === true) {
                state.editorFilters.showAll = true;
                state.editorFilters.showInactive = false;
                return;
            }
            if (key === 'showInactive' && value === true) {
                state.editorFilters.showInactive = true;
                state.editorFilters.showAll = false;
                return;
            }
            state.editorFilters[key] = value;
        },
        resetEditorFilters: (state) => {
            Object.keys(state.editorFilters).forEach(k => {
                state.editorFilters[k] = false;
            });
        },
        filterProducts : (state) => {
            state.filteredProducts = applyFilters(state.products, {activeCat: state.activeCat, searchText: state.searchText, filters: state.filters});
            state.noSearchResults = state.filteredProducts.length === 0;
        },
        resetProductsForNewQuery: (state) => {
            state.products = [];
            state.filteredProducts = [];
            state.page = 1;
            state.totalCount = 0;
            state.totalFilteredCount = 0;
            state.noSearchResults = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.error = null;
                state.loading = 'pending';
                const pageArg = action.meta?.arg?.page ?? 1;
                if (pageArg === 1) {
                    state.products = [];
                    state.filteredProducts = [];
                    state.noSearchResults = true;
                }
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const { docs = [], page = 1, limit = PAGE_SIZE_DEFAULT, totalCount = 0, totalFilteredCount = 0 } = action.payload;
                state.loading = 'success';
                if (page === 1) {
                    state.products = docs;
                } else {
                    state.products.push(...docs);
                }
                state.filteredProducts = applyFilters(state.products, { activeCat: state.activeCat, searchText: state.searchText, filters: state.filters, editorFilters: state.editorFilters });
                state.noSearchResults = state.filteredProducts.length === 0;
                state.totalCount = totalCount;
                state.totalFilteredCount = totalFilteredCount;
                state.page = page;
                state.limit = limit;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload;
            });
    }
})

export const {
                onCategorySelected, searchProduct,
                setFilters, filterProducts, emptyFilters,
                cleanArrayFilter, cleanTextFilter,
                setEditorFilters, updateEditorFilter,
                resetEditorFilters, resetProductsForNewQuery,
            } = productsSlice.actions

export const filteredProducts = (state) => state.products.filteredProducts
export const activeCategory = (state) => state.products.activeCat
export const noSearchRes = (state) => state.products.noSearchResults
export const activeFilters = (state) => state.products.filters
export const editorFiltersSelector = (state) => state.products.editorFilters;

export default productsSlice.reducer;