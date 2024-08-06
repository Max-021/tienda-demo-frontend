import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { changeView } from '../../redux/searchBarSlice';
import { searchProduct } from '../../redux/ProductsSlice';

import InputBase from '@mui/material/InputBase';
import Popover from '@mui/material/Popover';

import { FiFilter } from "react-icons/fi";
import { MdGridView } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

import FilterOptions from './FilterOptions';

const vertAlign = {
    verticalAlign: 'middle',
}

const SearchBar = () => {
    const dispatch = useDispatch();
    const [searchBarText, setSearchBarText] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const handleChange = (e) => {
        setSearchBarText(e.target.value)
    }
    const submitSearch = (e) => {
        e.preventDefault();
        dispatch(searchProduct(searchBarText))
    }
    const openPopover = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const closePopover = () => {
        setAnchorEl(null)
    }
    const isPopoverOpen = Boolean(anchorEl)
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined

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
                <FiFilter onClick={openPopover}/>
                <Popover className='popoverFilter'
                    id={popoverId}
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{vertical: 'middle', horizontal: 'left'}}
                    transformOrigin={{vertical: 'top', horizontal:'right'}}
                    disableScrollLock={true}
                >
                    <FilterOptions/>
                </Popover>
            </div>
        </div>
)
}

export default SearchBar