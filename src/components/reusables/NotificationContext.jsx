import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const NotificationContext = createContext({ notify: (type, message, opts) => {} });

/**
 * NotificationProvider
 * - maxVisibleDesktop: número máximo de toasts visibles en desktop
 * - maxVisibleMobile: número máximo de toasts visibles en mobile
 * - mobileBreakpoint: ancho en px para considerar "mobile" (900)
 */
export const NotificationProvider = ({
  children,
  maxVisibleDesktop = 3,
  maxVisibleMobile = 2,
  mobileBreakpoint = 900,
}) => {
  const [queue, setQueue] = useState([]);
  const [visible, setVisible] = useState([]);
  const idCounter = useRef(0);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= mobileBreakpoint : false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, [mobileBreakpoint]);

  const maxVisible = isMobile ? maxVisibleMobile : maxVisibleDesktop;

  const createItem = useCallback((type, message, opts = {}) => {
    return {
      id: `${Date.now()}-${++idCounter.current}`,
      key: opts.dedupeKey || `${type}::${message}`,
      type,
      message,
      count: 1,
      actionText: opts.actionText || null,
      action: typeof opts.action === 'function' ? opts.action : null,
      duration: typeof opts.duration === 'number' ? opts.duration : 4000,
    };
  }, []);

  const notify = useCallback((type, message, opts = {}) => {
    const dedupeKey = opts.dedupeKey || `${type}::${message}`;

    let foundInVisible = false;
    setVisible(prev => {
      const idx = prev.findIndex(it => it.key === dedupeKey);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], count: copy[idx].count + 1 };
        foundInVisible = true;
        return copy;
      }
      return prev;
    });

    if (foundInVisible) return;

    let foundInQueue = false;
    setQueue(prev => {
      const idx = prev.findIndex(it => it.key === dedupeKey);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], count: copy[idx].count + 1 };
        foundInQueue = true;
        return copy;
      }
      return prev;
    });

    if (foundInQueue) return;

    const item = createItem(type, message, opts);
    setQueue(prev => [...prev, item]);
  }, [createItem]);

  useEffect(() => {
    if (visible.length >= maxVisible || queue.length === 0) return;

    setVisible(prev => {
      const space = maxVisible - prev.length;
      const take = queue.slice(0, space);
      return [...prev, ...take];
    });
    setQueue(prev => prev.slice(Math.min(prev.length, maxVisible - visible.length)));
  }, [queue, maxVisible]);

  const removeVisible = useCallback((id) => {
    setVisible(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleClose = useCallback((id) => (event, reason) => {
    if (reason === 'clickaway') return;
    removeVisible(id);
  }, [removeVisible]);

  const handleAction = useCallback((id, action) => () => {
    try {
      if (typeof action === 'function') action();
    } catch (err) {
      console.error('Notification action error', err);
    }
    removeVisible(id);
  }, [removeVisible]);

  useEffect(() => {
    const onResize = () => {
      setVisible(prev => [...prev]);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const baseOffset = 12;
  const spacing = 72;

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {visible.map((item, idx) => {
        const displayMessage = item.count > 1 ? `${item.message} (x${item.count})` : item.message;

        if (isMobile) {
          const topOffset = baseOffset + idx * spacing;
          return (
            <Snackbar
              key={item.id}
              open
              autoHideDuration={item.duration}
              onClose={handleClose(item.id)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              style={{ top: `calc(env(safe-area-inset-top, 0px) + ${topOffset}px)`, zIndex: 1400, position: 'fixed' }}
            >
              <Alert
                onClose={handleClose(item.id)}
                severity={item.type}
                sx={{ width: '100%' }}
                action={
                  item.actionText ? (
                    <Button color="inherit" size="small" onClick={handleAction(item.id, item.action)}>
                      {item.actionText}
                    </Button>
                  ) : null
                }
              >
                {displayMessage}
              </Alert>
            </Snackbar>
          );
        } else {
          const bottomOffset = baseOffset + idx * spacing;
          return (
            <Snackbar
              key={item.id}
              open
              autoHideDuration={item.duration}
              onClose={handleClose(item.id)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              style={{ bottom: `${bottomOffset}px`, zIndex: 1400, position: 'fixed' }}
            >
              <Alert
                onClose={handleClose(item.id)}
                severity={item.type}
                sx={{ width: '100%' }}
                action={
                  item.actionText ? (
                    <Button color="inherit" size="small" onClick={handleAction(item.id, item.action)}>
                      {item.actionText}
                    </Button>
                  ) : null
                }
              >
                {displayMessage}
              </Alert>
            </Snackbar>
          );
        }
      })}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context.notify;
};