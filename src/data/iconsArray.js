import { FaFacebookSquare, FaInstagram, FaRegUserCircle} from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

const urlStart = 'https://'


export const sessionBtns = [
    {icon: <FiPlusCircle/>, linkUrl: '/nuevo-producto', title:'Nuevo producto'},
    {icon: <FaRegUserCircle/>, linkUrl: '/mi-perfil', title: 'Mi perfil'},
]

export const footerBtns = [
    {icon: <FaFacebookSquare/>, linkUrl: `${urlStart}www.facebook.com`, title: 'Facebook'},
    {icon: <FaInstagram/>, linkUrl: `${urlStart}www.instagram.com`, title: 'Instagram'},
]