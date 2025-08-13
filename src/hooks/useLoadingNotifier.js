import { useCallback } from "react";
import { useNotification } from "../components/reusables/NotificationContext";
import { useLoading } from "../components/reusables/LoadingContext";

/**
 * useLoadingNotifier devuelve un executor que:
 *  -arranca el spinner
 *  -llama a tu función async
 *  -dispara success o error con notify
 *  -para el spinner al final
 * @param {Function} fn           – función async (login, getList, lo que sea)
 * @param {Object} options
 * @param {string} [options.successMsg] – mensaje por defecto al resolver
 * @param {string} [options.errorMsg]   – mensaje fallback si err.message está vacío
 * @param {Function} [options.onSuccess] – callback opcional tras éxito
 * @param {Function} [options.onError]   – callback opcional tras error
 * @returns {Function} executor        – función que ejecuta el flujo
 */
export function useLoadingNotifier(fn, {successMsg, errorMsg = 'Ha ocurrido un error', onSuccess, onError} = {}) {
    const notify = useNotification();
    const {start, finish} = useLoading();


    return useCallback(async (...args) => {
        start();
        try {
            const result = await fn(...args);
            if(successMsg) notify('success', successMsg);
            onSuccess?.(result);
            return result;
        } catch (error) {
            console.log('error del hook')
            console.log(error)
            onError?.(error);
            notify('error', error.message || errorMsg);
            throw error
        } finally {
            finish();
        }
    }, [fn, notify, start, finish, successMsg, errorMsg, onSuccess, onError]);
}