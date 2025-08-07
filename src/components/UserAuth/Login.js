import React, { useState, useRef, useEffect } from 'react';
import { useLoadingNotifier } from '../../hooks/useLoadingNotifier';
import { useNotification } from '../reusables/NotificationContext';
import { login, passwordForgotten } from '../../auxiliaries/axios';
import { isValidEmail } from '../../auxiliaries/validationFunctions';

import Box  from '@mui/material/Box'
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment } from '@mui/material'
import TurnstileCaptcha from '../../auxiliaries/captcha/TurnstileCaptcha';

import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const Login = () => {
  const notify = useNotification();
  const [userData, setUserData] = useState({ mail: '', password: '' });
  const [isForgotten, setIsForgotten] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ mail: '', password: '' });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  const loginUser = useLoadingNotifier(login, {
    successMsg: 'Inicio de sesión exitoso. redirigiendo...',
    onError: (err) => {
      if (err?.data?.captchaRequired) {
        setShowCaptcha(true);
      }
    },
    onSuccess: () => {
      redirectTimeoutRef.current = setTimeout(() => {
        window.location.replace('/');
      }, 1000);
    }
  });

  const recoverPassword = useLoadingNotifier(passwordForgotten, {
    successMsg: 'Email de recuperación enviado, puede demorar unos minutos en aparecer. Si el correo no aparece por favor reintente el proceso.'
  });

  const validateField = (name, val) => {
    let msg = '';

    if (name === 'mail') {
      if (!val.trim()) msg = 'El email es obligatorio.';
      else if (!isValidEmail(val)) msg = 'Formato de email incorrecto.';
    }
    if (name === 'password') {
      if (!val.trim()) msg = 'La contraseña es obligatoria.';
      else if (val.length < 12) msg = 'Mínimo 12 caracteres.';
    }
    setErrors(prev => ({ ...prev, [name]: msg }));
    return msg === '';
  };

  const validateAll = () => {
    const nextErrors = { mail: '', password: '' };

    if (!userData.mail.trim()) nextErrors.mail = 'El email es obligatorio.';
    else if (!isValidEmail(userData.mail)) nextErrors.mail = 'Formato de email incorrecto.';

    if (!isForgotten) {
      if (!userData.password.trim()) nextErrors.password = 'La contraseña es obligatoria.';
      else if (userData.password.length < 12) nextErrors.password = 'Mínimo 12 caracteres.';
    }

    setErrors(nextErrors);
    return !nextErrors.mail && !nextErrors.password;
  };

  const preparePasswordReset = () => {
    setIsForgotten(prev => !prev);
    setErrors({ password: '', mail: '' });
    setUserData(prev => ({ ...prev, password: '' }));
    setShowCaptcha(false);
    setCaptchaToken(null);
  }

  const submitForm = async (e) => {
    e.preventDefault();

    const ok = validateAll();
    if (!ok) {
      notify('error', "Alguno de los campos contiene errores, completa los campos correctamente antes de avanzar.");
      return;
    }

    if (isForgotten) {
      try {
        setIsSubmitting(true);
        await recoverPassword(userData.mail);
      } catch (err) {
        console.error('Error en recuperar contraseña:', err);
        notify('error', 'No se pudo enviar el email de recuperación.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        setIsSubmitting(true);
        const payload = { ...userData, ...(showCaptcha && { 'cf-turnstile-response': captchaToken }) };
        await loginUser(payload);
      } catch (error) {
        console.error('Error en login:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const handleChange = (e) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (showCaptcha) {
      setCaptchaToken(null);
      window.turnstile?.reset?.();
    }
  }

  const isFormValid = userData.mail.trim() && (!errors.mail) && (isForgotten || (userData.password.trim() && !errors.password)) && (!showCaptcha || !!captchaToken);

  return (
    <div className='logSection'>
      <div className='signupContainer'>
        <h3>Inicio de Sesión</h3>
        <Box component='form' className='signForm' onSubmit={submitForm} noValidate>
          <FormControl>
            <TextField required label={'Email'} value={userData.mail} autoComplete='email' autoFocus
              name={`mail`} id={`email-id`} type='email'
              onChange={handleChange} onBlur={e => validateField(e.target.name, e.target.value)}
              error={!!errors.mail} helperText={errors.mail}
            />
          </FormControl>
          <div style={{width: '100%'}}>
            {!isForgotten &&
              <FormControl>
                <TextField required={!isForgotten} label={'Contraseña'} value={userData.password}
                  name={`password`} id={`password-id`} type={showPassword ? 'text' : 'password'} autoComplete='current-password'
                  onChange={handleChange} onBlur={e => validateField(e.target.name, e.target.value)}
                  error={!!errors.password} helperText={errors.password}
                  InputProps={{ endAdornment: (
                    <InputAdornment position='end' sx={{height:'100%',display:'flex',alignItems:'center'}}>
                      <IconButton edge='end' onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility /> }
                      </IconButton>
                    </InputAdornment>
                  )}}
                />
              </FormControl>
            }
            <button type='button' className='forgotPwdBtn' onClick={preparePasswordReset}>
              {!isForgotten ? 'Olvide mi contraseña' : 'Volver a inicio de sesión'}
            </button>
          </div>
          { showCaptcha && (
            <TurnstileCaptcha siteKey={process.env.REACT_APP_TURNSTILE_SITEKEY} onVerify={setCaptchaToken}/>
          )}
          <Button type='submit' disabled={!isFormValid || isSubmitting}>
            {!isForgotten ? (isSubmitting ? 'Iniciando...' : 'Iniciar sesión') : (isSubmitting ? 'Enviando...' : 'Recuperar contraseña')}
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default Login;