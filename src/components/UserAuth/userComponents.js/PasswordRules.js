import React from 'react'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { MdCheckCircle, MdCancel } from 'react-icons/md'

import { pwdRules } from '../../../auxiliaries/validationFunctions'
import { usePasswordServerCheck } from '../../../hooks/usePasswordServerCheck';
import { useDebounce } from '../../../hooks/useDebounce';

const PasswordRules = ({ newPwd, oldPwd }) => {
  const rules = pwdRules(newPwd, oldPwd);
  const debouncedPassword = useDebounce(newPwd);
  const shouldCheck = debouncedPassword.length >= 12;
  const { isValid, error, loading } = usePasswordServerCheck(shouldCheck ? debouncedPassword : '');

  const serverRule = {
    key: 'server',
    label: loading
      ? 'Verificando en el servidor…'
      : isValid
        ? 'Contraseña segura.'
        : error
            ? error
            : 'Contraseña vulnerable.',
    test: () => !loading && isValid
  };
  const isServerValid = serverRule.test();

  return (
    <List dense>
      {rules.map(rule => {
        const valid = rule.test(newPwd);
        return (
          <ListItem key={rule.key}>
            <ListItemIcon>
              {valid
                ? <MdCheckCircle style={{ color: 'green' }} />
                : <MdCancel style={{ color: 'red' }} />
              }
            </ListItemIcon>
            <ListItemText primary={rule.label} sx={{ color: valid ? 'success.main' : 'error.main' }}/>
          </ListItem>
        );
      })}
      <ListItem key={serverRule.key}>
        <ListItemIcon>
          {loading
            ? <CircularProgress size={16} thickness={5} />
            : isServerValid
              ? <MdCheckCircle style={{ color: 'green' }} />
              : <MdCancel style={{ color: 'red' }} />
          }
        </ListItemIcon>
        <ListItemText primary={serverRule.label} sx={{ color: isServerValid ? 'success.main' : 'error.main' }}/>
      </ListItem>
    </List>
  );
}

export default PasswordRules;
