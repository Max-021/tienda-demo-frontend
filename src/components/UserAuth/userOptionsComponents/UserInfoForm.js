import React, {useState, useEffect} from 'react'

import FormGenerator from '../../FormGenerator/FormGenerator'

import { getUserInfo } from '../../../auxiliaries/axiosHandlers'

const UserInfoForm = () => {
    const [userInformation, setUserInformation] = useState({})

    useEffect(() => {
        const userData = async () => {
            const resp = await getUserInfo()
            setUserInformation(resp)
            console.log(resp)//temporal, borrar
        }
        userData();
    },[])

    const handleChange = (e) => {
        alert("camios")
    }
    return (
        <div className='userInfoForm'>
            <h5>Temporal, Datos del usuario</h5>
            {Object.keys(userInformation).map((el,index) => {
                if(!el.startsWith('_')){
                    return <FormGenerator key={index} modelKey={el} handleChange={handleChange} currentNewProdField={userInformation[el]}/>
                }else{
                    return null
                }
            })}
        </div>
    )
}

export default UserInfoForm