import React, { useEffect,useState } from 'react'
import { useLoadingHook } from '../hooks/useLoadingHook';
import { useNotification } from './reusables/NotificationContext';
import { useLocation } from 'react-router-dom'
import FormGenerator from './FormGenerator/FormGenerator';
import EnumFieldsManager from './FormGenerator/EnumFieldsManager';
import LoadingSpinner from './reusables/LoadingSpinner';
import ConfirmMessage from './reusables/ConfirmMessage';

import {getEnumList, getProductModel, uploadProduct, updateProduct, deleteProduct} from '../auxiliaries/axios'
import { remakeObj } from '../auxiliaries/functions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import { MdDeleteOutline, MdOutlineClear } from "react-icons/md";

const NewProduct = () => {
    const notify = useNotification();
    const location = useLocation();
    const [productModel,setProductModel] = useState({});
    const [locRoute, setLocRoute] = useState('');
    const [enumFields,setEnumFields] = useState([]);
    const [newProduct,setNewProduct] = useState({});
    const [productLoading, setProductLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [removedImages, setRemovedImages] = useState([]);
    // const [existingImages, setExistingImages] = useState(null)

    useEffect(()=> {
        const fetchSingleData = async () => {
            const modelValue = await getProductModel();
            const enumList = await getEnumList();
            setProductModel(modelValue.data)
            setEnumFields(enumList.data);
            if(location.pathname === '/editar-producto'){//aca agregar que si viene por /editar-producto el set newProduct lo haga con el producto ya puesto, temporal
                const productData = {...location.state};
                // const productData = {...location.state, img: []};
                // setExistingImages(location.state.img);
                setNewProduct(productData)
            }else setNewProduct(remakeObj(modelValue.data));
        }
        fetchSingleData();
    }, [location.pathname, location.state])

    const {data: enumList, loading: loadingEnums, error: errorEnums, refetch: refetchEnums} = useLoadingHook(getEnumList, []);
    useEffect(()=> {
        if(enumList){
            setEnumFields(enumList)
        }
    }, [enumList]);

    useEffect(() => {
        setLocRoute(location.pathname)
    }, [location])

    const submitProduct = async (e) => {
        e.preventDefault();
        try {
            setProductLoading(true);
            if(location.pathname === '/editar-producto'){
                const res = await updateProduct({...newProduct, removedImages});
                notify('success', 'Producto editado con exito!');
                setNewProduct(res.data)
                console.log(res)
            }
            else{
                await uploadProduct(newProduct);
                notify('success', 'Producto creado con exito!');
                setNewProduct(remakeObj(productModel));
            }
        } catch (err) {
            notify('error', 'Error al enviar la información, reintente.')
        } finally {
            await new Promise(resolve => setTimeout(resolve, 3000));
            setProductLoading(false);
        }
    }
    const confirmDelete = async () => {
        try {
            setOpen(false);
            setProductLoading(true);
            await deleteProduct(newProduct);
            notify('success', 'Producto eliminado correctamente.');
        } catch (error) {
            notify('error', 'Error al eliminar el producto, reintente');
        }finally{
            await new Promise(resolve => setTimeout(resolve, 3000));
            setProductLoading(false);
        }
    }
    const handleChange = (e) => setNewProduct({ ...newProduct,[e.target.name]: e.target.value })

    const handleChangeOnArray = (e) => {
        if(!newProduct[e.target.name].includes(e.target.value)){
            const newColors = [...newProduct[e.target.name],e.target.value]
            setNewProduct({...newProduct,[e.target.name]: newColors})
        }
    }
    const handleImgOnChange = (files) => {
        if (!files || files.length === 0) setNewProduct({...newProduct, img: []})
        else setNewProduct({...newProduct, img: files})
    };
    const deleteFromArray = (fieldName, idx) => setNewProduct(p => ({...p, [fieldName]: p[fieldName].filter((_, i) => i !== idx)}));


    const getEnumValues = (fieldName) => {//temporal, revisar acá, no es tan importante pero hay algo raro
        const doc = enumFields.find(f => f.name === fieldName);
        return doc ? doc.values : null
    }

    return (
        <div className='newProductContainer'>
            <Box component='form' onSubmit={submitProduct} className='productForm'>
                <div className='formTitleContainer'>
                    <p className='formTitle'>{locRoute === '/nuevo-producto' ? 'Nuevo' : 'Editar'} producto</p>
                    {locRoute === '/editar-producto' && <button className='deleteProdBtn' type='button' title='Eliminar producto' onClick={() => setOpen(true)}><MdDeleteOutline/></button>}
                </div>
                { (productLoading || loadingEnums) ?
                    <LoadingSpinner/>
                    : Object.keys(productModel).map((el,index) => {
                        return (
                            <div key={index} style={{width: '100%'}}>
                                {console.log(el+' '+productModel[el].type)}
                                <FormGenerator modelKey={el} enumValues={getEnumValues(el)} currentNewProdField={newProduct[el]}
                                    handleChange={Array.isArray(productModel[el].type)?el==='img'?handleImgOnChange:handleChangeOnArray:handleChange}
                                    setRemovedImages={el === 'img' ? setRemovedImages : null} removedImages={el === 'img' ? removedImages : null}/>
                                    {/* currentNewProdField={newProduct[el]}  {...(el === 'img' && { existingImages })}/> */}
                                {Array.isArray(productModel[el].type) && el !== 'img'&&<div className='fieldsContainer'>
                                    {(newProduct[el] || []).map((arrayEl, index) => {
                                        return <p key={index}>{arrayEl}<MdOutlineClear onClick={() => deleteFromArray(el, index)}/></p>
                                    })}
                                </div>}
                            </div>
                        )
                    })
                }
                <Button className='submitBtn' type='submit' variant='contained' sx={{alignSelf: 'flex-end'}}>Subir</Button>
            </Box>
            <Box className='enumFieldsWrapper'>
                <p className='formTitle'>Campos con valores predeterminados</p>
                {enumFields.map((el, index) => <EnumFieldsManager key={index} enumId={el._id} dataField={el.values} enumName={el.name} refetchEnums={refetchEnums}/>)}
            </Box>
            <ConfirmMessage windowStatus={open} confirmFc={confirmDelete} cancelFc={setOpen} textMsg={'¿Desea eliminar este producto? Esta acción es permanente.'}/>
        </div>
    )
}

export default NewProduct