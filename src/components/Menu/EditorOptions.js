import React, {useState} from 'react'
import { useNotification } from '../reusables/NotificationContext';
import { useDispatch, useSelector } from 'react-redux';
import { EDITOR_FILTER_LABELS } from '../../data/labels';
import { fetchEditorProducts } from '../../redux/ProductsSlice';


import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const EditorOptions = () => {
  const notify = useNotification();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);
  const [editorFilters, setEditorFilters] = useState({showInactive: false, showAll: false,})

  const aplicarFiltrosEditor = async (e) => {
    e.preventDefault();
    try {
      await dispatch(fetchEditorProducts(editorFilters)).unwrap();
    } catch (error) {
      notify('error', 'Error al aplicar los filtros, reintente.')
    }

  }

  const handleChecked = (e) => {
    setEditorFilters(prev => ({...prev, [e.target.name]:e.target.checked}));
    //si bien lo siguiente ya lo chequeo en el servidor, igual lo valido antes de enviar
    if(e.target.name === 'showInactive' && e.target.checked) setEditorFilters(prev => ({...prev, showAll: false}));
    if(e.target.name === 'showAll' && e.target.checked) setEditorFilters(prev => ({...prev, showInactive: false}));
  }

  return (
    <div className='editorOptions'>
        <div className='editorFilterTitle'>
          <p>Filtros para editor:</p>
        </div>
        <form onSubmit={aplicarFiltrosEditor}>
          {Object.keys(editorFilters).map((item, index) => {
            return (
            <FormGroup key={`${index}-${item}`}>
              <FormControlLabel control={<Checkbox name={item} checked={editorFilters[item]} onChange={handleChecked}/>} label={EDITOR_FILTER_LABELS[item]}/>
            </FormGroup>
          )})}
          <Button type='submit' variant='outlined' sx={{justifySelf: 'center'}} disabled={loading === 'pending'}>
            {loading === 'pending' ? 'Cargando...' :'Aplicar'}
          </Button>
        </form>
    </div>
  )
}

export default EditorOptions