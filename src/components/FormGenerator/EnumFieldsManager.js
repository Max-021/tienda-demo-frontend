import React, { useState } from 'react'
import { uploadEnumField } from '../../auxiliaries/axiosHandlers';

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import { IoMdClose } from "react-icons/io";

//este componente devuelve un input para agregar o editar los campos que sean enums en la creacion de productos
//por ej: categorias, aca aparecerian para editar todas las categorias existentes y se podrian agregar nuevas categorias
//sirve para todos los campos del modelo (ej. producto) que sean enums
const EnumFieldsManager = (props) => {
  const [addFieldText, setAddFieldText] = useState(true)
  const [fieldVal, setFieldVal] = useState('');
  const [activeFieldToUpdate, setActiveFieldToUpdate] = useState(null);

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
    updatedEnumList.splice(activeFieldToUpdate,1,fieldVal)
    const fieldsUpdated = {
      [props.enumName]: updatedEnumList,
    }

    uploadEnumField(fieldsUpdated)
    props.updateList(true)
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

  return <div className='enumFieldsContainer'>
    <div className='enunmFieldsInput'>
      <p>{props.enumName}</p>
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
  </div>
}


export default EnumFieldsManager