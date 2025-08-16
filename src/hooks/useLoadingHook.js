import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useLoadingHook: hook genérico para llamadas async
 * fn: función async que devuelve una promesa (ej: getEnumList)
 * args: array de argumentos a pasar a fn (siempre que sean serializables o memoizados)
 * options: { immediate: boolean }
 */
export function useLoadingHook(fn, args = [], options = { immediate: true }) {
    const { immediate } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(immediate));
    const [error, setError] = useState(null);
    const mounted = useRef(false);

    let argsKey;
    try {
        argsKey = JSON.stringify(args);
    } catch (err) {
        argsKey = String(args);
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await fn(...args);
        if (mounted.current) {
            setData(res);
            setError(null);
        }
        return res;
        } catch (err) {
            if (mounted.current) {
                setError(err.message || 'Error al cargar datos');
            }
            throw err;
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, [fn, argsKey]);

    useEffect(() => {
        mounted.current = true;
        if (immediate) {
            fetchData().catch(() => { /* el estado de error ya fue seteado dentro */ });
        }
        return () => {
            mounted.current = false;
        };
    }, [fetchData, immediate]);

    return { data, loading, error, refetch: fetchData };
}   