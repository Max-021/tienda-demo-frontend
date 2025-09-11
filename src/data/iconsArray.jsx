import { FaFacebookSquare, FaInstagram, FaRegUserCircle} from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { allowedEditingRole } from "./permissions";

const urlStart = 'https://'

export const sessionBtns = [
    {icon: <FiPlusCircle/>, linkUrl: '/nuevo-producto', title:'Nuevo producto', userLevel: allowedEditingRole},
    {icon: <FaRegUserCircle/>, linkUrl: '/my-profile', title: 'Mi perfil', userLevel: []},
]

export const footerBtns = [
    {icon: <FaFacebookSquare/>, linkUrl: `${urlStart}www.facebook.com`, title: 'Facebook'},
    {icon: <FaInstagram/>, linkUrl: `${urlStart}www.instagram.com`, title: 'Instagram'},
]