const apiUrl = import.meta.env.VITE_API_URL;//temporal, poner valor final aca <-----------------CAMBIAR PARA PRODUCTO FINAL
const localUrl = 'http://localhost:9000/api/v1';
export const API_BASE = import.meta.env.MODE === 'production' ? apiUrl : localUrl;

export const USERS_ROUTE = 'user/';
export const USERBASICS_ROUTE = 'userBasics/';
export const PRODUCTS_ROUTE = 'products/';
export const ENUMS_ROUTE = 'enumFields/';
export const CAPTCHA_ROUTE = 'captcha/'