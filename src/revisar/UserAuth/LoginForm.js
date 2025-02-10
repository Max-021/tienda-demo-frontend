import React from 'react'

const LoginForm = () => {
  return (
    <div>
        <h3>Iniciar Sesión</h3>
        <form className='signForm' onSubmit={()=> alert('usuario creado')}>
            <label for='mailLogin'>Email</label>
            <input name='mailLogin' type='email' required/>
            <label for='userpasswordLogin'>Contraseña</label>
            <input name='userpasswordLogin' type='password' required/>
            <button type='submit'>Iniciar sesión</button>
        </form>
    </div>
  )
}

export default LoginForm