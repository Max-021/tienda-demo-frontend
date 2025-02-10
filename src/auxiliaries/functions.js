//Este archivo tiene funciones que pueden servir para varias cosas

export const remakeObj = (toBeConverted) => {
    const convertArr = Object.keys(toBeConverted)
    const newObj = {}
    for(const val in convertArr) {
        if(Array.isArray(toBeConverted[convertArr[val]].type)) {
            newObj[convertArr[val]] = []
        }else {
            newObj[convertArr[val]] = ''
        }
    }
    return newObj;
}//check if the value of the key is an array and then declare it as an empty array []

export const catchErrorMsgHandler = (err) => {
    if (err.response) {
        // console.error("Error de respuesta del servidor", err.response.data);
        return {
            success: false,
            status: err.response.status,
            message: err.response.data.message || "Unknown error",
        };
    } else {
        console.error("Error no relacionado con la respuesta del servidor", err.message);
        return {
            success: false,
            message: "No se pudo conectar al servidor",
        };
    }
}