import { createSlice } from "@reduxjs/toolkit"

export const searchBarSlice = createSlice({
    name:'searchBar',
    initialState: {
        view: 'list'
    },
    reducers: {
        changeView: state => {
            state.view = state.view === 'list' ? 'grid' : 'list'
        },
        showCurrentState: state => {
            console.log(state.view)
        }
    }
})

export const {changeView, showCurrentState} = searchBarSlice.actions

export const currentViewValue = (state) => state.searchBar.view

export default searchBarSlice.reducer;