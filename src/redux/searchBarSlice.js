import { createSlice } from "@reduxjs/toolkit"

const catName = 'categories'

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
        showCurrentState: state => {
            console.log(state.view)
        },
        setFilterInfo: (state,action) => {
            console.log("holaaaaa")
            console.log(action.payload)

            const cats = action.payload.find(el => el.name === catName);
            state.categories = cats.values;
            state.filterData = action.payload.reduce((opts, el) => {
                if(el.name !== catName){
                    opts[el.name] = el.values;
                }
                return opts;
            }, {});
        },
    }
})

export const {changeView, showCurrentState, setFilterInfo} = searchBarSlice.actions

export const currentViewValue = (state) => state.searchBar.view
export const currentCategories = (state) => state.searchBar.categories
export const filterData = (state) => state.searchBar.filterData

export default searchBarSlice.reducer;