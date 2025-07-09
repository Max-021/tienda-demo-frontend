import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { PRODUCTS_ROUTE } from "./endpoints/base";
import * as productRoutes from "./endpoints/productEndpoints";
import { makeFormData } from "../functions";

const get = (path = "", config) => axiosClient.get(`${PRODUCTS_ROUTE}${path}`, config);
const post = (path = "", data, config) => axiosClient.post(`${PRODUCTS_ROUTE}${path}`, data, config);//temporal, revisar como usar esto en el upload
const update = (path = "", data, config) => axiosClient.patch(`${PRODUCTS_ROUTE}${path}`, data, config);//tambien ver como usarlo en el updateproduct
const deleteCall = (path = "", config) => axiosClient.delete(`${PRODUCTS_ROUTE}${path}`, config);

export const getAllProducts = () => callAPI(() => get("", {withCredentials: false}));

export const getProductsByEditorFilter = (filterOps) => callAPI(() => get(``, {withCredentials: false, params: filterOps}));

export const getProductModel = () => callAPI(() => get(productRoutes.PROD_MODEL));

export const getProductById = (id) => callAPI(() => get(`${productRoutes.EXISTING}/${id}`, {withCredentials: false}));

export const uploadProduct = (productData) => callAPI(() => {
    console.log(productData)
    const formData = makeFormData(productData);

    return axiosClient.post(`${PRODUCTS_ROUTE}`, formData, {headers: {'Content-Type':'multipart/form-data'}})
});
export const updateProduct = (productData) => callAPI(() => {
    const {img, removedImages = [], _id, ...rest} = productData;
    const formData = makeFormData(rest);
    
    if(removedImages.length > 0){
        formData.append('removedImages', JSON.stringify(removedImages));
    }
    const imgOrder = img.map(item =>
        typeof item === 'string' ? item : item.name
    );
    formData.append('imgOrder', JSON.stringify(imgOrder));

    productData.img
        .filter(i => typeof i !== 'string')
        .forEach(file => {
            formData.append('newImages', file, file.name);
        });
    
    console.log(formData)
    console.log(productData)
    return axiosClient.patch(`${PRODUCTS_ROUTE}${productRoutes.EXISTING}/${productData._id}`, formData, {headers: {'Content-Type':'multipart/form-data',}})//temporal revisar formdata/productdata
});

export const updateProductsToNewSimpleField = (oldNewField) => callAPI(() => update(productRoutes.CHANGE_SIMPLE_FIELD, oldNewField));

export const updateProductsToNewArray = (oldNewArr) => callAPI(() => update(productRoutes.CHANGE_ARRAY_FIELD, oldNewArr));

export const updateProductsToNewSubDoc = (oldNewArr) => callAPI(() => update(productRoutes.CHANGE_SUBDOC_FIELD, oldNewArr))

export const deleteProduct = (productData) => callAPI(() => deleteCall(`${productRoutes.EXISTING}/${productData._id}`));