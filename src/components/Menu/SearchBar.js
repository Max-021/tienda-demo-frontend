import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeView, currentViewValue } from '../../redux/searchBarSlice';
import { activeFilters, filterProducts, cleanArrayFilter, cleanTextFilter } from '../../redux/ProductsSlice';
import { authenticateStatus, userRole } from '../../redux/UserSlice';
import { searchAndFilter } from '../../redux/thunks/productThunks';
import { allowedEditingRole } from '../../data/permissions';

import InputBase from '@mui/material/InputBase';
import Popover from '@mui/material/Popover';

import { FiFilter } from "react-icons/fi";
import { MdGridView, MdViewList } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import FilterOptions from './FilterOptions';
import EditorOptions from './EditorOptions';
const vertAlign = { verticalAlign: 'middle', marginLeft: '16px' }

const SearchBar = () => {
    const dispatch = useDispatch();
    const storeFilters = useSelector(activeFilters);
    const curView = useSelector(currentViewValue);
    const authSt = useSelector(authenticateStatus);
    const userRl = useSelector(userRole);
    const [searchBarText, setSearchBarText] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const isPopoverOpen = Boolean(anchorEl);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;

    const [showAnimation, setShowAnimation] = useState(false);
    const [displayFilters, setDisplayFilters] = useState(storeFilters);

    useEffect(() => {
        const hayFiltrosArray = Object.values(storeFilters).some(val => Array.isArray(val) ? val.length > 0 : false);
        const hayFiltrosTexto = storeFilters.minPrice != null || storeFilters.maxPrice != null;

        if (hayFiltrosArray || hayFiltrosTexto) {
            setDisplayFilters(storeFilters);
            setShowAnimation(true);
        } else {
            setShowAnimation(false);
            const timeout = setTimeout(() => {
                setDisplayFilters({ minPrice: 0, maxPrice: 0, colors: [] });
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
        dispatch(searchAndFilter(searchBarText));
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
                    {curView === 'list'
                        ? <MdViewList title='Cambiar vista' onClick={() => dispatch(changeView())}/>
                        : <MdGridView title='Cambiar vista' onClick={() => dispatch(changeView())}/>
                    }
                </div>
            </div>
            <div className={`searchBarFilterInfo ${showAnimation ? 'active' : ''}`}>
                {(displayFilters.minPrice || displayFilters.maxPrice || displayFilters.colors.length > 0 || Object.values(displayFilters).some(val => Array.isArray(val) && val.length > 0)) 
                    && <p style={{ margin: 0, padding: 0 }}>Filtros activos:</p>
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
                {Object.entries(displayFilters).map(([key,val]) => {
                    if(!Array.isArray(val) || val.length === 0) return null;
                    return val.map((item,index) => (
                        <p className='activeFilter' key={`${key}-${index}`}>
                            {item}
                            <button type='button' onClick={() => cleanFilter([item, key])}>
                                <IoMdClose />
                            </button>
                        </p>
                    ))
                })}
            </div>
            {(authSt &&  allowedEditingRole.includes(userRl)) && <EditorOptions/>}
        </>
    );
}

export default SearchBar;