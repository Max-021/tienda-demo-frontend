import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { currentViewValue } from '../../redux/searchBarSlice';
import { authenticateStatus, userRole } from '../../redux/UserSlice';
import { MdEditSquare } from "react-icons/md";
import { allowedEditingRole } from '../../data/permissions';

const ProductPreview = ({ind, product, handleOpen}) => {
    const currentView = useSelector(currentViewValue);
    const authStatus = useSelector(authenticateStatus);
    const role = useSelector(userRole);

    const hasStock = product.stock.some(prod => prod.quantity > 0);

    return (
        <div className={`productView ${currentView === 'list' ? 'productList' : 'productGrid'}`} onClick={() => handleOpen(ind)}>
            <div className='productImgContainer'>
                <img className='productImg' src={product.img[0].startsWith('https') ? product.img[0] : require(`../../assets/${product.img[0]}`)} alt={`prod${ind}`}/>
            </div>
            <div className='productInfo'>
                <p key={`${ind}-prodName`} title={product.name}>{product.name}</p>
                <p>{hasStock ? 'Unidades disponibles' : 'No disponible temporalmente, consultar por el producto'}</p>
                <p>$ {product.price}</p>
                <p>{product.stock.length} {`color${product.stock.length>1?'es':''}`}</p>
            </div>
            {authStatus && allowedEditingRole.includes(role) ?
                <Link className='editIconContainer' to={'/editar-producto'} state={product} title='Editar Producto'>
                <MdEditSquare className='editBtn'/>
                </Link>
            : null
            }
        </div >
    )
}

export default ProductPreview