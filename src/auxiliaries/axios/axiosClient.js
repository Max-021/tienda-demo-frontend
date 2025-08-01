import axios from 'axios';
import { catchErrorMsgHandler } from '../functions';
import { API_BASE } from './endpoints/base';

const fallbackUrl = '/'//tengo que poner algo para los casos en los que no haya una api cargada

const axiosClient = axios.create({
    baseURL: API_BASE || fallbackUrl,
    withCredentials: true,
    timeout: 10000,//revisar como reajustar esto para cuando el servidor está muy lento
    headers: { 
        'Content-Type': 'application/json', 
        'Accept-Language': 'es',
    },
})

// axiosClient.interceptors.request.use(config => {//lo dejo comentado porque ya lo pongo en el axiosClient, pero podría servir más adelante
//   config.headers['Accept-Language'] = 'es';
//   return config;
// });

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error.response.data);
    }
)

export default axiosClient;