import { useState, useEffect } from 'react';
import { validateResetPassword, validatePasswordStatus } from '../auxiliaries/axios';

/**
 * usePasswordServerCheck
 * @param {string} password - contraseña a validar (ya debounced desde el componente)
 * @param {Object} [opts]
 * @param {string} [opts.token] - si está presente se usa el endpoint de reset (no requiere sesión)
 */
export function usePasswordServerCheck(password, opts = {}) {
  const { token = null } = opts;

  const [state, setState] = useState({
    loading: false,
    isValid: false,
    error: null,
  });

  useEffect(() => {
    if (!password) {
      setState({ loading: false, isValid: false, error: null });
      return;
    }

    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    const callServer = async () => {
      try {
        if (token) {
          await validateResetPassword(password, token);
        } else {
          await validatePasswordStatus({ password });
        }

        if (!cancelled) setState({ loading: false, isValid: true, error: null });
      } catch (err) {
        if (cancelled) return;
        const msgs = err.response?.data?.errors || [err.response?.data?.message || err.message];
        setState({
          loading: false,
          isValid: false,
          error: Array.isArray(msgs) ? msgs.join('; ') : String(msgs),
        });
      }
    };

    callServer();

    return () => { cancelled = true; };
  }, [password, token]);

  return state;
}
