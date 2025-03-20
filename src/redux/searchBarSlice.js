import { createSlice } from "@reduxjs/toolkit"

export const searchBarSlice = createSlice({
    name:'searchBar',
    initialState: {
        view: 'list',
        categories: [],
        colors:[],
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
            state.categories = action.payload.category
            state.colors = action.payload.colors
        }

    }
})

export const {changeView, showCurrentState, setFilterInfo} = searchBarSlice.actions

export const currentViewValue = (state) => state.searchBar.view
export const currentCategories = (state) => state.searchBar.categories
export const colorsList = (state) => state.searchBar.colors

export default searchBarSlice.reducer;