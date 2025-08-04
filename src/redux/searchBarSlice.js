import { createSlice } from "@reduxjs/toolkit"

const catName = 'category'

export const searchBarSlice = createSlice({
    name:'searchBar',//acá manejo manualmente las categorias, pero las 
    initialState: {
        view: 'list',
        categories: [],
        filterData: {},
    },
    reducers: {
        changeView: state => {
            state.view = state.view === 'list' ? 'grid' : 'list'
        },
        setFilterInfo: (state,action) => {
            const cats = action.payload.docs.find(el => el.name === catName);
            state.categories = cats.values;
            state.filterData = action.payload.docs.reduce((opts, el) => {
                if(el.name !== catName){
                    opts[el.name] = el.values;
                }
                return opts;
            }, {});
        },
    }
})

export const {changeView, setFilterInfo} = searchBarSlice.actions

export const currentViewValue = (state) => state.searchBar.view
export const currentCategories = (state) => state.searchBar.categories
export const filterData = (state) => state.searchBar.filterData

export default searchBarSlice.reducer;