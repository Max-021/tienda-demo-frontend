import React from 'react'

import RemovedImagesViewer from './RemovedImagesViewer';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import {Button} from '@mui/material';
import { MuiFileInput } from 'mui-file-input';

import ImageUploader from '../reusables/ImageUploader';

//hacer que categorias sea un select en el que solo puedas ponerle un valor
//que colores sea un select con multiples valores posibles

const FormGenerator = ({modelKey,enumValues = null, handleChange, currentNewProdField, existingImages = null, setRemovedImages = null, removedImages = []}) => {

  const handleAutocompleteChange = (event, newValue) => handleChange({ target: { name: modelKey,value: newValue, }});

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
      case 'role':
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
          <FormControl>
            <Autocomplete renderInput={(params) => <TextField variant='filled' {...params} label={'Categoría'}/>} 
              options={enumValues} disablePortal value={currentNewProdField} onChange={handleAutocompleteChange}/>
          </FormControl>
        )
        break;
      case 'colors':
        return (
          <FormControl>
            <Autocomplete renderInput={(params) => <TextField variant='filled' {...params} label={'Color'}/>} 
              options={enumValues} disablePortal /*value={currentNewProdField}*/ onChange={handleAutocompleteChange}/>
          </FormControl>
        )
      break;
      case 'img':
        return (<>
          {/* <MuiFileInput name={`${keyModel}`} label={`Imágenes`} placeholder='Agregar'
            value={currentNewProdField} onChange={handleChange} multiple
            InputProps={{ startAdornment: <MdOutlineImage/>, inputProps:{accept: 'image/*'}}}
          /> */}
          {console.log(currentNewProdField)}
          <ImageUploader name={`${keyModel}`} onImgChange={handleChange} images={currentNewProdField} setRemovedImages={setRemovedImages}/>
          {removedImages.length > 0 && <RemovedImagesViewer removedImages={removedImages} onRestore={(url) => {
            setRemovedImages(prev => prev.filter(u => u !== url));
            const nuevaLista = [...(currentNewProdField || []), url];
            handleChange(nuevaLista);                        
          }}/>}
          {/* <ImageUploader name={`${keyModel}`} onImgChange={handleChange} images={currentNewProdField} existingImages={existingImages}/> */}
        </>)
      break;
      default:
        return <div>No field yet for: {modelKey}</div>
      break;
    }

    return <FormControl>
      <TextField
            required={modelInputInfo.isRequired} label={`${modelInputInfo.labelName}`} value={currentNewProdField} onChange={handleChange} 
            name={`${keyModel}`} id={`${keyModel}-input`}type={modelInputInfo.dataType}//valores basicos
            multiline={modelInputInfo.isMultiline} minRows={2} maxRows={8} disabled={modelInputInfo.isDisabled} variant='filled'/>{/*valores especiales si se cumplen ciertas condiciones*/}
            {/* //agregar mas y tener en cuenta los selects y los campos que sean arrays, tambien revisar como hacer con el campo img, y dejar */}
            {/* //algo default para posibles nuevos campos */}
    </FormControl>
  }

  return (
    <>{renderSwitch(modelKey)}</>
  )
}

export default FormGenerator