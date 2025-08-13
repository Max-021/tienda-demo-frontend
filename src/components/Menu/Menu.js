import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BsCart2 } from "react-icons/bs";
import { MdDoubleArrow } from "react-icons/md";
import Popover from '@mui/material/Popover';

import Links from '../reusables/Links';
import { sessionBtns } from '../../data/iconsArray';

import { activeCategory } from '../../redux/ProductsSlice';
import { selectCategoryAndFilter } from '../../redux/thunks/productThunks';
import { totalProducts } from '../../redux/CartSlice';

import Categories from './Categories';

const Menu = ({ showCats, authSt, role }) => {
  const dispatch = useDispatch();
  const activeCat = useSelector(activeCategory);
  const prodsInCart = useSelector(totalProducts);

  const [hiddenCats, setHiddenCats] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);
  const popoverId = isPopoverOpen ? 'hiddenCatsPopover' : undefined;

  const openPopover = event => setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

  useEffect(() => {
    if (hiddenCats.length === 0 && isPopoverOpen) {
      closePopover();
    }
  }, [hiddenCats, isPopoverOpen]);

  // Filtrar los sessionBtns según el role pasado por props
  const validSessionBtns = useMemo(() => {
    if (!Array.isArray(sessionBtns) || sessionBtns.length === 0) return [];

    return sessionBtns.filter(btn => {
      const lvl = btn.userLevel;

      // si no hay userLevel definido o está vacío -> accesible para todos
      if (!lvl || (Array.isArray(lvl) && lvl.length === 0)) return true;

      // si userLevel es array -> incluir si role está dentro
      if (Array.isArray(lvl)) return !!role && lvl.includes(role);

      // si userLevel es string -> comparar igualdad
      if (typeof lvl === 'string') return !!role && lvl === role;

      // fallback: ocultar
      return false;
    });
  }, [role]);

  return (
    showCats === '/' && (
      <div className='menu' style={{ justifyContent: showCats === '/cart' ? 'flex-end' : undefined }}>
        <Categories setHiddenCats={setHiddenCats} activeCat={activeCat} selectCategoryAndFilter={selectCategoryAndFilter}/>
        <div className='rightSide'>
          {hiddenCats.length > 0 && (
            <>
              <button className='more-btn rotated-btn' onClick={openPopover} title='Otras categorías'>
                <MdDoubleArrow />
              </button>
              <Popover id={popoverId} open={isPopoverOpen} onClose={closePopover}
                anchorEl={anchorEl} disableScrollLock
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{paper: {className:'popoverCats'},}}
              >
                <p style={{margin: 0, alignSelf: 'center', marginBottom: '4px'}}>Otras categorias</p>
                {hiddenCats.map(cat => (
                  <li key={cat} className={`popoverCategory ${activeCat === cat ? 'activeCategory' : ''}`}
                    onClick={() => {
                      dispatch(selectCategoryAndFilter(cat));
                      closePopover();
                    }}
                  >
                    {cat}
                  </li>
                ))}
              </Popover>
            </>
          )}

          {authSt && validSessionBtns.length > 0 && (
            // Links espera un array con {icon, linkUrl, title} — ya está filtrado
            <Links linkArray={validSessionBtns} />
          )}

          <Link to='/cart' title='Carrito' style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <BsCart2 />
            {prodsInCart}
          </Link>
        </div>
      </div>
    )
  );
};

export default Menu;
