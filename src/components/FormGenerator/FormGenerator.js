import React from 'react'

import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {Button} from '@mui/material';

//hacer que categorias sea un select en el que solo puedas ponerle un valor
//que colores sea un select con multiples valores posibles

const FormGenerator = ({modelKey,enumValues = null, handleChange, currentNewProdField}) => {


  const renderSwitch = (keyModel) => {//esto se podria factorizar para que el textfield solo aparezca una vez y antes del return le cargo lo que corresponda
    const modelInputInfo = {
      isRequired: false,dataType: 'text',isMultiline: false, isDisabled: false,labelName:'',
    }
    switch (keyModel) {
      case 'name':
      case 'username':
        modelInputInfo.isRequired=true;
        modelInputInfo.labelName = 'Nombre'
      break;
      case 'mail':
        modelInputInfo.isRequired=true;
        modelInputInfo.dataType='mail';
        modelInputInfo.labelName='Email'
      break;
      case 'userRole':
        modelInputInfo.isDisabled=true;
        modelInputInfo.labelName='Rol'
      break;
      case 'descr':
        modelInputInfo.isRequired=true;
        modelInputInfo.isMultiline=true;
        modelInputInfo.labelName='Descripción'
      break;
      case 'price':
        modelInputInfo.isRequired=true;
        modelInputInfo.dataType='number'
        modelInputInfo.labelName='Precio'
      break;
      case 'quantity':
        modelInputInfo.isRequired=true;
        modelInputInfo.dataType='number'
        modelInputInfo.labelName='Cantidad'
      break;
      case 'category':
        return (
          <FormControl fullWidth>
            <InputLabel id={`${keyModel}-select`}>Categoria</InputLabel>
            <Select sx={{minWidth:220}} name={`${keyModel}`}labelId={`${keyModel}-select`} id={`select-${keyModel}`} value={currentNewProdField} onChange={handleChange} label={`Categoría`} variant='filled'>
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
            <InputLabel id={`${keyModel}-select`}>Color</InputLabel>
            <Select sx={{minWidth:220}} name={`${keyModel}`} labelId={`${keyModel}-select`} id={`select-${keyModel}`} value={currentNewProdField} onChange={handleChange} label={`Colores`} variant='filled'>
              {enumValues ? enumValues.map((el, index) => {
                return <MenuItem key={index} value={enumValues[index]}>{el}</MenuItem>
              }) : null}
            </Select>
          </FormControl>
        )
      break;
      case 'img':
        return (<>
          <p>Img:</p>
          <Button variant='outlined'>Agregar</Button>
        </>)
      break;
      default:
        return <div>No field yet for: {modelKey}</div>
      break;
    }

    return <FormControl>
      <TextField sx={{minWidth:220}}
            required={modelInputInfo.isRequired} label={`${modelInputInfo.labelName}`} value={currentNewProdField} onChange={handleChange} 
            name={`${keyModel}`} id={`${keyModel}-input`}type={modelInputInfo.dataType}//valores basicos
            multiline={modelInputInfo.isMultiline} minRows={2} maxRows={8} disabled={modelInputInfo.isDisabled} variant='filled'/>{/*valores especiales si se cumplen ciertas condiciones*/}
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