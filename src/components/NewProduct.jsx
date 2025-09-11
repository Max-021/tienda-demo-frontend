import React, { useEffect,useState } from 'react'
import { useLoadingHook } from '../hooks/useLoadingHook.js';
import { useNotification } from './reusables/NotificationContext.jsx';
import { useLocation } from 'react-router-dom'
import FormGenerator from './FormGenerator/FormGenerator.jsx';
import EnumFieldsManager from './FormGenerator/EnumFieldsManager.jsx';
import LoadingSpinner from './reusables/LoadingSpinner.jsx';
import ConfirmMessage from './reusables/ConfirmMessage.jsx';

import {getEnumList, getProductModel, uploadProduct, updateProduct, deleteProduct, getProductById} from '../auxiliaries/axios'
import { remakeObj } from '../auxiliaries/functions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MdDeleteOutline } from "react-icons/md";
import IconPopOver from './reusables/IconPopOver.jsx';

const NewProduct = () => {
    const notify = useNotification();
    const location = useLocation();
    const [productLoading, setProductLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [productModel,setProductModel] = useState({});
    const [newProduct,setNewProduct] = useState({});
    const [removedImages, setRemovedImages] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [enumFields,setEnumFields] = useState([]);
    const [locRoute, setLocRoute] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [anchorElIsActive, setAnchorElIsActive] = useState(null);
    const [initialEnumsLoaded, setInitialEnumsLoaded] = useState(false);

    useEffect(()=> {
        const fetchSingleData = async () => {
            const modelValue = await getProductModel();
            const enumList = await getEnumList();
            const productFormModel = remakeObj(modelValue.data);
            setProductModel(modelValue.data)
            setEnumFields(enumList.data.docs);
            if(location.pathname === '/editar-producto'){
                const prod = await getProductById({...location.state}._id);
                setNewProduct(prod.data);
                setIsActive(prod.data.isActive);
            }else setNewProduct(productFormModel);
            setIsReady(true);
        }
        fetchSingleData();
    }, [location.pathname, location.state])

    const {data: enumList, loading: loadingEnums, error: errorEnums, refetch: refetchEnums} = useLoadingHook(getEnumList, []);
    useEffect(()=> {
        if(enumList?.data?.docs) {
            setEnumFields(enumList.data.docs);
            if(!initialEnumsLoaded) setInitialEnumsLoaded(true);
        } 
    }, [enumList]);

    useEffect(() => {
        setLocRoute(location.pathname)
    }, [location])

    const submitProduct = async (e) => {
        e.preventDefault();
        const productData = {...newProduct, isActive: isActive}
        try {
            setProductLoading(true);
            if(location.pathname === '/editar-producto'){
                const res = await updateProduct({...productData, removedImages});
                notify('success', 'Producto editado con exito!');
                setNewProduct(res.data)
            }
            else{
                await uploadProduct(productData);
                notify('success', 'Producto creado con exito!');
                setNewProduct(remakeObj(productModel));
            }
        } catch (err) {
            notify('error', err.message)
        } finally {
            setProductLoading(false);
        }
    }
    const confirmDelete = async () => {
        try {
            setOpen(false);
            setProductLoading(true);
            await deleteProduct(newProduct);
            notify('success', 'Producto eliminado correctamente.');
            setNewProduct(remakeObj(productModel));
        } catch (error) {
            notify('error', error.message);
        }finally{
            setProductLoading(false);
        }
    }
    const handleChecked = (e) => setIsActive(e.target.checked);

    return (
        <div className='newProductContainer'>
            <Box component='form' onSubmit={submitProduct} className='productForm'>
                <div className='formTitleContainer'>
                    <p className='formTitle'>{locRoute === '/nuevo-producto' ? 'Nuevo' : 'Editar'} producto</p>
                    {locRoute === '/editar-producto' && <button className='deleteProdBtn' type='button' title='Eliminar producto' onClick={() => setOpen(true)}><MdDeleteOutline/></button>}
                </div>
                {(!isReady || productLoading || loadingEnums)
                    ? <LoadingSpinner spinnerInfo='formSpinner' containerClass='spinnerContainerCenter'/>
                    : <>
                        <FormGenerator productModel={productModel} productObject={newProduct} setProductObject={setNewProduct} removedImages={removedImages} setRemovedImages={setRemovedImages} enumFields={enumFields}/>
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                            <FormGroup sx={{display:'flex', flexDirection: 'row'}}>
                                <FormControlLabel control={<Checkbox checked={isActive} onChange={handleChecked}/>} label="Producto activo" sx={{marginRight: 0}}/>
                                <IconPopOver setAnchorEl={setAnchorElIsActive} anchorEl={anchorElIsActive}
                                    shownElement={(<>
                                        <div className='isActivePopover'>
                                            <strong>Importante:</strong> 
                                            Si un producto se guarda/crea sin esta casilla activa el producto no será visible en la pestaña de productos normal. Va a estar inactivo, lo que significa que solo puede aparecer si en los filtros de editor se selecciona Mostrar inactivos, esto es para poder sacar productos del catálogo sin necesidad de eliminarlos.
                                        </div>
                                    </>)}
                                />
                            </FormGroup>
                            <Button className='submitBtn' type='submit' variant='contained' sx={{alignSelf: 'flex-end'}}>{`${locRoute === '/editar-producto' ? 'Editar' :'Crear'}`}</Button>
                        </div>
                    </>
                }
            </Box>
            <Box className='enumFieldsWrapper'>
                <p className='formTitle'>Campos con valores predeterminados</p>
                {(!isReady || productLoading || (loadingEnums && !initialEnumsLoaded))
                    ? <LoadingSpinner spinnerInfo='formSpinner' containerClass='spinnerContainerCenter'/>
                    : enumFields.map((el, index) => <EnumFieldsManager key={el._id} enumId={el._id} dataField={el.values} enumName={el.name} refetchEnums={refetchEnums}/>)}
            </Box>
            <ConfirmMessage 
                dialogClass='deleteProdDialog' windowStatus={open} 
                confirmFc={confirmDelete} cancelFc={setOpen}
                titleMsg={"¿Desea eliminar este producto?"}
                textContent='Esta acción es permanente, si desea sacar el producto del catalogo también puede desactivarlo haciendo click en la casilla de producto activo.'
            />
        </div>
    )
}

export default NewProduct