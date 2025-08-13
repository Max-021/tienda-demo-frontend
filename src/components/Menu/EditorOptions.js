import React from 'react';
import { useNotification } from '../reusables/NotificationContext';
import { useDispatch, useSelector } from 'react-redux';
import { EDITOR_FILTER_LABELS } from '../../data/labels';
import { fetchProducts, updateEditorFilter, resetEditorFilters, resetProductsForNewQuery, editorFiltersSelector, setEditorFilters } from '../../redux/ProductsSlice';
import { IoIosOptions } from "react-icons/io";
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const EditorOptions = () => {
  const notify = useNotification();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);
  const editorFilters = useSelector(editorFiltersSelector);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopover = (e) => setAnchorEl(e.currentTarget);
  const closePopover = () => setAnchorEl(null);
  const isOpen = Boolean(anchorEl);
  const popoverId = isOpen ? 'editor-filter-popover' : undefined;

  const toggleCheckbox = (key) => (e) => {
    const checked = e.target.checked;
    dispatch(updateEditorFilter({ key, value: checked }));
  };

  const applyFilters = async (e) => {
    e && e.preventDefault();
    try {
      const payloadFilters = {};
      Object.keys(editorFilters).forEach(k => {
        if (editorFilters[k]) payloadFilters[k] = true;
      });

      dispatch(resetProductsForNewQuery());
      dispatch(setEditorFilters(payloadFilters));

      await dispatch(fetchProducts({ editorFilters: payloadFilters, page: 1 })).unwrap();

      closePopover();
    } catch (error) {
      notify('error', error.message || 'Error aplicando filtros');
    }
  };

  const resetFilters = () => {
    dispatch(resetEditorFilters());
  };

  return (
    <div className="editorOptions">
      <IoIosOptions
        title="Filtros para editor"
        aria-controls={popoverId}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={openPopover}
        style={{ cursor: 'pointer' }}
      />
      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
        PaperProps={{ style: { minWidth: 240, maxWidth: 360, padding: 8 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ px: 1, py: 0.5 }}>
            <strong>Filtros para editor</strong>
          </Box>
          <Divider />
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto', px: 1, py: 0.5 }}>
            <FormGroup>
              {Object.keys(EDITOR_FILTER_LABELS).map((key) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox name={key} checked={!!editorFilters[key]} onChange={toggleCheckbox(key)} />}
                  label={EDITOR_FILTER_LABELS[key]}
                />
              ))}
            </FormGroup>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', px: 1, py: 1 }}>
            <Button size="small" onClick={resetFilters} disabled={loading === 'pending'}>
              Limpiar
            </Button>
            <Button size="small" onClick={closePopover}>Cancelar</Button>
            <Button variant="outlined" onClick={applyFilters} disabled={loading === 'pending'}>
              {loading === 'pending' ? 'Cargando...' : 'Aplicar'}
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default EditorOptions;
