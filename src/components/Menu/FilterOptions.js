import React, {useEffect, useState} from 'react'

import { colorsList } from '../../redux/searchBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, empyFilters, filterProducts } from '../../redux/ProductsSlice';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';


const checkId = 'colorCheckId-'

const FilterOptions = () => {
    const dispatch = useDispatch();
    const totalColors = useSelector(colorsList);
    const [filterOptions, setFilterOptions] = useState({priceMin:'', priceMax:'', colors:[]})
    const [checkStatus, setCheckStatus] = useState(totalColors.map(()=> false));

    const rows = [];
    for (let i = 0; i < totalColors.length; i += 2) {
      rows.push(totalColors.slice(i, i + 2));
    }

    
    const handleChange = (e) => {//para los tipo text field
        e.preventDefault();
        setFilterOptions({...filterOptions, [e.target.name]: e.target.value})
    }
    const useCheckValue = (e) => {//para los checkbox
        const {checked, value} = e.target;
        setFilterOptions((prev) => ({
            ...prev,
            colors: checked
            ? [...prev.colors, value]
            : prev.colors.filter((col) => col !== value)
        }))
        const checkInd = totalColors.indexOf(value);
        if (checkInd !== -1) {
            // Crea una copia del array para no mutar el estado directamente
            const newCheckStatus = [...checkStatus];
            newCheckStatus[checkInd] = checked;
            setCheckStatus(newCheckStatus);
        }
    }

    const resetFilter = () => {
        setFilterOptions({priceMin:'', priceMax:'', colors:[]})
        setCheckStatus(totalColors.map(() => false));
    }

    const applyFilter = (e) => {
        e.preventDefault();
        console.log('filterset')

        //chequear si los campos estan vacios,
        if(filterOptions.colors.length === 0 && filterOptions.priceMax === '' && filterOptions.priceMin === ''){
            dispatch(empyFilters());
        }else{
            dispatch(setFilters(filterOptions));
            dispatch(filterProducts());
        }
    }

  return (
    <Box component={'form'} className='filterOptions' onSubmit={applyFilter}>
        <p className='filterTitle'>Precio</p>
        <Box sx={{display: 'flex', width: '50%', marginTop: '8px', gap: '8px'}}>
            <TextField size='small' type='number' label='Min' name='priceMin' onChange={handleChange} value={filterOptions.priceMin} sx={{ }}/>
            <TextField size='small' type='number' label='Max' name='priceMax' onChange={handleChange} value={filterOptions.priceMax} sx={{ width: "fit-content" }}/>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <p className='filterTitle'>Colores</p>
            <FormGroup
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, auto)",
                    gap: '5px', padding: '8px'
                }}
                >
                {Array.isArray(totalColors) &&
                    totalColors.map((color, index) => (
                    <FormControlLabel
                        key={`${index}-${color}`}
                        control={<Checkbox sx={{padding:'5px'}} id={`${checkId}${index}`} value={color} size='small' onChange={useCheckValue} checked={checkStatus[index]}/>}
                        label={color}
                        sx={{ justifySelf: "start" }}
                    />
                ))}
            </FormGroup>
        </Box>
        <Box sx={{marginTop: '12px',display:'flex', gap:'12px'}}>
                <Button type='submit' variant='contained'>Aplicar</Button>
                <Button type='button' variant='outlined' onClick={resetFilter}>Borrar</Button>
        </Box>
    </Box>
  )
}

export default FilterOptions