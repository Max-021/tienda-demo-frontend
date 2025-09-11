import React from 'react'

import RemovedImagesViewer from './RemovedImagesViewer.jsx';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';

import ImageUploader from '../reusables/ImageUploader.jsx';
import StockManager from './StockManager.jsx';

const FormGenerator = ({productModel, productObject, setProductObject, removedImages, setRemovedImages, enumFields}) => {

  const handleAutocompleteChange = (field, newVal) => setProductObject(prev => ({...prev, [field]: newVal}));

  const renderSwitch = (productField, idx) => {//esto se podria factorizar para que el textfield solo aparezca una vez y antes del return le cargo lo que corresponda
    const modelInputInfo = {
      isRequired: false,dataType: 'text',isMultiline: false, isDisabled: false,labelName:'', onChangeFc: handleChange,
    }
    const enumValues = getEnumValues(productField);
    switch (productField) {
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
      case 'category':
        return (
          <FormControl key={`${productField}-${idx}`}>
            <Autocomplete renderInput={(params) => <TextField variant='filled' name={productField} {...params} label={'Categoría'}/>} 
              options={enumValues || []} disablePortal value={enumValues && enumValues.includes(productObject[productField]) ? productObject[productField] : null}
              onChange={(_, val) => handleAutocompleteChange(productField, val)}/>
          </FormControl>
        )
      case 'stock':
        return(
          <StockManager key={`${productField}-${idx}`} stock={productObject[productField]} onStockChange={setProductObject} values={enumValues} colorModel={productModel[productField].subFields}/>
        );
      case 'img':
        return (<div key={`${productField}-${idx}`}>
          <ImageUploader name={`${productField}`} onImgChange={handleImgOnChange} images={productObject[productField]} setRemovedImages={setRemovedImages}/>
          {removedImages.length > 0 && <RemovedImagesViewer removedImages={removedImages} onRestore={(url) => {
            setRemovedImages(prev => prev.filter(u => u !== url));
            const nuevaLista = [...(productObject[productField] || []), url];
            handleChange(nuevaLista);                        
          }}/>}
        </div>)
      default:
        return <div>No field yet for: {productField}</div>
    }

    return <FormControl key={`${productField}-${idx}`}>
      <TextField
            required={modelInputInfo.isRequired} label={`${modelInputInfo.labelName}`} value={productObject[productField]} onChange={modelInputInfo.onChangeFc} 
            name={`${productField}`} id={`${productField}-input`}type={modelInputInfo.dataType}//valores basicos
            multiline={modelInputInfo.isMultiline} minRows={2} maxRows={8} disabled={modelInputInfo.isDisabled} variant='filled'/>{/*valores especiales si se cumplen ciertas condiciones*/}
            {/* //agregar mas y tener en cuenta los selects y los campos que sean arrays, tambien revisar como hacer con el campo img, y dejar */}
    </FormControl>
  }
  const handleChange  = (e) => setProductObject(prev => ({ ...prev,[e.target.name]: e.target.value }));

  const handleImgOnChange = (files) => {
      if (!files || files.length === 0) setProductObject(prev => ({...prev, img: []}))
      else setProductObject(prev => ({...prev, img: files}))
  };
  const getEnumValues = (fieldName) => {
      let doc = [];
      if(fieldName==='stock'){
          doc = enumFields.find(f => f.name === 'colors');
      }else{
          doc = enumFields.find(f => f.name === fieldName);
      }
      return doc ? doc.values : null
  }

  return (
    Object.keys(productModel).map((item, index) => {
      return renderSwitch(item, index);
    })
  )
}

export default FormGenerator