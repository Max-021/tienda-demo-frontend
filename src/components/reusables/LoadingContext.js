import React, {createContext, useContext, useState, useCallback} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingContext = createContext({
    start: () => {},
    finish: () => {},
})

export const LoadingProvider = ({children}) => {
    const [count, setCount] = useState(0);

    const start = useCallback(() => setCount((c) => c + 1), []);
    const finish = useCallback(() => setCount((c) => Math.max(c - 1, 0)), []);

    return (
        <LoadingContext.Provider value={{start, finish}}>
            {children}
            <Backdrop open={count > 0} sx={{zIndex: 50, color: '#fff'}}>
                <CircularProgress color='inherit'/>
            </Backdrop>
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if(!context) throw new Error('UseLoading must be used with LodingProvider');
    return context;
}