import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeView } from '../../redux/searchBarSlice';
import { searchProduct, activeFilters, filterProducts, cleanArrayFilter, cleanTextFilter } from '../../redux/ProductsSlice';

import InputBase from '@mui/material/InputBase';
import Popover from '@mui/material/Popover';

import { FiFilter } from "react-icons/fi";
import { MdGridView } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import FilterOptions from './FilterOptions';

const vertAlign = {
    verticalAlign: 'middle',
    marginLeft: '16px'
}

const SearchBar = () => {
    const dispatch = useDispatch();
    const setFilters = useSelector(activeFilters)
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
    const cleanFilter = (val) => {
        console.log(val)
        console.log(Array.isArray(val))
        if(Array.isArray(val)) dispatch(cleanArrayFilter(val))
        else dispatch(cleanTextFilter(val))

        dispatch(filterProducts())
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
                type='search'
                />
            </form>
            <div className='searchBarFilterInfo'>
                {setFilters.minPrice && setFilters.minPrice > 0 ? <p className='activeFilter'>Min: {setFilters.minPrice}<button type='button' onClick={()=>cleanFilter('minPrice')}><IoMdClose/></button></p> : null}
                {setFilters.maxPrice && <p className='activeFilter'>Max: {setFilters.maxPrice}<button type='button' onClick={()=>cleanFilter('maxPrice')}><IoMdClose/></button></p>}
                {setFilters.colorFilter.length > 0 &&
                    setFilters.colorFilter.map((col, index) => {
                        return <p className='activeFilter' key={index}>{col}<button type='button' onClick={()=>cleanFilter([col,'color'])}><IoMdClose/></button></p>
                    })
                }
            </div>
            <div className='searchBarExtras'>
                <FiFilter title='Filtros' onClick={openPopover}/>
                <Popover className='popoverFilter'
                    id={popoverId}
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{vertical: 'center', horizontal: 'left'}}
                    transformOrigin={{vertical: 'top', horizontal:'right'}}
                    disableScrollLock={true}
                >
                    <FilterOptions/>
                </Popover>
                <MdGridView title='Cambiar vista' onClick={() => dispatch(changeView())}/>
            </div>
        </div>
)
}

export default SearchBar