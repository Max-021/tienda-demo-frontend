import React, { useState } from 'react'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { MdOutlineDelete } from "react-icons/md";


const StockManager = ({stock, onStockChange, values, colorModel}) => {
    const [newColor, setNewColor] = useState('');

    const handleStockChange = (e, colorName) => {
        const value = Number(e.target.value) || 0;
        const updatedStock = stock.map(el => el.color === colorName ? {...el, quantity: value} : el);
        onStockChange(prev => ({...prev, stock: [...updatedStock]}))
    }

    const deleteColorFromList = (colorToDelete) => {//aca saco el color de la lista
        const stockCopyUpdated = stock.filter(color => color.color !== colorToDelete);
        onStockChange(prev => ({...prev, stock: [...stockCopyUpdated]}));
    }

    const addColor =(newColor) => {
        if(!newColor) return;
        if(stock.some(c => c.color === newColor)) return;//para que no manden duplicados
        const newItem = createNewColor(newColor);
        onStockChange(prev => ({...prev, stock: [...prev.stock, newItem]}));
        setNewColor('');
    }
    const createNewColor = (color) => {
        const item = {};
        Object.entries(colorModel).forEach(([field, desc]) => {
            if(field === 'color') {
                item[field] = color;
            }else{
                item[field] = desc.type === 'Number' ? 0 : '';
            }
        })
        return item;
    }

    return (
        <div style={{width: '100%'}}>
            <FormControl>
                <Autocomplete name={'Color-autocomp'} disablePortal
                    options={values} 
                    value={null}
                    inputValue={newColor}
                    renderInput={(params) => <TextField variant='filled' {...params} label={`Color`}/>}
                    onChange={(_, v, reason) => {
                        if(!v) {
                            setNewColor('');
                            return;
                        }
                        setNewColor(v);
                        if(reason === 'selectOption' || reason === 'createOption') {
                            addColor(v);
                        }
                    }}
                    onInputChange={(_, inputValue, inputReason) => {
                        if (inputReason === 'clear') {
                        setNewColor('');
                        } else {
                        setNewColor(inputValue);
                        }
                    }}
                />
            </FormControl>
            <div style={{marginTop: '12px'}}>
                {stock.length > 0 && stock.map((color,index) => {
                    return (
                        <div key={`${index}-${color.color}`} className='formColorContainer'>
                            <div className='formColorName'>
                                <button onClick={() => deleteColorFromList(color.color)} title='Eliminar color'><MdOutlineDelete/></button>
                                <p>{color.color}</p>
                            </div>
                            <FormControl>
                                <TextField type='number' value={color.quantity} onChange={(e) => handleStockChange(e, color.color)}/>
                            </FormControl>
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default StockManager