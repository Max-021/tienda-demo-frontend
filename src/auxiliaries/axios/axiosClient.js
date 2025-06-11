import axios from 'axios';
import { catchErrorMsgHandler } from '../functions';
import { API_BASE } from './endpoints/base';

const fallbackUrl = '/'//tengo que poner algo para los casos en los que no haya una api cargada

const axiosClient = axios.create({
    baseURL: API_BASE || fallbackUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', },
    timeout: 10000,//revisar como reajustar esto para cuando el servidor está muy lento
})

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const info = catchErrorMsgHandler(error);
        return Promise.reject(info.message);
    }
)

export default axiosClient;