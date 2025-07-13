import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { USERS_ROUTE } from "./endpoints/base";
import * as userRoutes from "./endpoints/userEndpoints";

const get = (path = "", config) => axiosClient.get(`${USERS_ROUTE}${path}`, config);
const post = (path = "", data, config) => axiosClient.post(`${USERS_ROUTE}${path}`, data, config);
const update = (path = "", data, config) => axiosClient.patch(`${USERS_ROUTE}${path}`, data, config);
const deleteCall = (path = "", config) => axiosClient.delete(`${USERS_ROUTE}${path}`, config);

export const createUser = (newUser) => callAPI(() => post(userRoutes.CREATE_USER, newUser));

export const updateUser = (updatedData) => callAPI(() => update(`${userRoutes.UPDATE_ME}/${updatedData._id}`, updatedData));

export const deleteUser = (userId) => callAPI(() => deleteCall(`${userRoutes.DELETE_USER}/${userId}`));

export const deactivateUser = (userId) => callAPI(() => update(`${userRoutes.DEACTIVATE_USER}/${userId}`, {userId}));

export const updatePassword = (pwdData) => callAPI(() => update(userRoutes.CHANGE_PWD, {password: pwdData.password, newPassword: pwdData.newPassword, newPasswordConfirm: pwdData.confirmNewPassword}));

export const retryPassword = () => callAPI(() => post());//temporal, completar

export const getUserInfo = (userId) => callAPI(() => get(`${userRoutes.USER_INFO}/${userId}`));

export const listUsers = () => callAPI(() => get(userRoutes.USERS_LIST));

export const toggleSuspension = (user) => callAPI(() => update(userRoutes.TOGGLE_SUSPENSION, user));

export const setNewUserRole = (user, newRole) => callAPI(() => update(userRoutes.CHANGE_ROLE, {...user, role: newRole}));

export const getRolesList = () => callAPI(() => get(userRoutes.ROLES_LIST));

export const validatePasswordStatus = (pwd) => callAPI(() => post(userRoutes.VALIDATE_PASSWORD, {...pwd}))