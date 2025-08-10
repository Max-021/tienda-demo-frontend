import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const NotificationContext = createContext({ notify: (type, message, opts) => {} });

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

  const notify = useCallback((type, message, opts = {}) => {
    setQueue(prev => [...prev, {
      type,
      message,
      actionText: opts.actionText || null,
      action: typeof opts.action === 'function' ? opts.action : null,
      duration: typeof opts.duration === 'number' ? opts.duration : 4000,
    }]);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setCurrent(null);
  };

  const handleAction = () => {
    if (current && typeof current.action === 'function') {
      try { current.action(); } catch (err) { console.error('Notification action error', err); }
    }
    setCurrent(null);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {current && (
        <Snackbar
          open
          autoHideDuration={current.duration}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={current.type}
            sx={{ width: '100%' }}
            action={
              current.actionText ? (
                <Button color="inherit" size="small" onClick={handleAction}>
                  {current.actionText}
                </Button>
              ) : null
            }
          >
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