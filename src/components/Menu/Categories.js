import React, {useState,useEffect,useRef,useLayoutEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { currentCategories, setFilterInfo } from '../../redux/searchBarSlice';
import { getCategoriesList } from '../../auxiliaries/axios';

const Categories = ({setHiddenCats, activeCat, onCategorySelected}) => {
    const dispatch = useDispatch();
    const currentCats = useSelector(currentCategories);
    const measureRef = useRef(null);
    const ulRef = useRef(null);

    const [catWidths, setCatWidths] = useState([]);
    const [visibleCats, setVisibleCats] = useState(currentCats);

      useEffect(() => {
        const getCategories = async () => {
          const filterInfo = await getCategoriesList();
          console.log(filterInfo.data)
          if (currentCats.length === 0) dispatch(setFilterInfo(filterInfo.data));
        };
        getCategories();
        setVisibleCats(currentCats);
        console.log(currentCats)
      }, [currentCats, dispatch]);

    useLayoutEffect(() => {
        if (!measureRef.current) return;
        const lis = Array.from(
            measureRef.current.querySelectorAll('li.category-item')
        );
        const widths = lis.map(li => li.getBoundingClientRect().width);
        setCatWidths(widths);
    }, [currentCats]);


    useLayoutEffect(() => {
    if (catWidths.length === 0 || !ulRef.current) return;

    // leemos dinámicamente el gap de tu UL de categorías
    const style = window.getComputedStyle(ulRef.current);
    const GAP = parseFloat(style.gap) || 0;
    const MORE_BTN_WIDTH = 2; // ancho fijo para el botón "más"
    const FUZZ = 1;

    const calculate = () => {
        const contWidth = ulRef.current.clientWidth;
        let acc = 0;
        let splitIndex = catWidths.length;

        for (let i = 0; i < catWidths.length; i++) {
        const extraGap = i > 0 ? GAP : 0;
        if (acc + catWidths[i] + extraGap <= contWidth - MORE_BTN_WIDTH - FUZZ) {
            acc += catWidths[i] + extraGap;
        } else {
            splitIndex = i;
            break;
        }
        }

        setVisibleCats(currentCats.slice(0, splitIndex));
        setHiddenCats(currentCats.slice(splitIndex));
    };

    calculate();
    const ro = new ResizeObserver(calculate);
    ro.observe(ulRef.current);
    window.addEventListener('resize', calculate);
    return () => {
        ro.disconnect();
        window.removeEventListener('resize', calculate);
    };
    }, [catWidths, currentCats, setHiddenCats]);

  return <>
        <ul ref={measureRef} style={{position: 'absolute',visibility: 'hidden',height: 0,overflow: 'hidden',whiteSpace: 'nowrap',}}>
            {currentCats.map(cat => (
                <li key={cat} className='category-item'>{cat}</li>
            ))}
        </ul>
        <ul className='categories' ref={ulRef}>
            {visibleCats.map(cat => (
                <li key={cat} className={`category-item ${activeCat === cat ? 'activeCategory' : ''}`} onClick={() => dispatch(onCategorySelected(cat))}>
                    {cat}
                </li>
            ))}
        </ul>
    </>
}

export default Categories