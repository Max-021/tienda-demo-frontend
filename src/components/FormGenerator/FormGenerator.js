import React from 'react'

import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

//hacer que categorias sea un select en el que solo puedas ponerle un valor
//que colores sea un select con multiples valores posibles

const FormGenerator = ({modelKey,enumValues, handleChange, currentNewProdField}) => {


  const renderSwitch = (keyModel) => {//esto se podria factorizar para que el textfield solo aparezca una vez y antes del return le cargo lo que corresponda
    const modelInputInfo = {
      isRequired: false,dataType: 'text',isMultiline: false,
    }
    switch (keyModel) {
      case 'name':
        modelInputInfo.isRequired=true;
      break;
      case 'descr':
        modelInputInfo.isRequired=true;
        modelInputInfo.isMultiline=true;
      break;
      case 'price':
      case 'quantity':
        modelInputInfo.isRequired=true;
        modelInputInfo.dataType='number'
      break;
      case 'category':
        return (
          <FormControl>
            <InputLabel id={`${keyModel}-select`} />
            <Select name={`${keyModel}`}labelId={`${keyModel}-select`} id={`select-${keyModel}`} value={currentNewProdField} onChange={handleChange} label={`${keyModel}`}>
              {enumValues ? enumValues.map((el, index) => {
                return <MenuItem key={index} value={enumValues[index]}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        )
        break;
      case 'colors':
        return (
          <FormControl>
            <InputLabel id={`${keyModel}-select`} />
            <Select name={`${keyModel}`}labelId={`${keyModel}-select`} id={`select-${keyModel}`} defaultValue={''} onChange={handleChange} label={`${keyModel}`}>
              {enumValues ? enumValues.map((el, index) => {
                return <MenuItem key={index} value={enumValues[index]}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        )
      break;
      default:
        return <div>No field yet for: {modelKey}</div>
      break;
    }

    return <FormControl>
      <TextField 
            required={modelInputInfo.isRequired} label={`${keyModel}-label`} value={currentNewProdField} onChange={handleChange} 
            name={`${keyModel}`} id={`${keyModel}-input`}type={modelInputInfo.dataType}//valores basicos
            multiline={modelInputInfo.isMultiline} minRows={2} maxRows={8}/>{/*valores especiales si se cumplen ciertas condiciones*/}
            {/* //agregar mas y tener en cuenta los selects y los campos que sean arrays, tambien revisar como hacer con el campo img, y dejar */}
            {/* //algo default para posibles nuevos campos */}
    </FormControl>
  }

  return (
    <>
      {renderSwitch(modelKey)}
    </>
  )
}

export default FormGenerator