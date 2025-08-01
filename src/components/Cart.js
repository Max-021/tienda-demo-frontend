import React, {useState, useRef, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNotification } from './reusables/NotificationContext';
import { checkOrder } from '../auxiliaries/axios/productsCalls';
import { prepareOrderPayload } from '../auxiliaries/functions';
import { verifyCaptcha } from '../auxiliaries/axios/captchaCalls';

import { cartList, totalProducts, deleteFromCart,changeAmount } from '../redux/CartSlice'

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import ConfirmMessage from '../components/reusables/ConfirmMessage';
import LoadingSpinner from './reusables/LoadingSpinner';
import TurnstileCaptcha from '../auxiliaries/captcha/TurnstileCaptcha';

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Cart = () => {
    const notify = useNotification();
    const [openTel, setOpenTel] = useState(false)//borrar esto en produccion, temporal
    const [telNumber, setTelNumber] = useState(null) //borrar esto en produccion, temporal
    const [open, setOpen] = useState(false);
    const [activeIndex,setActiveIndex] = useState(-1);
    const [allowOrder, setAllowOrder] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const [excededList, setExcededList] = useState([]);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState('');
    const prevAllowOrder = useRef(allowOrder);

    const prodList = useSelector(cartList);
    const productsCount = useSelector(totalProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        if(prevAllowOrder.current === true && allowOrder === false) {
            notify('info', 'La cantidad de productos fue modificada, se necesita volver a confirmar la compra.');
        }
        prevAllowOrder.current = allowOrder;
    }, [allowOrder, notify]);

    const handleChange = (e) => setTelNumber(e.target.value)//tambien tengo que borrar esto fuera de la demo

    const sendOrder = () => {
        const lista=`Hola! Esta es mi lista de compra:%0a${prodList.map((el,index) => {
            return `Producto: *${el.name}*%0a* Cantidad: ${el.quantity}%0a* Color: ${el.color}%0a* Precio: ${el.price}%0a`;
        })}`;

        const url =`https://api.whatsapp.com/send/?phone=${telNumber}&text=${(lista)}&type=phone_number&app_absent=0`
        window.open(url,'_blank');
    }

    const verifyPurchase = (e) => {
        e.preventDefault();

        setOpen(false);
        sendOrder();
    }

    const handleProdDelete = (idx) => {
        dispatch(deleteFromCart(idx));
        setOpen(false);
    }

    const validateOrder = async () => {
        try {
            setCheckLoading(true);
            await new Promise(resolve => setTimeout(resolve, 3000));    
            const payload = prepareOrderPayload(prodList);
            const res = await checkOrder(payload);

            if(res.data.limitsExceded.length > 0) {
                setExcededList(res.data.limitsExceded);
            }else if(res.data.limitsExceded.length === 0) {
                setAllowOrder(true);
                notify('success', 'La orden fue confirmada con éxito!');
            }
        } catch (error) {
            notify('error', error.message);
        }finally{
            setCheckLoading(false);
        }
    }

    const checckIfExceded = (prodId, color) => {
        const isExceded = excededList.find(item => item._id === prodId && item.color === color);

        if(!isExceded) return false;
        return isExceded;
    }

    const handlePurchase = async () => {
        setCaptchaError('');
        try {
            await verifyCaptcha({ 'cf-turnstile-response': captchaToken });
            setCaptchaToken(null);
            window.turnstile.reset && window.turnstile.reset();
            setOpenTel(true);
        } catch (err) {
            setCaptchaError(err);
            notify('error',err.message);
        } finally {
        }
    }

    return <div className='cartContainer'>
        {
        prodList.length > 0
        ?
        <div className='cartProducts'>
            {prodList.map((prod,index) => {
                const conflict = checckIfExceded(prod._id, prod.color);
                return <>
                    <div key={index} className='cartProdItem'>
                        <div className='cartProdInfoLeft'>
                            <p className='cartProdName'>Producto: {prod.name}</p>
                            <p className='cartProdColor'>Color: {prod.color}</p>
                            <button className='cartBtn deleteProdItem' onClick={() => {
                                setActiveIndex(index);
                                setOpen(true);
                            }}>Eliminar producto</button>
                        </div>
                        <div className='cartProdInfoRight'>
                            <div className='cartProdItemDetail'>
                                <div className='cartProdAmount'>
                                    <div className='cartQuantityControls'>
                                        <p>Cantidad:&nbsp;</p>
                                        <button onClick={()=> {
                                            dispatch(changeAmount(['-',index]))
                                            setAllowOrder(false);
                                            setExcededList(prev => prev.filter(item => !(item._id === prod._id && item.color === prod.color)));
                                        }} title='Restar un producto'>
                                            -
                                        </button>
                                        <p>{prod.quantity}</p>
                                        <button onClick={()=> {
                                            dispatch(changeAmount(['+',index]))
                                            setAllowOrder(false);
                                            setExcededList(prev => prev.filter(item => !(item._id === prod._id && item.color === prod.color)));
                                        }} title='Sumar un producto'>
                                            +
                                        </button>
                                    </div>
                                    {conflict && (
                                        <p className='cartProdItemError'>
                                            {
                                                `Solo hay ${conflict.available} unidad${conflict.available > 1 && 'es'} disponibles.`
                                                ||
                                                'Las unidades pedidas exceden el límite disponible.'
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className='cartProdPrice'>
                                    <p>Precio:&nbsp;</p>
                                    <p>{prod.price}</p>
                                </div>
                            </div>
                            <div className='cartProdTotalAmount'>
                                <p>Final:&nbsp;</p>
                                <p>{prod.price * prod.quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div key={`${index}-separator`} className='cartProdItemSeparator'></div>
                </>
            })} 
        </div>
            : <div>No hay productos en el carrito todavía</div>
        }
        <div className='cartResume'>
            <div className='cartResumeTitle'>
                <h4>Resúmen</h4>
                <div className='cartProdItemSeparator'></div>
                    <div className='cartResumeInfo'>
                        <p>Subtotal:</p>
                        <p>{prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0)}</p>
                    </div>
                    <div className='cartResumeInfo'>
                        <p>Cantidad total de productos:</p>
                        <p>{productsCount}</p>
                    </div>
                    <button className='cartBtn confirmOrder' type='button' onClick={() => validateOrder()} disabled={(productsCount <= 0) || checkLoading || excededList.length > 0}>
                        {checkLoading && <LoadingSpinner spinnerInfo='smallSpinner'/>}
                        Confirmar compra
                    </button>
            </div>
            <div className='cartResumeDetails'>
                <div className='cartResumeFinalAmount'>
                    <p>Precio final:</p>
                    <p>{prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0)}</p>
                </div>
                <div className='cartProdItemSeparator'></div>
                {allowOrder && (
                    <>
                        <TurnstileCaptcha siteKey={process.env.REACT_APP_TURNSTILE_SITEKEY} onVerify={setCaptchaToken}/>
                    </>
                )}
                <button className='cartBtn sendOrder' onClick={handlePurchase} disabled={!allowOrder || !captchaToken}>
                    Comprar
                </button>
                <div className='cartMsgInfoBox' title='*Se generará un mensaje con el pedido completo para enviar al vendedor.'>
                    *Se generará un mensaje con el pedido completo para enviar al vendedor.
                </div>
            </div>
        </div>
        <Dialog open={openTel} onClose={() => setOpenTel(false)} TransitionComponent={Transition}>
            <form style={{padding: '8px'}} onSubmit={verifyPurchase}>
                <p>Ingrese su número de teléfono</p>
                <TextField name='Teléfono' type='number' value={telNumber} onChange={handleChange} required/>
                <div style={{display:'flex', flexDirection: 'row', gap:'12px', marginTop:'12px'}}>
                    <button style={{boxSizing:'border-box', padding: '6px 18px', backgroundColor:'hsl(203, 30%, 26%)', borderRadius:'6px', color:'whitesmoke', border:'1px solid black'}}
                        type='submit' title='Confirmar'> Sí </button>
                    <button style={{boxSizing:'border-box', padding: '6px 18px', backgroundColor:'#DAD7CD', borderRadius:'6px', color:'#2F4858', border:'1px solid black'}}
                        type='button' title='No' onClick={() => setOpenTel(false)}> No </button>
                </div>
            </form>
        </Dialog>
        <ConfirmMessage dialogClass='confirmDeleteProductDialog' windowStatus={open} 
            titleMsg={'¿Desea eliminar este producto del carrito?'} 
            textContent='Si desea eliminar el producto del carrito, haga click en el botón confirmar. Caso contrario en Cancelar'
            confirmFc={handleProdDelete} args={activeIndex}
            cancelFc={setOpen}
            yesTitle='Confirmar' yesTxt='Confirmar'
            noTitle='Cancelar' noTxt='Cancelar'
        />
    </div>
}

export default Cart