import React from 'react'

const SignUpForm = () => {
  return (
    <div>
        <h3>Nuevo Usuario</h3>
        <form className='signForm' onSubmit={()=> alert('usuario creado')}>
            <label for='userSignUp'>Usuario</label>
            <input name='userSignUp' type='text' required/>
            <label for='mailSignUp'>Email</label>
            <input name='mailSignUp' type='email' required/>
            <label for='userpasswordSignUp'>Contraseña</label>
            <input name='userpasswordSignUp' type='password' required/>
            <button type='submit'>Iniciar sesión</button>
        </form>
    </div>
  )
}

export default SignUpForm