//Este archivo tiene funciones que pueden servir para varias cosas

export const remakeObj = (modelDesc) => {
  const newObj = {}
  for (const key of Object.keys(modelDesc)) {
    if (modelDesc[key].type === 'Array') {
      newObj[key] = []
    } else {
      newObj[key] = ''
    }
  }
  return newObj
}

export const catchErrorMsgHandler = (err) => {
    if (err.response) {
        // console.error("Error de respuesta del servidor", err.response.data);
        return {
            success: false,
            status: err.response.status,
            message: err.response.data.message || "Error de red o del servidor",
        };
    } else {
        console.error("Error no relacionado con la respuesta del servidor", err.message);
        return {
            success: false,
            message: "No se pudo conectar al servidor",
        };
    }
}
export const callAPI = async (func) => {
    try {
        const res = await func();
        return {
            status: true,
            data: res.data.data,
        }
    } catch (error) {
        throw error;
    }
}

export const makeFormData = (obj) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'img' && Array.isArray(value)) {
      value.forEach(file => {
        if (file instanceof File) {
          formData.append('newImages', file, file.name);
        }
      });
    } else if (Array.isArray(value) || (value && typeof value === 'object')) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};