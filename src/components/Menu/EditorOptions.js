import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import { useNotification } from '../reusables/NotificationContext';
import { useDispatch, useSelector } from 'react-redux';
import { EDITOR_FILTER_LABELS } from '../../data/labels';
import { fetchEditorProducts } from '../../redux/ProductsSlice';
import { BsFilterSquare } from "react-icons/bs";
import Popover from '@mui/material/Popover';

import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const EditorOptions = () => {
  const notify = useNotification();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);
  const [editorFilters, setEditorFilters] = useState([{showInactive: false},{showAll: false,}])
  const [hiddenOps, setHiddenOps] = useState([]);
  const [visibleOps, setVisibleOps] = useState(editorFilters)
  const [anchorEl, setAnchorEl] = useState(null);
  const [shouldEllipse, setShouldEllipse] = useState(false);
  const measureRef = useRef(null);
  const containerRef = useRef(null);
  const btnRef = useRef(null);

    const isPopoverOpen = Boolean(anchorEl);
    const popoverId = isPopoverOpen ? 'editorFilterPopover' : undefined;
  
    const openPopover = event => setAnchorEl(event.currentTarget);
    const closePopover = () => setAnchorEl(null);
  
    useEffect(() => {
      if (hiddenOps.length === 0 && isPopoverOpen) {
        closePopover();
      }
    }, [hiddenOps, isPopoverOpen]);

  const applyEditorFilters = async (e) => {
    e.preventDefault();
    try {
      const filtros = editorFilters.reduce((acc,item) => ({...acc, ...item}), {})
      await dispatch(fetchEditorProducts(filtros)).unwrap();
    } catch (error) {
      notify('error', error);
    }
  }

  const handleChecked = (e,index) => {
    const {name, checked} = e.target;
    setEditorFilters(prev => prev.map((item, i) => {
      const key = Object.keys(item)[0];
      if(i===index) return {[key]: checked};

      if(checked){
        if(name === 'showInactive' && key === 'showAll') return {[key]: false};
        if(name === 'showAll' && key === 'showInactive') return {[key]: false};
      }

      return item
    }));
  }

  useLayoutEffect(() => {
    if (!measureRef.current || !containerRef.current) return;

    const recalc = () => {
      
      const style = window.getComputedStyle(containerRef.current);
      const GAP = parseFloat(style.gap) || 0;
      const MORE_BTN_WIDTH = btnRef.current ? btnRef.current.getBoundingClientRect().width : 0;
      const FUZZ = 1;

      const contWidth = containerRef.current.clientWidth;
      console.log('recalc fired, contWidth=', contWidth);
      // Si aún no está bien medido, esperamos al próximo resize
      if (contWidth <= 0) return;

      // 1) Medimos cada filtro oculto
      const items = Array.from(
        measureRef.current.querySelectorAll('.editor-item')
      );
      const widths = items.map(el => el.getBoundingClientRect().width);
      console.log('[recalc] widths =', widths);

      // 2) *Nuevo bloque*: si todos caben sin reservar espacio para el botón, no hay overflow
      const totalWidth = widths.reduce(
        (sum, w, i) => sum + w + (i > 0 ? GAP : 0),
        0
      );
      console.log('[recalc] totalWidth =', totalWidth);
      if (totalWidth <= contWidth) {
        console.log('[recalc] ➔ mostrando TODOS');
        setVisibleOps(editorFilters);
        setHiddenOps([]);
        return;
      }

      // 3) Si no caben todos, calculamos cuántos entran dejando espacio para el botón
      let acc = 0;
      let splitIndex = widths.length;
      for (let i = 0; i < widths.length; i++) {
        const extraGap = i > 0 ? GAP : 0;
        if (acc + widths[i] + extraGap <= contWidth - MORE_BTN_WIDTH - FUZZ) {
          acc += widths[i] + extraGap;
        } else {
          splitIndex = i;
          break;
        }
      }
      console.log('[recalc] ➔ splitIndex =', splitIndex);

      // 4) Partimos los filtros
      setVisibleOps(editorFilters.slice(0, splitIndex));
      setHiddenOps (editorFilters.slice(splitIndex));
      setShouldEllipse(splitIndex === 0)
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(containerRef.current);
    window.addEventListener('resize', recalc);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [editorFilters,]);



  useEffect(() => {
    if(hiddenOps.length === 0 && isPopoverOpen) closePopover();
  }, [hiddenOps, isPopoverOpen]);

  return (
    <div className='editorOptions'>
        <div className={`editorFilterTitle ${shouldEllipse ? 'allHidden' : ''}`}>
          <p title='Filtros para editor'>Filtros para editor:</p>
        </div>
        <div ref={measureRef} style={{
            position: 'absolute',
            top: 0,
            left: '-9999px',
            visibility: 'hidden',
            height: 'auto'
        }}>{/*este div es invisible */}
          {editorFilters.map((item, idx) => {
            const key = Object.keys(item)[0];
            const checked = item[key];
            return (
              <FormGroup key={key} className='editor-item' style={{ display: 'inline-flex' }}>
                <FormControlLabel
                  control={<Checkbox name={key} checked={checked} />}
                  label={EDITOR_FILTER_LABELS[key]}
                />
              </FormGroup>
            );
          })}
        </div>
        <form onSubmit={applyEditorFilters} className={`editorFiltersForm`}>
          <div ref={containerRef} className='editor-items-container' style={{ display:'flex',gap:'8px',flexWrap:'nowrap',minWidth:0,width:'100%', alignItems:'center' }}>
            {visibleOps.map((item, index) => {
              const key = Object.keys(item)[0];
              const checked = item[key];
              return (
                <FormGroup key={key}>
                  <FormControlLabel control={<Checkbox name={key} checked={checked} onChange={e => handleChecked(e, index)}/>} label={EDITOR_FILTER_LABELS[key]}/>
                </FormGroup>
              );
            })}
          </div>
          <div style={{display:'flex', flexDirection:'row', alignItems: 'center'}}>
            {hiddenOps.length > 0 && (
              <>
                <button ref={btnRef} type='button' className='more-btn' onClick={openPopover} title='Otros filtros' style={{margin:'0 8px', fontSize:'1.5rem',}}>
                  <BsFilterSquare/>
                </button>
                <Popover
                  id={popoverId}
                  open={isPopoverOpen}
                  onClose={closePopover}
                  anchorEl={anchorEl}
                  disableScrollLock
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top',    horizontal: 'right'  }}
                  slotProps={{ paper: { className: 'popoverCats' } }}
                >
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {hiddenOps.map((item, index) => {
                      const key = Object.keys(item)[0];
                      const checked = item[key];
                      return (
                        <FormControlLabel key={key} control={<Checkbox name={key} checked={checked} onChange={e => handleChecked(e, visibleOps.length + index)}/>} label={EDITOR_FILTER_LABELS[key]}/>
                      );
                    })}
                  </div>
                </Popover>
              </>
            )}
            <Button type='submit' variant='outlined' sx={{justifySelf: 'center', marginRight: '6px'}} disabled={loading === 'pending'}>
              {loading === 'pending' ? 'Cargando...' :'Aplicar'}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default EditorOptions