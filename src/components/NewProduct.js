import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import FormGenerator from './FormGenerator/FormGenerator';
import EnumFieldsManager from './FormGenerator/EnumFieldsManager';

import {getEnumList, getProductModel, uploadProduct, updateProduct, deleteProduct} from '../auxiliaries/axiosHandlers'
import { remakeObj } from '../auxiliaries/functions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import { MdDeleteOutline, MdOutlineClear } from "react-icons/md";

const NewProduct = () => {

    const location = useLocation();
    const [productModel,setProductModel] = useState({})
    const [locRoute, setLocRoute] = useState('')
    const [enumFields,setEnumFields] = useState({})
    const [newProduct,setNewProduct] = useState({})
    const [updateEnumList,setUpdateEnumList] = useState(false);
    // const [existingImages, setExistingImages] = useState(null)

    useEffect(()=> {
        const fetchSingleData = async () => {
            const modelValue = await getProductModel();
            const enumList = await getEnumList();
            setProductModel(modelValue)
            setEnumFields(enumList);
            //temporal, ver si dejo esto acá o lo pongo abajo de la llamada de la funcion
            if(location.pathname === '/editar-producto'){//aca agregar que si viene por /editar-producto el set newProduct lo haga con el producto ya puesto, temporal
                const productData = {...location.state};
                // const productData = {...location.state, img: []};
                // setExistingImages(location.state.img)
                setNewProduct(productData)

            }else setNewProduct(remakeObj(modelValue));
        }
        fetchSingleData();
    }, [location.pathname, location.state])//temporal, ojo aca! por si sale algun error por la falta de re-render cuando pasa algo con el objeto de productos
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
        //temporal ver como refactorizar este if con el de useEffect, o al menos la condicion
        if(location.pathname === '/editar-producto') updateProduct(newProduct);
        else uploadProduct(newProduct);
    }
    const handleChange = (e) => setNewProduct({ ...newProduct,[e.target.name]: e.target.value })//temporal, ojo aca! borrar comentario si no pasa nada

    const handleChangeOnArray = (e) => {
        console.log(e.target.name)
        console.log(newProduct[e.target.name])
        console.log(e.target.value)
        //aca hacer que si el campo es un arreglo se haga un push con los datos, si no es un array que lo cree
        if(!newProduct[e.target.name].includes(e.target.value)){
            const newColors = [...newProduct[e.target.name],e.target.value]
            setNewProduct({...newProduct,[e.target.name]: newColors})
            console.log('sivale')
        }
        console.log(newProduct[e.target.name])
    }
    const handleImgOnChange = (files) => {
        console.log(files)
        if (!files || files.length === 0) setNewProduct({...newProduct, img: []})
        else setNewProduct({...newProduct, img: files})
    };
    const deleteColor = (colorIndex) => setNewProduct({...newProduct, colors: newProduct.colors.filter((_,index) => index !== colorIndex)})

  return (
    <div className='newProductContainer'>
        <Box component='form' onSubmit={submitProduct} className='productForm'>
            <div>
                <p className='formTitle'>{locRoute === '/nuevo-producto' ? 'Nuevo' : 'Editar'} producto</p>
                {locRoute === '/editar-producto' && <button title='Eliminar producto' onClick={() => deleteProduct(newProduct)}><MdDeleteOutline/></button>}
            </div>
            {Object.keys(productModel).map((el,index) => {
                if (!el.startsWith('_')) {
                    return (
                        <div key={index} style={{width: '100%'}}>
                            <FormGenerator key={index} modelKey={el}
                                enumValues={enumFields[el]?enumFields[el]:null} 
                                handleChange={Array.isArray(productModel[el].type)?el==='img'?handleImgOnChange:handleChangeOnArray:handleChange} 
                                currentNewProdField={newProduct[el]}/>
                                {/* currentNewProdField={newProduct[el]}  {...(el === 'img' && { existingImages })}/> */}
                            {Array.isArray(productModel[el].type) && el !== 'img'&&<div className='fieldsContainer'>
                                {(newProduct[el] || []).map((arrayEl, index) => {
                                    return <p key={index}>{arrayEl}<MdOutlineClear onClick={() => deleteColor(index)}/></p>
                                })}
                            </div>}
                        </div>
                    )
                }else{
                    return null;//temporal, revisar este return
                }
            })}
            <Button className='submitBtn' type='submit' variant='contained' sx={{alignSelf: 'flex-end'}}>Subir</Button>
        </Box>
        <Box className='enumFieldsWrapper'>
            <p className='formTitle'>Campos con valores fijos</p>
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