import { useState, useEffect } from 'react';
import { validatePasswordStatus } from '../auxiliaries/axios/userAdvancedCalls';

export function usePasswordServerCheck(password) {
  const [state, setState] = useState({
    loading: false,
    isValid: false,
    error: null,
  });

  useEffect(() => {
    // Si no hay contraseña, reseteamos
    if (!password) {
      setState({ loading: false, isValid: false, error: null });
      return;
    }

    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    validatePasswordStatus({ password })
    .then(() => {
        if (!cancelled) {
          setState({ loading: false, isValid: true, error: null });
        }
      })
      .catch(err => {
        const msgs = err.response?.data?.errors || [err.message];
        setState({
          loading: false,
          isValid: false,
          error: msgs.join('; '),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [password]);

  return state;
}
