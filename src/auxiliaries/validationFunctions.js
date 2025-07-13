export const isValidEmail = (email) =>  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// mínimo 12 caracteres, 1 minúscula, 1 mayúscula, 1 número, 1 caracter especial
export const isValidPassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(pwd);

export const commonPasswords = [];

export const testPwd = (pwd) => {
    if (!pwd)                           return 'La contraseña es obligatoria.';
    if (pwd.length < 12)                return 'Mínimo 12 caracteres.';
    if (pwd.length > 64)                return 'Máximo 64 caracteres.'
    if (!/[a-z]/.test(pwd))             return 'Debe incluir al menos una letra minúscula.';
    if (!/[A-Z]/.test(pwd))             return 'Debe incluir al menos una letra mayúscula.';
    if (!/\d/.test(pwd))                return 'Debe incluir al menos un número.';
    if (!/[\W_]/.test(pwd))             return 'Debe incluir al menos un caracter especial.';
    if (/^\s|\s$/.test(pwd))            return 'La contraseña no debe empezar ni terminar con espacios.';
    if(commonPasswords.includes(pwd))   return 'La contraseña no es segura.'
    return '';
}

export const pwdRules = (val, oldPwd) => {
  const rules = [
    { key: 'minLength',   label: 'Al menos 12 caracteres',          test: () => val.length >= 12 },
    { key: 'maxLength',   label: 'Como máximo 64 caracteres',       test: () => val.length <= 64 },
    { key: 'lower',       label: 'Una letra minúscula',             test: () => /[a-z]/.test(val) },
    { key: 'upper',       label: 'Una letra mayúscula',             test: () => /[A-Z]/.test(val) },
    { key: 'number',      label: 'Un número',                       test: () => /\d/.test(val) },
    { key: 'special',     label: 'Un carácter especial',            test: () => /[\W_]/.test(val) },
    { key: 'common',      label: 'No sea una contraseña común',     test: () => !commonPasswords.includes(val) },
    { key: 'trim',        label: 'No empiece/termine con espacio',  test: () => !/^\s|\s$/.test(val) },
  ];

  if (typeof oldPwd === 'string' && oldPwd.length > 0) {
    rules.splice(7, 0, {
      key: 'diff',
      label: 'No igual que la anterior',
      test: () => val !== oldPwd
    });
  }

  return rules;
}