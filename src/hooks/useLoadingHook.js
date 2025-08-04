import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useFetch: hook genérico para llamadas async
 * @param {Function} fn    - función asíncrona que devuelve una promesa (ej: getAllProducts)
 * @param {Array} args     - array de argumentos a pasar a fn
 * @param {Object} options - opcional: { immediate: boolean }
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */

export function useLoadingHook(fn, args = [], options = {immediate: true}) {
    const {immediate} = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const mounted = useRef(null);

    // fetchData encapsula la lógica de llamada y delay
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fn(...args);
            if (mounted.current) {
                setData(res.data || res);
                setError(null);
            }
        } catch (err) {
            if (mounted.current) setError(err.message || 'Error al cargar datos');
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [fn, immediate, ...args]);

    useEffect(() => {
        mounted.current = true;
        if (immediate) {
            fetchData();  // Ejecuta la llamada inicial
        }
        return () => {
            mounted.current = false;
        };
    }, [fetchData, immediate]);

    return { data, loading, error, refetch: fetchData };
}