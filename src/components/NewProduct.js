import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import FormGenerator from './FormGenerator/FormGenerator';
import EnumFieldsManager from './FormGenerator/EnumFieldsManager';

import {getEnumList, getProductModel, uploadProduct, updateProduct, deleteProduct} from '../auxiliaries/axiosHandlers'
import { remakeObj } from '../auxiliaries/functions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import { MdDeleteOutline } from "react-icons/md";

const NewProduct = () => {

    const location = useLocation();
    const [productModel,setProductModel] = useState({})
    const [locRoute, setLocRoute] = useState('')
    const [enumFields,setEnumFields] = useState({})
    const [newProduct,setNewProduct] = useState({})
    const [updateEnumList,setUpdateEnumList] = useState(false);

    useEffect(()=> {
        const fetchSingleData = async () => {
            const modelValue = await getProductModel();
            const enumList = await getEnumList();
            setProductModel(modelValue)//temporal, ahora prod mod no da el primer doc de la coleccion, da el modelo, tengo que revisar como trasladar esto bien al form
            setEnumFields(enumList);
            //temporal, ver si dejo esto acá o lo pongo abajo de la llamada de la funcion
            if(location.pathname === '/editar-producto'){//aca agregar que si viene por /editar-producto el set newProduct lo haga con el producto ya puesto, temporal
                setNewProduct(location.state)
            }else{
                setNewProduct(remakeObj(modelValue));
            }
        }
        fetchSingleData();
    }, [])
    useEffect(() => {
        setLocRoute(location.pathname)
    }, [location])
    useEffect(() => {
        const fetchNewEnumList = async () =>{
            const newValues = await getEnumList();
            setEnumFields(newValues);
        }
        setUpdateEnumList(false)
        fetchNewEnumList();
    },[updateEnumList]);

    const submitProduct = async (e) => {
        e.preventDefault();

        if(location.pathname === '/editar-producto'){//temporal ver como refactorizar este if con el de useEffect, o al menos la condicion
            updateProduct(newProduct);
        }else{
            const prodWithImgDef= newProduct;
            prodWithImgDef.img = ['test.jpg']//sacar esto, es para un soft default value
            alert('uploading!')
            setNewProduct(prodWithImgDef);
            uploadProduct(newProduct)
        }
    }
    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleChangeOnArray = (e) => {
        //aca hacer que si el campo es un arreglo se haga un push con los datos, si no es un array que lo cree
        if(!newProduct[e.target.name].includes(e.target.value)){
            const newColors = [...newProduct[e.target.name],e.target.value]
            setNewProduct({...newProduct,[e.target.name]: newColors})
            console.log('sivale')
        }
        console.log(newProduct[e.target.name])
    }

  return (
    <div className='newProductContainer'>
        <Box component='form' onSubmit={submitProduct}>
            <div>
                <p>{locRoute === '/nuevo-producto' ? 'Nuevo' : 'Editar'} producto</p>
                {locRoute === '/editar-producto' && <button title='Eliminar producto' onClick={() => deleteProduct(newProduct)}><MdDeleteOutline/></button>}
            </div>
            {Object.keys(productModel).map((el,index) => {
                if (!el.startsWith('_')) {// temporal, aca hacer que el return devuelva los inputs, llevar el codigo del input a otro archivo para que no se haga muy largo???Factorizar???
                    return (
                        <div key={index}>
                            <FormGenerator key={index} modelKey={el}
                                enumValues={enumFields[el]?enumFields[el]:null} 
                                handleChange={Array.isArray(productModel[el].type)?handleChangeOnArray:handleChange} 
                                currentNewProdField={newProduct[el]} />
                            {Array.isArray(productModel[el].type)?<div>
                                {newProduct[el].map((arrayEl, index) => {
                                    return <p key={index}>{arrayEl}</p>
                                })}
                            </div>:null}
                        </div>
                    )
                }else{
                    return null;//temporal, revisar este return
                }
            })}
            <Button className='submitBtn' type='submit'>Subir</Button>
        </Box>
        <Box>
            <h2>Campos con valores fijos</h2>
            {Object.keys(enumFields).map((el, index) => {
                if (!el.startsWith('_')) {
                    return <EnumFieldsManager key={index} dataField={enumFields[el]} enumName={el} updateList={setUpdateEnumList}/>
                }else{
                    return null;//temporal, revisar este return
                }
            })}
        </Box>
    </div>
  )
}

export default NewProduct