import React, {useState} from 'react'

import SignUpForm from './SignUpForm'
import LoginForm from './LoginForm'

/* Este componente funciona con un slider que alterna entre los dos forms, falta desarrollar pero puede servir para
alguna pagina futura
*/
const Sign = () => {
  const [toggleForm, setToggleForm] = useState(true);

  return (
    <div className='signContainer'>
      <div>
        <button onClick={() => setToggleForm(true)}> Iniciar Sesión </button>
        <button onClick={() => setToggleForm(false)}> Crear Usuario </button>
      </div>
      {toggleForm ? 
        <LoginForm/>
      :
        <SignUpForm/>
      }
    </div>
  )
}

export default Sign