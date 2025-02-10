import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { cartList, deleteFromCart,changeAmount } from '../redux/CartSlice'

const Cart = () => {

    const prodList = useSelector(cartList);
    const dispatch = useDispatch();

    const enviarLista = () => {
        console.log(prodList);

        const cel=1550257769;
        const lista=`Hola! Esta es mi lista de compra:%0a${prodList.map((el,index) => {
            return `Nombre: *${el.name}*%0a* Cantidad: ${el.quantity}%0a* Color: ${el.color}%0a* Precio: ${el.price}%0a`;
        })}`;

        const url =`https://api.whatsapp.com/send/?phone=${cel}&text=${(lista)}&type=phone_number&app_absent=0`
        window.open(url,'_blank');
    }

  return <>
        {
        prodList.length > 0
        ?
        prodList.map((prod,index) => {
            return <div key={index} className='cartProdItem'>
                <p className='cartProdName'>Producto: {prod.name}</p>
                <p className='cartProdColor'>Color: {prod.color}</p>
                <div className='cartProdAmount'>
                    <p>Cantidad: </p>
                    <button onClick={()=> dispatch(changeAmount(['-',index]))}>-</button>
                    <p>{prod.quantity}</p>
                    <button onClick={()=> dispatch(changeAmount(['+',index]))}>+</button>
                </div>
                <p className='cartProdPrice'>{prod.price}</p>
                <button onClick={() =>(dispatch(deleteFromCart(index)))}>Eliminar</button>
            </div>;
            }) 
            : <div>No hay productos en el carrito todavía</div>
        }
        <div>
            Precio final:<p>
                {prodList.reduce((acc, item)=> acc + (item.price * item.quantity), 0)}
            </p>
            {/* temporal, si el carrito es 0 que no se pueda comprar, que este el boton deshabilitado y que diga ir a comprar y lleve al menu principal */}
            <button onClick={()=>enviarLista()}>Comprar</button>
        </div>
    </>
}

export default Cart