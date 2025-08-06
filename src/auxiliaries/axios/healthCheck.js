import axiosClient from "./axiosClient";
import { callAPI } from "../functions";

export const checkServer = () => callAPI(() => axiosClient.get(`healthcheck`)
                                                .then(result => ({status: result.status, code: result.statusCode})))