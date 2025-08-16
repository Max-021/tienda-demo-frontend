import React, {useState, useEffect, useCallback} from 'react'

import { IoIosArrowDropupCircle } from "react-icons/io";

const GoUp = () => {
    const [showGoUp, setShowGoUp] = useState(false);

    useEffect(() => {
        const THRESHOLD = 200;
        let ticking = false;

        const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
            setShowGoUp(window.scrollY > THRESHOLD);
            ticking = false;
            });
            ticking = true;
        }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        setShowGoUp(window.scrollY > THRESHOLD);

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleGoUp = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <button type='button' className={`goUp-icon ${showGoUp ? 'visible' : ''}`} onClick={handleGoUp} aria-label='ir arriba'> 
        <IoIosArrowDropupCircle />
        </button>
    )
}

export default GoUp