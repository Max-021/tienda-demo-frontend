import React from 'react'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MdCheckCircle, MdCancel } from 'react-icons/md'

import { pwdRules } from '../../../auxiliaries/validationFunctions'

const PasswordRules = ({newPwd, oldPwd}) => {

    const rules = pwdRules(newPwd, oldPwd);
    return (
        <List dense>
        {rules.map(rule => {
            const valid = rule.test(newPwd)
            return (
            <ListItem key={rule.key}>
                <ListItemIcon>
                {valid
                    ? <MdCheckCircle style={{ color: 'green' }} />
                    : <MdCancel style={{ color: 'red' }} />
                }
                </ListItemIcon>
                <ListItemText
                primary={rule.label}
                sx={{ color: valid ? 'success.main' : 'error.main' }}
                />
            </ListItem>
            )
        })}
        </List>
    )
}

export default PasswordRules