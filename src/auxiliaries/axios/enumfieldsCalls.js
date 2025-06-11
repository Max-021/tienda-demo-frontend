import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { ENUMS_ROUTE } from "./endpoints/base";
import * as enumsRoutes from './endpoints/enumEndpoints';

const get =     (path = "", config) => axiosClient.get(`${ENUMS_ROUTE}${path}`, config);
const post =    (path = "", data, config) => axiosClient.post(`${ENUMS_ROUTE}${path}`, data, config);

export const getCategoriesList = () => {
    return callAPI(() => get(enumsRoutes.GET_CATS_LIST, {withCredentials: false}));
}

export const getEnumList = () => {
    return callAPI(() => get());
}

export const uploadEnumField = (enumData) => {
    return callAPI(() => post("",enumData))
}