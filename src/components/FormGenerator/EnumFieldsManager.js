import React, { useState } from 'react'
import { useNotification } from '../reusables/NotificationContext';
import { updateEnumList, updateProductsToNewSimpleField, updateProductsToNewArray, updateProductsToNewSubDoc } from '../../auxiliaries/axios';

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
const EnumFieldsManager = ({dataField, enumName, refetchEnums, enumId}) => {
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
    setActiveFieldToUpdate(null);
    setFieldVal('');
    setAutoCompVal('');
  }

  const submitEnum = async (mode) => {
    setLoading(true);
    let enumList = [];
    let msg = '';
    if(mode === 'upload'){
      enumList = [...dataField, fieldVal.trim()];
      msg = 'Elemento agregado a la lista correctamente!';
    }else if(mode === 'update'){
      const oldVal = dataField[activeFieldToUpdate].toLowerCase();
      enumList = dataField.map((v,i) => i === activeFieldToUpdate ? fieldVal.trim() : v);
      setConfirmMsgComp({fc:() => updateToNewFieldContent(oldVal, fieldVal.toLowerCase()), text:`Desea actualizar los productos que usen ${oldVal} por ${fieldVal}?.`});
      msg = 'Elemento actualizado correctamente!';
    }else{
      notify('error', 'Ocurrió un error realizando esta acción, reintente.');
      return;
    }
    try {
      setBtnType();
      await updateEnumList(enumId,enumList);
      refetchEnums();
      if(mode === 'update') setOpen(true)//para edicion solo
      notify('success', msg);
    } catch (error) {
      notify('error', error.message);
    }finally{
      setLoading(false);
    }
  }
  const prepareDeleteAction = () => {
    setConfirmMsgComp({fc: deleteEnumField, text: 'Desea eliminar este elemento de la lista? Al confirmar su eliminación también se eliminara de todos los productos que lo tengan asignado.'});
    setOpen(true);
  }

  const deleteEnumField = async () => {
    setLoading(true);
    try {
      const updatedEnumList = dataField.filter((_,i) => i !== activeFieldToUpdate)
      await updateEnumList({enumId, values: updatedEnumList});
      refetchEnums();
      setBtnType();
      notify('success','Elemento eliminado con exito!');
    } catch (error) {
      notify('error', error.message);
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
          await updateProductsToNewSubDoc({oldInfo, newInfo, fieldName: 'stock'})
          break;
        default:
          notify('warning', 'No functionality implemented for this field yet.');
          break;
      }
      notify('success','Productos modificados correctamente!');
    } catch (err) {
      notify('error', err.message);
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
        <Button sx={{padding: '15.09px 8px', marginTop:'6px', alignSelf:'flex-start', opacity:`${loading?0:1}`}} variant='outlined' type='submit' onClick={() => submitEnum(addFieldText ? 'upload' : 'update')} disabled={loading || !fieldVal.trim()}>
          {addFieldText ? 'Agregar':'Editar'}
        </Button>
      </div>
      {loading ? <LoadingSpinner spinnerInfo='smallSpinner' containerClass='smallSpinner'/>
        :
          <div className='enumFieldsAutocomp'>
            <FormControl>
              <Autocomplete value={dataField && dataField.includes(autoCompVal) ? autoCompVal : null} renderInput={(params) => <TextField variant='filled' sx={{minWidth:220, paddingTop:'6px'}} {...params} label={enumName}/>} 
              options={dataField || []} disablePortal onChange={(event, newValue) => {
                                                  setChangedField(newValue);
                                                  setAutoCompVal(newValue);
                                                }}/>
              {activeFieldToUpdate !== null && <button className='deleteEnumFieldBtn' onClick={() => prepareDeleteAction()} disabled={loading}>Eliminar elemento</button>}
            </FormControl>
          </div>
      }
      <ConfirmMessage dialogClass='enumProdDialog' windowStatus={open} confirmFc={confirmMsgComp.fc} cancelFc={setOpen} titleMsg={'Actualización'} textContent={confirmMsgComp.text}/>
    </div>
  </div>
}


export default EnumFieldsManager