import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext({ notify: (type, message) => {} });

export const NotificationProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  const processQueue = useCallback(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [current, queue]);

  useEffect(() => {
    processQueue();
  }, [queue, current, processQueue]);

  const notify = useCallback((type, message) => {
    setQueue(prev => [...prev, { type, message }]);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setCurrent(null);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {current && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={current.type} sx={{ width: '100%' }}>
            {current.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context.notify;
};