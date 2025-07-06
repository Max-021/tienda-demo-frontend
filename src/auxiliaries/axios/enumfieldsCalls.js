import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { ENUMS_ROUTE } from "./endpoints/base";
import * as enumsRoutes from './endpoints/enumEndpoints';

const get =     (path = "", config) => axiosClient.get(`${ENUMS_ROUTE}${path}`, config);
const post =    (path = "", data, config) => axiosClient.post(`${ENUMS_ROUTE}${path}`, data, config);
const patch =   (path = "", data, config) => axiosClient.patch(`${ENUMS_ROUTE}${path}`, data, config)

export const getFilterData = () => callAPI(() => get(enumsRoutes.GET_FILTER_DATA, {withCredentials: false}));

export const getEnumList = () => callAPI(() => get());

export const uploadEnumField = (enumData) => callAPI(() => post("",enumData));

//tiene que ser values
export const updateEnumList = (enumId, enumList) => callAPI(() => patch(`${enumId}`,{values: enumList}));