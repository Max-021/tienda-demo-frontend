import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { changeView, showCurrentState } from '../../redux/searchBarSlice';
import { searchProduct } from '../../redux/ProductsSlice';

import InputBase from '@mui/material/InputBase';

import { FiFilter } from "react-icons/fi";
import { MdGridView } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const vertAlign = {
    verticalAlign: 'middle',
}

const SearchBar = () => {
    const dispatch = useDispatch();
    const [searchBarText, setSearchBarText] = useState('')
    const handleChange = (e) => {
        setSearchBarText(e.target.value)
    }
    const submitSearch = (e) => {
        e.preventDefault();
        dispatch(searchProduct(searchBarText))
    }
    return (
        <div className='searchBarContainer'>
            <form className='searchBar' onSubmit={submitSearch}>
                <InputBase
                sx={{width:'100%'}}
                placeholder="Buscar..."
                inputProps={{ 'aria-label': 'barra de busqueda' }}
                endAdornment={<IoSearch style={vertAlign}/>}
                fullWidth
                onChange={handleChange}
                value={searchBarText}
                />
            </form>
            <div className='searchBarExtras'>
                <MdGridView onClick={() => dispatch(changeView())}/>
                <FiFilter onClick={() => dispatch(showCurrentState())}/>
            </div>
        </div>
)
}

export default SearchBar