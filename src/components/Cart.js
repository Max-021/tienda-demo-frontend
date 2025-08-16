import React, {useState, useRef, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNotification } from './reusables/NotificationContext';
import { checkOrder } from '../auxiliaries/axios/productsCalls';
import { prepareOrderPayload } from '../auxiliaries/functions';
import { verifyCaptcha } from '../auxiliaries/axios/captchaCalls';
import { formatPrice } from '../auxiliaries/format';

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

const buildWhatsAppUrl = (tel, items) => {
  const lines = items.map(el =>
    `Producto: ${el.name}\nCantidad: ${el.quantity}\nColor: ${el.color}\nPrecio: ${formatPrice(el.price)}`
  ).join('\n\n');
  const text = `Hola! Esta es mi lista de compra:\n\n${lines}`;
  return `https://api.whatsapp.com/send/?phone=${tel}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
};

const Cart = () => {
    const notify = useNotification();
    const dispatch = useDispatch();

    const [openTel, setOpenTel] = useState(false); // temporal/demo
    const [telNumber, setTelNumber] = useState(''); // temporal/demo
    const [open, setOpen] = useState(false);
    const [activeIndex,setActiveIndex] = useState(-1);
    const [checkLoading, setCheckLoading] = useState(false);
    const [excededList, setExcededList] = useState([]);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState('');
    const [hiddenKeys, setHiddenKeys] = useState(new Set());
    const [lastDeleted, setLastDeleted] = useState(null);
    const [sending, setSending] = useState(false);
    const pendingDeleteRef = useRef({});

    const prodList = useSelector(cartList);
    const productsCount = useSelector(totalProducts);
    const prodListRef = useRef(prodList);

    useEffect(() => { prodListRef.current = prodList }, [prodList]);

    useEffect(() => {
        return () => {
            Object.values(pendingDeleteRef.current).forEach(id => clearTimeout(id));
            pendingDeleteRef.current = {};
        };
    }, []);

    const handleChange = (e) => setTelNumber(e.target.value);//para la demo

    const sendOrder = () => {
        const url = buildWhatsAppUrl(telNumber, prodList);
        window.open(url,'_blank');
    }

    const verifyPurchase = async (e) => {
        e.preventDefault();
        setOpenTel(false);
        sendOrder();
    }

    const handleProdDelete = (idx) => {
        setOpen(false);

        const prod = prodList[idx];
        if(!prod) return;

        const key = `${prod._id}-${prod.color}`;
        if(pendingDeleteRef.current[key]) return;

        setHiddenKeys(prev => {
            const s = new Set(prev);
            s.add(key);
            return s;
        });

        setLastDeleted({ key, id: prod._id, color: prod.color, name: prod.name });

        notify('info', `${prod.name} eliminado.`, {
          actionText: 'Deshacer',
          action: () => {
            const timeoutId = pendingDeleteRef.current[key];
            if (timeoutId) {
              clearTimeout(timeoutId);
              delete pendingDeleteRef.current[key];
            }
            setHiddenKeys(prev => {
              const s = new Set(prev);
              s.delete(key);
              return s;
            });
            setLastDeleted(null);
            notify('success', 'Acción deshecha.');
          },
          duration: 5000
        });

        const timeoutId = setTimeout(() => {
            const currentIdx = prodListRef.current.findIndex(p => p._id === prod._id && p.color === prod.color);
            if (currentIdx !== -1) {
                dispatch(deleteFromCart(currentIdx));
            }
            delete pendingDeleteRef.current[key];
            setHiddenKeys(prev => {
                const s = new Set(prev);
                s.delete(key);
                return s;
            });
            setLastDeleted(null);
        }, 5000);

        pendingDeleteRef.current[key] = timeoutId;
    }

    const checckIfExceded = (prodId, color) => {
        const isExceded = excededList.find(item => item._id === prodId && item.color === color);
        if(!isExceded) return false;
        return isExceded;
    }

    // NUEVA función: valida orden y, si pasa, verifica captcha y abre dialog telefono.
    const verifyOrder = async () => {
      if (sending || checkLoading) return;
      setCaptchaError('');
      setCheckLoading(true);

      try {
        const payload = prepareOrderPayload(prodList);
        const res = await checkOrder(payload);

        if (res.data.limitsExceded && res.data.limitsExceded.length > 0) {
          setExcededList(res.data.limitsExceded);
          notify('error', 'Algunos productos exceden el stock. Ajustá las cantidades.');
          const first = res.data.limitsExceded[0];
          if(first) {
            const el = document.querySelector(`[data-cart-key="${first._id}-${first.color}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        if (!captchaToken) {
          notify('info', 'Por favor completá el captcha antes de comprar.');
          return;
        }

        setSending(true);
        await verifyCaptcha({ 'cf-turnstile-response': captchaToken });
        setCaptchaToken(null);
        window.turnstile?.reset?.();
        setOpenTel(true);
      } catch (err) {
        notify('error', err?.message || 'Error validando la orden.');
      } finally {
        setCheckLoading(false);
        setSending(false);
      }
    };

    return <div className='cartContainer'>
        {
        prodList.length > 0
        ?
        <div className='cartProducts'>
            {prodList.map((prod,index) => {
                const key = `${prod._id}-${prod.color}`;
                const isHidden = hiddenKeys.has(key);
                const conflict = checckIfExceded(prod._id, prod.color);
                return <div key={key} data-cart-key={key} className={`cartProdRow ${isHidden ? 'removed' : ''}`} role='group' aria-label={`Producto ${prod.name}`}>
                    <div className={`cartProdItem`}>
                        <div className='cartProdInfoLeft'>
                            <p className='cartProdName'>Producto: {prod.name}</p>
                            <p className='cartProdColor'>Color: {prod.color}</p>
                            <button className='cartBtn deleteProdItem' type="button" onClick={() => {
                                setActiveIndex(index);
                                setOpen(true);
                            }}>Eliminar producto</button>
                        </div>
                        <div className='cartProdInfoRight'>
                            <div className='cartProdItemDetail'>
                                <div className='cartProdAmount'>
                                    <div className='cartQuantityControls'>
                                        <p>Cantidad:&nbsp;</p>
                                        <button type="button" onClick={()=> {
                                            dispatch(changeAmount(['-',index]))
                                            setExcededList(prev => prev.filter(item => !(item._id === prod._id && item.color === prod.color)));
                                        }} title='Restar un producto'>
                                            -
                                        </button>
                                        <p>{prod.quantity}</p>
                                        <button type="button" onClick={()=> {
                                            dispatch(changeAmount(['+',index]))
                                            setExcededList(prev => prev.filter(item => !(item._id === prod._id && item.color === prod.color)));
                                        }} title='Sumar un producto' style={{marginRight:'0'}}>
                                            +
                                        </button>
                                    </div>
                                    {conflict && (
                                        <p className='cartProdItemError' role='status' aria-live='polite'>
                                            {`Solo hay ${conflict.available} unidad${conflict.available > 1 ? 'es' : ''} disponibles.`}
                                        </p>
                                    )}
                                </div>
                                <div className='cartProdPrice'>
                                    <p>Precio:&nbsp;</p>
                                    <p>{formatPrice(prod.price)}</p>
                                </div>
                            </div>
                            <div className='cartProdTotalAmount'>
                                <p>Final:&nbsp;</p>
                                <p>{formatPrice(prod.price * prod.quantity)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='cartProdItemSeparator'></div>
                </div>
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
                        <p>{formatPrice(prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0))}</p>
                    </div>
                    <div className='cartResumeInfo'>
                        <p>Cantidad total de productos:</p>
                        <p>{productsCount}</p>
                    </div>
            </div>
            <div className='cartResumeDetails'>
                <div className='cartResumeFinalAmount'>
                    <p>Precio final:</p>
                    <p>{formatPrice(prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0))}</p>
                </div>
                <div className='cartProdItemSeparator'></div>
                <TurnstileCaptcha siteKey={process.env.REACT_APP_TURNSTILE_SITEKEY} onVerify={setCaptchaToken}/>                
                <button
                  className='cartBtn sendOrder'
                  onClick={verifyOrder}
                  disabled={
                    prodList.length === 0 ||
                    checkLoading ||
                    sending ||
                    excededList.length > 0
                  }
                  aria-busy={checkLoading || sending}
                >
                    {(checkLoading || sending) ? <LoadingSpinner spinnerInfo='smallSpinner'/> : 'Comprar'}
                </button>
                <div className='cartMsgInfoBox' title='*Se generará un mensaje con el pedido completo para enviar al vendedor.'>
                    *Se generará un mensaje con el pedido completo para enviar al vendedor.
                </div>
            </div>
        </div>
        <Dialog open={openTel} onClose={() => setOpenTel(false)} TransitionComponent={Transition}>
            <form style={{padding: '8px'}} onSubmit={verifyPurchase}>
                <p>Ingrese su número de teléfono</p>
                <TextField name='Teléfono' type='tel' value={telNumber} onChange={handleChange} required/>
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