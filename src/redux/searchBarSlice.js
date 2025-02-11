import { createSlice } from "@reduxjs/toolkit"

export const searchBarSlice = createSlice({
    name:'searchBar',
    initialState: {
        view: 'list',
        categories: [],
    },
    reducers: {
        changeView: state => {
            state.view = state.view === 'list' ? 'grid' : 'list'
        },
        showCurrentState: state => {
            console.log(state.view)
        },
        setCategories: (state,action) => {
            console.log("holaaaaa")
            console.log(action.payload)
            state.categories = action.payload
        }

    }
})

export const {changeView, showCurrentState, setCategories} = searchBarSlice.actions

export const currentViewValue = (state) => state.searchBar.view
export const currentCategories = (state) => state.searchBar.categories

export default searchBarSlice.reducer;