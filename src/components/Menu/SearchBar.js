import React, { useState, useEffect } from 'react'
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
const vertAlign = { verticalAlign: 'middle', marginLeft: '16px' }

const SearchBar = () => {
    const dispatch = useDispatch();
    const storeFilters = useSelector(activeFilters)
    const [searchBarText, setSearchBarText] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const isPopoverOpen = Boolean(anchorEl);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;

    const [showAnimation, setShowAnimation] = useState(false);
    const [displayFilters, setDisplayFilters] = useState(storeFilters);

    useEffect(() => {
        const hayFiltros = storeFilters.minPrice || storeFilters.maxPrice || storeFilters.colorFilter.length > 0;

        if (hayFiltros) {
            setDisplayFilters(storeFilters);
            setShowAnimation(true);
        } else {
            setShowAnimation(false);
            const timeout = setTimeout(() => {
                setDisplayFilters({ minPrice: 0, maxPrice: 0, colorFilter: [] });
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [storeFilters]);

    const handleChange = (e) => setSearchBarText(e.target.value);
    const openPopover = (event) => setAnchorEl(event.currentTarget);
    const closePopover = () => setAnchorEl(null);

    const cleanFilter = (val) => {
        if (Array.isArray(val)) dispatch(cleanArrayFilter(val));
        else dispatch(cleanTextFilter(val));
        dispatch(filterProducts());
    };

    const submitSearch = (e) => {
        e.preventDefault();
        dispatch(searchProduct(searchBarText));
    };

    return (
        <>
            <div className='searchBarContainer'>
                <form className='searchBar' onSubmit={submitSearch}>
                    <InputBase sx={{ width: '100%' }} placeholder="Buscar..."
                        inputProps={{ 'aria-label': 'barra de busqueda' }} endAdornment={<IoSearch style={vertAlign} />}
                        fullWidth onChange={handleChange} value={searchBarText} type='search'
                    />
                </form>
                <div className='searchBarExtras'>
                    <FiFilter title='Filtros' onClick={openPopover} />
                    <Popover className='popoverFilter' id={popoverId} open={isPopoverOpen}
                        anchorEl={anchorEl} onClose={closePopover} anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }} disableScrollLock={true}
                    >
                        <FilterOptions />
                    </Popover>
                    <MdGridView title='Cambiar vista' onClick={() => dispatch(changeView())} />
                </div>
            </div>
            <div className={`searchBarFilterInfo ${showAnimation ? 'active' : ''}`}>
                {(displayFilters.minPrice || displayFilters.maxPrice || displayFilters.colorFilter.length > 0) &&
                    <p style={{ margin: 0, padding: 0 }}>Filtros activos:</p>
                }
                {displayFilters.minPrice && displayFilters.minPrice > 0 && (
                    <p className='activeFilter'>
                        Min: {displayFilters.minPrice}
                        <button type='button' onClick={() => cleanFilter('minPrice')}>
                            <IoMdClose />
                        </button>
                    </p>
                )}
                {displayFilters.maxPrice && (
                    <p className='activeFilter'>
                        Max: {displayFilters.maxPrice}
                        <button type='button' onClick={() => cleanFilter('maxPrice')}>
                            <IoMdClose />
                        </button>
                    </p>
                )}
                {displayFilters.colorFilter.length > 0 &&
                    displayFilters.colorFilter.map((col, index) => (
                        <p className='activeFilter' key={index}>
                            {col}
                            <button type='button' onClick={() => cleanFilter([col, 'color'])}>
                                <IoMdClose />
                            </button>
                        </p>
                    ))
                }
            </div>
        </>
    );
}

export default SearchBar;