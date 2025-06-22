import axiosClient from "./axiosClient";
import { callAPI } from "../functions";
import { PRODUCTS_ROUTE } from "./endpoints/base";
import * as productRoutes from "./endpoints/productEndpoints";

const get = (path = "", config) => axiosClient.get(`${PRODUCTS_ROUTE}${path}`, config);
const post = (path = "", data, config) => axiosClient.post(`${PRODUCTS_ROUTE}${path}`, data, config);//temporal, revisar como usar esto en el upload
const update = (path = "", data, config) => axiosClient.patch(`${PRODUCTS_ROUTE}${path}`, data, config);//tambien ver como usarlo en el updateproduct
const deleteCall = (path = "", config) => axiosClient.delete(`${PRODUCTS_ROUTE}${path}`, config);

export const getAllProducts = () => callAPI(() => get("", {withCredentials: false}));

export const getProductModel = () => callAPI(() => get(productRoutes.PROD_MODEL));

export const uploadProduct = (productData) => callAPI(() => {
    console.log(productData)
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('descr', productData.descr);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity);
    formData.append('colors', JSON.stringify(productData.colors));

    productData.img.forEach((file,index) => {
        formData.append('img', file,file.name)
    });
    return axiosClient.post(`${PRODUCTS_ROUTE}`, formData, {headers: {'Content-Type':'multipart/form-data'}})
});
export const updateProduct = (productData) => callAPI(() => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('descr', productData.descr);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity);
    formData.append('colors', JSON.stringify(productData.colors));

    if(productData.removedImages.length > 0){
        formData.append('removedImages', JSON.stringify(productData.removedImages));
    }

    const imgOrder = productData.img.map(item =>
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
    return axiosClient.patch(`${PRODUCTS_ROUTE}${productData._id}`, formData, {headers: {'Content-Type':'multipart/form-data',}})//temporal revisar formdata/productdata
});

export const updateProductsToNewSimpleField = (oldNewField) => callAPI(() => update(productRoutes.CHANGE_SIMPLE_FIELD, oldNewField));

export const updateProductsToNewArray = (oldNewArr) => callAPI(() => update(productRoutes.CHANGE_ARRAY_FIELD, oldNewArr));

export const deleteProduct = (productData) => callAPI(() => deleteCall(`${productData._id}`));