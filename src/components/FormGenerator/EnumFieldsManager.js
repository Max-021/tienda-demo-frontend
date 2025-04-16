import React, { useState } from 'react'
import { uploadEnumField, updateProductsToNewSimpleField, updateProductsToNewArray } from '../../auxiliaries/axiosHandlers';

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
import ConfirmMessage from '../reusables/ConfirmMessage';


//este componente devuelve un input para agregar o editar los campos que sean enums en la creacion de productos
//por ej: categorias, aca aparecerian para editar todas las categorias existentes y se podrian agregar nuevas categorias
//sirve para todos los campos del modelo (ej. producto) que sean enums
const EnumFieldsManager = (props) => {
  const [addFieldText, setAddFieldText] = useState(true)
  const [fieldVal, setFieldVal] = useState('');
  const [autoCompVal, setAutoCompVal] = useState('')
  const [activeFieldToUpdate, setActiveFieldToUpdate] = useState(null);
  const [open, setOpen] = useState(false)
  const [pairedUpdateInfo, setPairedUpdateInfo] = useState({oldInfo: '', newInfo:'',fieldName:''})

  const handleChange = (e) => {
    setFieldVal(e.target.value)
    console.log(typeof fieldVal)
  }

  const setBtnType = () => {
    setAddFieldText(true);
    setActiveFieldToUpdate(null)
    setFieldVal('')
    setAutoCompVal('');
  }

  const addEnumField = () => {
    alert("agregado!")
    var newEnumList = props.dataField;
    newEnumList = [...newEnumList, fieldVal]
    const fieldsUpdated = {
      [props.enumName]: newEnumList
    }
    uploadEnumField(fieldsUpdated)
    props.updateList(true)
  }

  const editEnumField = () => {
    alert("editado")
    var updatedEnumList = props.dataField;
    setPairedUpdateInfo(prevState => ({...prevState, oldInfo: props.dataField[activeFieldToUpdate].tolowerCase}))//asigno el nombre de la categoria reemplazada
    updatedEnumList.splice(activeFieldToUpdate,1,fieldVal)//-------------------------------------------reemplazo la categoria vieja
    setPairedUpdateInfo(prevState => ({...prevState, newInfo: props.dataField[activeFieldToUpdate].tolowerCase}))//asigno el nombre actualizado de la categoria
    const fieldsUpdated = {
      [props.enumName]: updatedEnumList,
    }

    uploadEnumField(fieldsUpdated)
    props.updateList(true)
    setOpen(true);
  }

  const deleteEnumField = () => {
    var updatedEnumList = props.dataField;
    updatedEnumList.splice(activeFieldToUpdate,1);
    const fieldsUpdated = {
      [props.enumName]: updatedEnumList,
    }
    uploadEnumField(fieldsUpdated)
    props.updateList(true)
  }
  
  const updateToNewFieldContent = () => {//esta funcion toma condiciones para cada uno de los enumFields que hayan, y asigno el nombre del campo donde se va a hacer el reemplazo
    setOpen(false)
    switch (props.enumName) {
      case 'category':
        updateProductsToNewSimpleField({...pairedUpdateInfo, fieldName: props.enumName})
        break;
      case 'colors':
        updateProductsToNewArray({...pairedUpdateInfo, fieldName: props.enumName})
        break;
      default:
        alert('No functionality implemented for this fields yet');
        break;
    }
    setPairedUpdateInfo({oldInfo:'',newInfo:'',fieldName:''})//después de ejecutar la actualizacion siempre limpio este objeto
  }
  const setChangedField = (newVal) => {
    if(newVal === null){
      setFieldVal('');
      setActiveFieldToUpdate(null);
      setAddFieldText(true);
    }else{
      const indVal = props.dataField.indexOf(newVal)
      if(indVal !== -1){
        setAddFieldText(false)
        setFieldVal(newVal)
        setActiveFieldToUpdate(indVal)
      }
    }
  }

  return <div className='enumFieldsContainer'>
    <p className='enumTitle'>{props.enumName}</p>
    <div  className='enumFieldsList'>
      <div className='enunmFieldsInput'>
        <FormControl>
          <TextField size='small' type='text' required value={fieldVal} onChange={handleChange} sx={{'& .MuiOutlinedInput-input': {padding: '16.5px 8px',}, paddingRight:'12px',paddingTop:'6px'}}/>
          {!addFieldText && <><span onClick={setBtnType} className='editSpanWarning'>Para anular la edición, hacer click aquí <IoMdClose/></span></>}
        </FormControl>
        <Button sx={{padding: '15.09px 8px', marginTop:'6px', alignSelf:'flex-start'}} variant='outlined' type='submit' onClick={addFieldText ? addEnumField : editEnumField}>{addFieldText ? 'Agregar':'Editar'}</Button>
      </div>
      <div className='enumFieldsAutocomp'>
        <FormControl>
          <Autocomplete value={autoCompVal} renderInput={(params) => <TextField variant='filled' sx={{minWidth:220, paddingTop:'6px'}} {...params} label={props.enumName}/>} 
            options={props.dataField} disablePortal onChange={(event, newValue) => setChangedField(newValue)}/>
            {activeFieldToUpdate !== null && <button className='deleteEnumFieldBtn' onClick={() => deleteEnumField()}>Eliminar elemento</button>}
        </FormControl>
      </div>
      <ConfirmMessage windowStatus={open} confirmFc={updateToNewFieldContent} cancelFc={setOpen} textMsg={"Desea actualizar los productos de esta categoría para que pertenezcan a la nueva categoría actualizada o desea que los productos permanezcan en la categoría en que están?temporal, revisar texto"}/>
    </div>
  </div>
}


export default EnumFieldsManager