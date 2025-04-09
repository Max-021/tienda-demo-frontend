import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { cartList, deleteFromCart,changeAmount } from '../redux/CartSlice'

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';

const Transition = React.forwardRef(function Transition(props,ref) {
  return <Slide direction='up' ref={ref} {...props}/>
})

const Cart = () => {
    const [open, setOpen] = useState(false);
    const [telNumber, setTelNumber] = useState(null)

    const prodList = useSelector(cartList);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setTelNumber(e.target.value)
    }

    const enviarLista = () => {
        console.log(prodList);

        const lista=`Hola! Esta es mi lista de compra:%0a${prodList.map((el,index) => {
            return `Nombre: *${el.name}*%0a* Cantidad: ${el.quantity}%0a* Color: ${el.color}%0a* Precio: ${el.price}%0a`;
        })}`;

        const url =`https://api.whatsapp.com/send/?phone=${telNumber}&text=${(lista)}&type=phone_number&app_absent=0`
        window.open(url,'_blank');
    }

    const verificarCompra = (e) => {
        e.preventDefault();

        setOpen(false);
        enviarLista();
    }

    return <div className='cartContainer'>
        {
        prodList.length > 0
        ?
        <div className='cartProducts'>
            {prodList.map((prod,index) => {
                return <>
                    <div key={index} className='cartProdItem'>
                        <div className='cartProdInfoLeft'>
                            <p className='cartProdName'>Producto: {prod.name}</p>
                            <p className='cartProdColor'>Color: {prod.color}</p>
                            <button onClick={() =>(dispatch(deleteFromCart(index)))}>Eliminar</button>
                        </div>
                        <div className='cartProdInfoRight'>
                            <div className='cartProdAmount'>
                                <p>Cantidad:&nbsp;</p>
                                <button onClick={()=> dispatch(changeAmount(['-',index]))}>-</button>
                                <p>{prod.quantity}</p>
                                <button onClick={()=> dispatch(changeAmount(['+',index]))}>+</button>
                                <p>Precio:&nbsp;</p>
                                <p className='cartProdPrice'>{prod.price}</p>
                            </div>
                            <div className='cartProdTotalAmount'>
                                <p>Final:&nbsp;</p>
                                <p>{prod.price * prod.quantity}</p>
                            </div>
                        </div>
                    </div>
                    <div className='cartProdItemSeparator'></div>
                </>
            })} 
        </div>
            : <div>No hay productos en el carrito todavía</div>
        }
        <div className='cartResume'>
            <div className='cartResumeTitle'>
                <h4>Resúmen</h4>
                <div className='cartProdItemSeparator'></div>
            </div>
            <div className='cartResumeDetails'>
                <div className='cartResumeTotalProducts'>
                    <p>Cantidad de productos:</p>
                    <p>{prodList.reduce((acc, item)=> acc + (item.quantity), 0)}</p>
                </div>
                <div className='cartResumeFinalAmount'>
                    <p>Precio final:</p>
                    <p>{prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0)}</p>
                </div>
                <div>
                {/* temporal, si el carrito es 0 que no se pueda comprar, que este el boton deshabilitado y que diga ir a comprar y lleve al menu principal */}
                <button onClick={()=>setOpen(true)}>Comprar</button>
                </div>
            </div>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
            <form style={{padding: '8px'}} onSubmit={verificarCompra}>
                <p>Ingrese su número de teléfono</p>
                <TextField name='Teléfono' type='number' value={telNumber} onChange={handleChange} required/>
                <div>
                    <button type='submit' title='Confirmar'> Sí </button>
                    <button type='button' title='No' onClick={() => setOpen(false)}> No </button>
                </div>
            </form>
        </Dialog>
    </div>
}

export default Cart