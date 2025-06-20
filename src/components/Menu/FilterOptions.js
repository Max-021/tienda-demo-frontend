import React, {useEffect, useState} from 'react'

import { filterData } from '../../redux/searchBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, empyFilters, filterProducts } from '../../redux/ProductsSlice';
import { FILTER_LABELS } from '../../data/labels';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const FilterOptions = () => {
    const dispatch = useDispatch();
    const filterInfo = useSelector(filterData);
    const [filterOptions, setFilterOptions] = useState({priceMin:'', priceMax:''})
    const [checkStatus, setCheckStatus] = useState({});

    const emptyFilter = (data) => Object.keys(data).reduce((acc, key) => {
        acc[key] = [];
        return acc
    }, {});
    const initCheckStatus = (data) => Object.fromEntries(Object.entries(data).map(([key, values]) => [key, Array(values.length).fill(false)]));

    useEffect(() => {
        setFilterOptions(prev => ({...prev,...emptyFilter(filterInfo)}));
        setCheckStatus(initCheckStatus(filterInfo))
    }, [filterInfo]);
    
    const handleChange = (e) => setFilterOptions(prev => ({...prev, [e.target.name]: e.target.value}));
    const handleCheckValue = (e, filterName, idx) => {//para los checkbox
        const {checked, value} = e.target;
        setFilterOptions((prev) => ({
            ...prev,
            [filterName]: checked
            ? [...prev[filterName], value]
            : prev[filterName].filter((col) => col !== value)
        }));

        setCheckStatus(prev => ({ ...prev, [filterName]: prev[filterName].map((st, i) => i === idx ? checked : st)}));
    }

    const resetFilter = () => {
        setFilterOptions({priceMin:'', priceMax:'',...emptyFilter(filterInfo)});
        setCheckStatus(initCheckStatus(filterInfo));
    }

    const applyFilter = (e) => {
        e.preventDefault();
        console.log('filterset')
        const noFilters = filterOptions.priceMin === '' && filterOptions.priceMax === '' && Object.keys(filterInfo).every(key => filterOptions[key].length === 0);

        //chequear si los campos estan vacios,
        if(noFilters){
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
        {Object.keys(filterInfo).map((el, index) => {
            return <Box key={`filter-${index}`} sx={{display: 'flex', flexDirection: 'column'}}>
                <p className='filterTitle'>{FILTER_LABELS[el] || el} </p>
                <FormGroup
                    sx={{
                        display: "grid", gridTemplateColumns: "repeat(3, auto)",
                        gap: '5px', padding: '8px'
                    }}
                    >
                    {filterInfo[el].map((color, ind) => (
                        <FormControlLabel
                            key={`${ind}-${color}`}
                            control={<Checkbox sx={{padding:'5px'}} id={`${el}-check-${ind}`} value={color} size='small' onChange={e => handleCheckValue(e, el, ind)} checked={checkStatus[el]?.[ind] || false}/>}
                            label={color}
                            sx={{ justifySelf: "start" }}
                        />
                    ))}
                </FormGroup>
            </Box>
        })}
        <Box sx={{marginTop: '12px',display:'flex', gap:'12px'}}>
                <Button type='submit' variant='contained'>Aplicar</Button>
                <Button type='button' variant='outlined' onClick={resetFilter}>Borrar</Button>
        </Box>
    </Box>
  )
}

export default FilterOptions