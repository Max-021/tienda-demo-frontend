const apiUrl = 'https://shoptemplateserver.onrender.com/api/v1/';//temporal, poner valor final aca <-----------------CAMBIAR PARA PRODUCTO FINAL
const localUrl = 'http://localhost:9000/api/v1';
export const API_BASE = process.env.NODE_ENV === 'development' ? localUrl : apiUrl;

export const USERS_ROUTE = 'user/';
export const USERBASICS_ROUTE = 'userBasics/';
export const PRODUCTS_ROUTE = 'products/';
export const ENUMS_ROUTE = 'enumFields/';