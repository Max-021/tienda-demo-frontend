import { useState, useEffect } from 'react';

/**
 * Devuelve el valor “debounced”: sólo cambiasa pasados `delay` ms
 */
export function useDebounce(value, delay = 750) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
