import React from 'react'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputBase from '@mui/material/InputBase';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';


import { FiFilter } from "react-icons/fi";
import { MdGridView } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const vertAlign = {
    verticalAlign: 'middle',
}

const SearchBar = () => {
  return (
    <div className='searchBarContainer'>
        <div className='searchBar'>
            <InputBase
            sx={{width:'100%'}}
            placeholder="Buscar..."
            inputProps={{ 'aria-label': 'barra de busqueda' }}
            endAdornment={<IoSearch style={vertAlign}/>}
            fullWidth
            />
        </div>
        <div className='searchBarExtras'>
            <MdGridView/>
            <FiFilter/>
        </div>
    </div>
)
}

export default SearchBar