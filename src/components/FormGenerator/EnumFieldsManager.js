import React, { useState } from 'react'
import { uploadEnumField, updateProductsToNewSimpleField, updateProductsToNewArray } from '../../auxiliaries/axiosHandlers';

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { IoMdClose } from "react-icons/io";


const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

//este componente devuelve un input para agregar o editar los campos que sean enums en la creacion de productos
//por ej: categorias, aca aparecerian para editar todas las categorias existentes y se podrian agregar nuevas categorias
//sirve para todos los campos del modelo (ej. producto) que sean enums
const EnumFieldsManager = (props) => {
  const [addFieldText, setAddFieldText] = useState(true)
  const [fieldVal, setFieldVal] = useState('');
  const [activeFieldToUpdate, setActiveFieldToUpdate] = useState(null);
  const [open, setOpen] = useState(false)
  const [pairedUpdateInfo, setPairedUpdateInfo] = useState({oldInfo: '', newInfo:'',fieldName:''})

  const handleChange = (e) => {
    setFieldVal(e.target.value)
    console.log(typeof fieldVal)
  }

  const setInputField = (enumField, i) => {
    setAddFieldText(false);
    setFieldVal(enumField);
    setActiveFieldToUpdate(i)
  }

  const setBtnType = () => {
    setAddFieldText(true);
    setActiveFieldToUpdate(null)
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
    setPairedUpdateInfo(prevState => ({...prevState, oldInfo: props.dataField[activeFieldToUpdate]}))//asigno el nombre de la categoria reemplazada
    updatedEnumList.splice(activeFieldToUpdate,1,fieldVal)//-------------------------------------------reemplazo la categoria vieja
    setPairedUpdateInfo(prevState => ({...prevState, newInfo: props.dataField[activeFieldToUpdate]}))//asigno el nombre actualizado de la categoria
    const fieldsUpdated = {
      [props.enumName]: updatedEnumList,
    }

    uploadEnumField(fieldsUpdated)
    props.updateList(true)
    setOpen(true);
  }

  const deleteEnumField = (pos) => {
    var updatedEnumList = props.dataField;
    updatedEnumList.splice(pos,1);
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
        updateProductsToNewSimpleField({...pairedUpdateInfo, fieldName:'category'})
        break;
      case 'colors':
        updateProductsToNewArray({...pairedUpdateInfo, fieldName:'colors'})
        break;
      default:
        alert('No functionality implemented for this fields yet');
        break;
    }
    setPairedUpdateInfo({oldInfo:'',newInfo:'',fieldName:''})//después de ejecutar la actualizacion siempre limpio este objeto
  }

  return <div className='enumFieldsContainer'>
    <div className='enunmFieldsInput'>
      <h4>{props.enumName}</h4>
      <FormControl>
        <TextField type='text' required value={fieldVal} onChange={handleChange}/>
        {!addFieldText && 
          <>
            <span>Se va a modificar el campo resaltado, para anular la modificación y que el valor ingresado sea un nuevo campo hacer click en el ícono</span>
            <IoMdClose onClick={setBtnType}/>
          </>
        }
      </FormControl>
        <button type='submit' onClick={addFieldText ? addEnumField : editEnumField}>{addFieldText ? 'Agregar':'Editar'}</button>
    </div>
    <div className='enumFieldsFields'>
      {props.dataField.map((field,index) => {
        return <div className={`enumField ${activeFieldToUpdate === index && 'activeFieldToUpdate'}`} key={index}>
          <p onClick={() => setInputField(field,index)}>{field}</p>
          <button onClick={() => deleteEnumField(index)}>X</button>
        </div>
      })}
    </div>
    <Dialog fullWidth maxWidth='90%' open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
      Desea actualizar los productos de esta categoría para que pertenezcan a la nueva categoría actualizada o desea que los productos permanezcan en la categoría en que están?temporal, revisar texto
      <button type='button' title='confirmar cierre de sesión' onClick={() => updateToNewFieldContent()}> Sí </button>
      <button type='button' title='No' onClick={() => setOpen(false)}> No </button>
    </Dialog>
  </div>
}


export default EnumFieldsManager