import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { CAPTCHA_ROUTE } from "./endpoints/base";
import * as captchaRoutes from './endpoints/captchaEndpoints';

const get =     (path = "", config) => axiosClient.get(`${CAPTCHA_ROUTE}${path}`, config);
const post =    (path = "", data, config) => axiosClient.post(`${CAPTCHA_ROUTE}${path}`, data, config);
const patch =   (path = "", data, config) => axiosClient.patch(`${CAPTCHA_ROUTE}${path}`, data, config);

export const verifyCaptcha = (captchaToken) => callAPI(() => post(captchaRoutes.VERIFY_CAPTCHA,captchaToken, {withCredentials: false}));