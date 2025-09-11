/*******************************************IMPORTANTE
todo lo que esta acá fue reescrito de una mejor manera, por eso este archivo esta en otro lugar,
lo dejo como referencia para futuras modificaciones/correcciones

*/

import axios from "axios";
import { catchErrorMsgHandler } from "./functions";

import { excludedFields } from "../data/permissions";
import { omit } from "lodash";


const apiUrl = 'https://shoptemplateserver.onrender.com/api/v1'

const apiSource = import.meta.env.MODE === 'development' ? 'http://localhost:9000/api/v1' : apiUrl;

const userRoute = '/user' 
const productsRoute = '/products'
const enumRoute = '/enumFields'
const userBasics = '/userBasics'

const credObj = (credVal = true) => {
    return {
        withCredentials: credVal,
    }
}

//------------------    USUARIOS    -------------------------------------------------------------------------------------------------------------------------------//

//user related, agregar {withCredentials: true} donde corresponda
export const login = async (mail, password) => {
    try {
        const res = await axios.post(`${apiSource}${userBasics}/login`,{mail, password},{withCredentials: true})
        // document.cookie = `jwt=${res.cookie}; path=/; secure; samesite=strict; max-age=86400`;
        alert('inicio correcto!');
        return {
            user: res.data.data,
            status: true,
        }
    } catch (error) {
    }
}
export const logout = async () => {
    try {
        const res = await axios.get(`${apiSource}${userBasics}/logout`,credObj())
        window.location.reload();
        return {
            success: true,
            data: res.data,
        }
    } catch (err) {
        return catchErrorMsgHandler(err)
    }
}
export const signup = async (newUser) => {
    try {
       const res = await axios.post(`${apiSource}${userBasics}/signup`,newUser);
       return res;
    } catch (error) {
        return catchErrorMsgHandler(error)        
    }
}
export const createUser = async (newUser) => {
    try {
        const res = await axios.post(`${apiSource}${userRoute}/createUser`,newUser, credObj())
        return res;
    } catch (error) {
        return catchErrorMsgHandler(error);
    }
}
export const checkSession = async () => {
    try {
        const res = await axios.get(`${apiSource}${userBasics}/checkSession`, credObj());
        return {
            success: true,
            message: res.data.message, // Los datos del servidor
            status: res.data.status,
            userInfo: {role: res.data.userInfo.role || 'none', username: res.data.userInfo.username || ''}
        };
    } catch (err) {
        return catchErrorMsgHandler(err)
    }
}
export const updateUser = async (updatedData) => {
    try {
        const res = await axios.patch(`${apiSource}${userRoute}/updateMe/${updatedData._id}`, updatedData, credObj());
    } catch (err) {
        return catchErrorMsgHandler(err);
    }

}
export const deleteUser = async () => {
    // try {
    //     // const res = await axios.delete(`${apiSource}${userRoute}/`)
    // } catch (error) {
    // }
}
export const updatePassword = async (pwdData) => {
    const pwdChangeInfo = {password: pwdData.password, newPassword: pwdData.newPassword, newPasswordConfirm: pwdData.confirmNewPassword}
    try {
        const res = axios.patch(`${apiSource}${userRoute}/changePassword`, pwdChangeInfo, credObj())
        
    } catch (err) {
        return catchErrorMsgHandler(err)
    }
    //IMPORTANTE COMPLETAR ------------------------------------------------------------------
}
export const retryPassword = async () => {
    //IMPORTANTE COMPLETAR ------------------------------------------------------------------
}
export const passwordForgotten = async (mail) => {
    try {
        const res = await axios.post(`${apiSource}${userBasics}/passwordForgotten`, {mail});
        return res;
    } catch (error) {
        return catchErrorMsgHandler(error)
    }
}
export const resetPassword = async (newPwd, token) => {
    try {
        return await axios.patch(`${apiSource}${userBasics}/resetPassword/${token}`,newPwd);
    } catch (error) {
        const msg = catchErrorMsgHandler(error)
        throw new Error(msg)
    }
}
export const validateResetToken = async (token) => {
    try {
        const res = await axios.get(`${apiSource}${userBasics}/validateResetToken/${token}`);
        return res;
    } catch (error) {
        const msg = catchErrorMsgHandler(error);
        throw new Error(msg);
    }
}
export const getUserInfo = async (userId) => {
    try {
        const res = await axios.get(`${apiSource}${userRoute}/userInfo`,credObj())
        const userInfo = omit(res.data.data, excludedFields);
        return userInfo;
    } catch (error) {
    }
}
export const listUsers = async () => {
    try {
        const res = await axios.get(`${apiSource}${userRoute}/usersList`, credObj())
        return res.data.data
    } catch (error) {
    }
}
export const toggleSuspension = async (user) => {
    try {
        const userToSuspend = user
        axios.patch(`${apiSource}${userRoute}/toggleSuspension`, userToSuspend, credObj());
    } catch (error) {
        catchErrorMsgHandler(error);
    }
}
export const setNewUserRole = async (user, newRole) => {
    try {
        const userToUpdate = {...user, role: newRole}
        axios.patch(`${apiSource}${userRoute}/changeRole`, userToUpdate, credObj());
    } catch (error) {
        catchErrorMsgHandler(error);
    }

}
export const getRolesList = async () => {
    try {
        const res = await axios.get(`${apiSource}${userRoute}/rolesList`, credObj());
        return res.data.data.roles;
    } catch (error) {
        catchErrorMsgHandler(error)
    }
}

//------------------    PRODUCTOS    -------------------------------------------------------------------------------------------------------------------------------//
//productos HECHOS
export const getAllProducts = async () => {
    var catalogo = []
    await axios.get(`${apiSource}${productsRoute}/`,credObj(false))
    .then(res => {
        catalogo = res.data.data
        return catalogo
    })
    .catch(err => err)

    return catalogo;
}

export const getProductModel = async () => {
    var prodMod = {};

    await axios.get(`${apiSource}${productsRoute}/one`,credObj())
    .then(res => {
        const reducedModel = (({updated_at,created_at, ...rest}) => rest)(res.data.data)
        prodMod =reducedModel
        // prodMod = res.data.data
    })
    .catch(err => err)
    //pido los datos de los enumFields para el formulario


    return prodMod;
}

export const uploadProduct = async(productData) => {
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

    await axios.post(`${apiSource}${productsRoute}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Esto es esencial para enviar archivos
           
        },
        ...credObj()
    })
    // await axios.post(`${apiSource}${productsRoute}`,productData,credObj())
    .then(res=> res)
    .catch(err => err)
}

export const updateProduct = async(productData) => {
    try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('descr', productData.descr);
        formData.append('category', productData.category);
        formData.append('price', productData.price);
        formData.append('quantity', productData.quantity);
        formData.append('colors', JSON.stringify(productData.colors));

        productData.img.forEach((item) => {
            if (typeof item === 'string') {// Es una imagen existente (URL)
              formData.append('img', item);
            } else {// Es una imagen nueva (File)
              formData.append('img', item, item.name);
            }
          });
        await axios.patch(`${apiSource}${productsRoute}/${productData._id}`, productData, { headers: { 'Content-Type': 'multipart/form-data',}, ...credObj() });
        // alert("hacer algo para indicar una edicion exitosa")        
    } catch (error) {
        return error;
    }
}

export const updateProductsToNewSimpleField= async (oldNewField) => {
    try {
        await axios.patch(`${apiSource}${productsRoute}/changedSimpleField`,oldNewField , credObj());
    } catch (error) {
        return error;
    }
}
export const updateProductsToNewArray = async (oldNewArr) => {
    try {
        await axios.patch(`${apiSource}${productsRoute}/changedArrayField`,oldNewArr , credObj());
    } catch (error) {
        return error;
    }
}

export const deleteProduct = async (productData) => {
    try {
        await axios.delete(`${apiSource}${productsRoute}/${productData._id}`,credObj())
    } catch (error) {
        return error;
    }

} 
//------------------    ENUM FIELDS    -------------------------------------------------------------------------------------------------------------------------------//
//enum HECHOS
export const getCategoriesList = async () => {
    try {
        const res = await axios.get(`${apiSource}${enumRoute}/filterData`)
        return res.data.data;
    } catch (error) {
        return error;
    }
}

export const getEnumList = async () => {
    var enumData = {}
    await axios.get(`${apiSource}${enumRoute}/`,credObj())
    // await axios.get(`${apiSource}${enumRoute}/`,{withCredentials: false})
    .then(res => {
        enumData = res.data.data[0]
    })
    .catch(err => err)

    return enumData;

}

export const uploadEnumField = async(enumData) => {
    await axios.post(`${apiSource}${enumRoute}`,enumData,credObj())
    .then(res=> res)
    .catch(err => err);
}