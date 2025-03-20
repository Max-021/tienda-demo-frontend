import axios from "axios";
import { catchErrorMsgHandler } from "./functions";

//TEMPORAL, fijarse si lo que está comentado siguiente lo dejo, revisar porque si esta activo tira error el CORS
// axios.defaults.withCredentials = true;//pasado como objeto de config en las funciones necesarias

const apiUrl = 'https://shoptemplateserver.onrender.com/'//temporal, poner valor final aca <-----------------CAMBIAR PARA PRODUCTO FINAL

//temporal, revisar que las rutas sean https y no http para el deploy
const apiSource = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/api/v1' : apiUrl;

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
        console.log(res.data.data)//temporal ver que hago cuando si se inicia sesion
        alert('inicio correcto!');
        return {
            user: res.data.data,
            status: true,
        }
    } catch (error) {
        console.log('An error occurred '+error)
    }
}
export const logout = async () => {
    try {
        const res = await axios.get(`${apiSource}${userBasics}/logout`,credObj())//revisar y hacer algo bien con los dos casos, temporal
        window.location.reload();
        return {
            success: true,
            data: res.data,
        }
    } catch (err) {
        return catchErrorMsgHandler(err)
    }
}

export const signup = async (username,mail,password) => {//temporal, ver si agrego algo más
    await axios.post(`${apiSource}${userBasics}/signup`,{username, mail, password,});
}

export const checkSession = async () => {
    try {
        const res = await axios.get(`${apiSource}${userBasics}/checkSession`, credObj());
        return {
            success: true,
            message: res.data.message, // Los datos del servidor
            status: res.data.status,
        };
    } catch (err) {
        return catchErrorMsgHandler(err)
    }
}
export const updateUser = async () => {

}
export const deleteUser = async () => {
    // try {
    //     // const res = await axios.delete(`${apiSource}${userRoute}/`)
    // } catch (error) {
    //     console.log(error)
    // }
}
export const updatePassword = async () => {
    //IMPORTANTE COMPLETAR ------------------------------------------------------------------
}
export const retryPassword = async () => {
    //IMPORTANTE COMPLETAR ------------------------------------------------------------------
}
export const passwordForgotten = async () => {
    await axios.post(`${apiSource}${userRoute}/passwordForgotten`);

}
export const getUserInfo = async (userId) => {
    try {
        const res = await axios.get(`${apiSource}${userRoute}/userInfo`,credObj())
        return res.data.data
    } catch (error) {
        console.log(error)
    }
}
export const listUsers = async () => {
    try {
        const res = await axios.get(`${apiSource}${userRoute}/usersList`, credObj())
        console.log('res del listusers')
        console.log(res.data.data)
        return res.data.data
    } catch (error) {
        console.log(error)
    }
}


//------------------    PRODUCTOS    -------------------------------------------------------------------------------------------------------------------------------//

//product related, temporal, falta revisar que se puedan actualizar y borrar productos, por ahora solo se piden uno o todos y se pueden crear -> C.R hechos, falta U.D
export const getAllProducts = async () => {
    var catalogo = []
    await axios.get(`${apiSource}${productsRoute}/`,credObj(false))
    .then(res => {
        catalogo = res.data.data
        return catalogo
    })
    .catch(err => console.log("an error occurred "+err))

    return catalogo;
}

export const getProductModel = async () => {
    var prodMod = {};

    await axios.get(`${apiSource}${productsRoute}/one`,credObj())//temporal, completar, esto deberia devolver un modelo para despues construir el formulario
    // await axios.get(`${apiSource}${productsRoute}/one`,{withCredentials: false})//temporal, completar, esto deberia devolver un modelo para despues construir el formulario
    .then(res => {
        const reducedModel = (({updated_at,created_at, ...rest}) => rest)(res.data.data)
        prodMod =reducedModel
        // prodMod = res.data.data
    })
    .catch(err => console.log('an error occurred'+err))
    //pido los datos de los enumFields para el formulario


    return prodMod;
}

export const uploadProduct = async(productData) => {
    alert('uploading!')
    console.log(productData)
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('descr', productData.descr);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('quantity', productData.quantity);
    formData.append('colors', JSON.stringify(productData.colors));

    productData.img.forEach((file,index) => {
        console.log(`archivo: ${file.name} tipo: ${file.type}`)
        formData.append('img', file,file.name)
    });

    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ')
        console.log(pair[1]); 
    }
    await axios.post(`${apiSource}${productsRoute}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Esto es esencial para enviar archivos
           
        },
        ...credObj()
    })
    // await axios.post(`${apiSource}${productsRoute}`,productData,credObj())
    .then(res=>{
        console.log(res)//temporal, revisar esto
    })
    .catch(err => console.log('an error occurred'+err))
}

export const updateProduct = async(productData) => {
    try {
        alert('uploading!')
        console.log(productData)
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
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ')
            console.log(pair[1]); 
        }
        console.log(productData._id)
        console.log(productData)
        await axios.patch(`${apiSource}${productsRoute}/${productData._id}`, productData, { headers: { 'Content-Type': 'multipart/form-data',}, ...credObj() });
        // alert("hacer algo para indicar una edicion exitosa")        
    } catch (error) {
        console.log(error)
    }
}

export const updateProductsToNewSimpleField= async (oldNewField) => {
    try {
        await axios.patch(`${apiSource}${productsRoute}/changedSimpleField`,oldNewField , credObj());
    } catch (error) {
        console.log(error)
    }
}
export const updateProductsToNewArray = async (oldNewArr) => {
    try {
        await axios.patch(`${apiSource}${productsRoute}/changedArrayField`,oldNewArr , credObj());
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (productData) => {
    try {
        await axios.delete(`${apiSource}${productsRoute}/${productData._id}`,credObj())
    } catch (error) {
        console.log(error)
    }

} 
//------------------    ENUM FIELDS    -------------------------------------------------------------------------------------------------------------------------------//

//enumRelated for validation on specific fields, temporal, falta revisar que se puedan borrar bien los enums
export const getCategoriesList = async () => {
    try {
        const res = await axios.get(`${apiSource}${enumRoute}/filterData`)
        return res.data.data;
    } catch (error) {
        console.log(error)
    }
}

export const getEnumList = async () => {
    var enumData = {}
    await axios.get(`${apiSource}${enumRoute}/`,credObj())
    // await axios.get(`${apiSource}${enumRoute}/`,{withCredentials: false})
    .then(res => {
        enumData = res.data.data[0]
    })
    .catch(err => console.log('an error occurred'+err))

    return enumData;

}

export const uploadEnumField = async(enumData) => {
    await axios.post(`${apiSource}${enumRoute}`,enumData,credObj())
    // await axios.post(`${apiSource}${enumRoute}`,enumData,{withCredentials:false})
    .then(res=>{
        console.log(res)//temporal, revisar
    })
    .catch(err => console.log('an error ocurred'+err))
}