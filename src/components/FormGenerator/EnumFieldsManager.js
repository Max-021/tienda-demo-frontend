import React, { useState } from 'react'
import { useNotification } from '../reusables/NotificationContext';
import { uploadEnumField, updateProductsToNewSimpleField, updateProductsToNewArray } from '../../auxiliaries/axios';

import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
import ConfirmMessage from '../reusables/ConfirmMessage';
import LoadingSpinner from '../reusables/LoadingSpinner';

/*este componente devuelve un input para agregar o editar los campos que sean enums en la creacion de productos
por ej: categorias, aca aparecerian para editar todas las categorias existentes y se podrian agregar nuevas categorias
sirve para todos los campos del modelo (ej. producto) que sean enums*/
const EnumFieldsManager = ({dataField, enumName, refetchEnums, }) => {
  const notify = useNotification();
  const [addFieldText, setAddFieldText] = useState(true)
  const [fieldVal, setFieldVal] = useState('');
  const [autoCompVal, setAutoCompVal] = useState('')
  const [activeFieldToUpdate, setActiveFieldToUpdate] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmMsgComp, setConfirmMsgComp] = useState({text: '', fc: () => {}});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFieldVal(e.target.value)
  const setBtnType = () => {
    setAddFieldText(true);
    setActiveFieldToUpdate(null)
    setFieldVal('')
    setAutoCompVal('');
  }

  const submitEnum = async (mode) => {
    setLoading(true);
    try {
      let enumList = [...dataField];
      let msg = '';
      if(mode === 'upload'){
        enumList.push(fieldVal);
        msg = 'Elemento agregado a la lista correctamente!';
      }else if(mode === 'update'){
        const oldVal = dataField[activeFieldToUpdate].toLowerCase()
        enumList.splice(activeFieldToUpdate, 1, fieldVal);
        setConfirmMsgComp(prev => ({...prev, fc:() => updateToNewFieldContent(oldVal, fieldVal.toLowerCase()), text:'Desea actualizar los productos de esta categoría para que pertenezcan a la nueva categoría actualizada o prefiere que los productos permanezcan en la categoría en que están actualmente. Sí para actualizar, No para mantener.'}));
        msg = 'Elemento actualizado correctamente!';
      }else{
        notify('error', 'Ocurrió un error realizando esta acción, reintente.');
        return;
      }
      const fieldsUpdated = { [enumName]: enumList}
      await uploadEnumField(fieldsUpdated);
      refetchEnums();
      setBtnType();
      if(mode === 'update') setOpen(true)//para edicion solo
      notify('success', msg);
    } catch (error) {
      notify('error', 'Error enviando la información, reintente.');
    }finally{
      setLoading(false);
    }
  }
  const prepareDeleteAction = () => {
    setConfirmMsgComp(prev => ({...prev, fc: deleteEnumField, text: 'Desea eliminar este elemento de la lista? Al confirmar su eliminación también se eliminara de todos los productos que lo tengan asignado.'}));
    setOpen(true);
  }

  const deleteEnumField = async () => {
    setLoading(true);
    try {
      var updatedEnumList = dataField;
      updatedEnumList.splice(activeFieldToUpdate,1);
      const fieldsUpdated = { [enumName]: updatedEnumList, };
      await uploadEnumField(fieldsUpdated);
      refetchEnums();
      setBtnType();
      notify('success','Elemento eliminado con exito!');
    } catch (error) {
      notify('error','Ocurrió un error al eliminar este elemento, reintente.');
    }
    await updateToNewFieldContent(fieldVal.toLowerCase(), '');
  }
  
  const updateToNewFieldContent = async (oldInfo, newInfo) => {//esta funcion toma condiciones para cada uno de los enumFields que hayan, y asigno el nombre del campo donde se va a hacer el reemplazo
    setOpen(false)
    setLoading(true);
    try {
      switch (enumName) {
        case 'category':
          await updateProductsToNewSimpleField({oldInfo, newInfo, fieldName: enumName})
          break;
        case 'colors':
          await updateProductsToNewArray({oldInfo, newInfo, fieldName: enumName})
          break;
        default:
          notify('warning', 'No functionality implemented for this field yet.');
          break;
      }
      notify('success','Productos modificados correctamente!');
    } catch (error) {
      notify('error', 'Ocurrió un error al intentar actualizar los productos con el nuevo valor, reintente la modificación o cambie manualmente los productos que desea actualizar para mayor seguridad.');
    }finally{
      setLoading(false);
    }
  }
  const setChangedField = (newVal) => {
    if(newVal === null){
      setFieldVal('');
      setActiveFieldToUpdate(null);
      setAddFieldText(true);
    }else{
      const indVal = dataField.indexOf(newVal)
      if(indVal !== -1){
        setAddFieldText(false)
        setFieldVal(newVal)
        setActiveFieldToUpdate(indVal)
      }
    }
  }

  return <div className='enumFieldsContainer'>
    <p className='enumTitle'>{enumName}</p>
    <div  className='enumFieldsList'>
      <div className='enunmFieldsInput'>
        <FormControl>
          <TextField size='small' type='text' required value={fieldVal} onChange={handleChange} sx={{'& .MuiOutlinedInput-input': {padding: '16.5px 8px',}, paddingRight:'12px',paddingTop:'6px'}}/>
          {!addFieldText && <><span onClick={setBtnType} className='editSpanWarning'>Para anular la edición, hacer click aquí <IoMdClose/></span></>}
        </FormControl>
        {!loading &&
          <Button sx={{padding: '15.09px 8px', marginTop:'6px', alignSelf:'flex-start'}} variant='outlined' type='submit' onClick={() => submitEnum(addFieldText ? 'upload' : 'update')} disabled={loading || !fieldVal.trim()}>
            {addFieldText ? 'Agregar':'Editar'}
          </Button>
        }
      </div>
      <div className='enumFieldsAutocomp'>
        <FormControl>
          {loading ? <LoadingSpinner/> 
            :
            <>
              <Autocomplete value={autoCompVal} renderInput={(params) => <TextField variant='filled' sx={{minWidth:220, paddingTop:'6px'}} {...params} label={enumName}/>} 
              options={dataField} disablePortal onChange={(event, newValue) => setChangedField(newValue)}/>
              {activeFieldToUpdate !== null && <button className='deleteEnumFieldBtn' onClick={() => prepareDeleteAction()} disabled={loading}>Eliminar elemento</button>}
            </>
          }
        </FormControl>
      </div>
      <ConfirmMessage windowStatus={open} confirmFc={confirmMsgComp.fc} cancelFc={setOpen} textMsg={confirmMsgComp.text}/>
    </div>
  </div>
}


export default EnumFieldsManager