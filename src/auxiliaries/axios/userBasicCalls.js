import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import  { USERBASICS_ROUTE } from "./endpoints/base";
import * as userRoutes from "./endpoints/userEndpoints";

const noCredentials = {withCredentials: false}
const get = (path = "", config) => axiosClient.get(`${USERBASICS_ROUTE}${path}`, config);
const post = (path = "", data, config) => axiosClient.post(`${USERBASICS_ROUTE}${path}`, data, config);
const update = (path = "", data, config) => axiosClient.patch(`${USERBASICS_ROUTE}${path}`, data, config);
const deleteCall = (path = "", config) => axiosClient.delete(`${USERBASICS_ROUTE}${path}`, config);

//IMPORTANTE, esta funcion si bien va por userBasics puede o no estar habilitada segun se pida, la que siempre funciona es la que va por userRoutes
export const signup = (newUser) => callAPI(() => post(userRoutes.SIGNUP, newUser));

export const login = (userData) => callAPI(() =>  post(userRoutes.LOGIN, userData));
export const logout = () => callAPI(() =>  get(userRoutes.LOGOUT));

export const checkSession = () => callAPI(() => get(userRoutes.SESSION_CHECK));

export const passwordForgotten = (mail) => callAPI(() => post(userRoutes.PWD_FORGOTTEN, {mail}, noCredentials));

export const resetPassword = (newPwd, token) => callAPI(() => update(`${userRoutes.RESET_PWD}/${token}`, newPwd));

export const validateResetToken = (token) => callAPI(() => get(`${userRoutes.VALIDATE_RESET_TOKEN}/${token}`,noCredentials));

export const validateResetPassword = (pwd, token) => callAPI(() => post(`${userRoutes.VALIDATE_PASSWORD_RESET}/${token}`, {...pwd}))