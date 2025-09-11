import React from 'react'
import { BsQuestionCircle } from "react-icons/bs";
import Popover from '@mui/material/Popover';

const IconPopOver = ({shownElement, setAnchorEl, anchorEl, icon: Icon = BsQuestionCircle}) => {
    const handlePopoverOpen = (e) => setAnchorEl(e.currentTarget) 
    const handlePopoverClose = () => setAnchorEl(null);
    const popoverOpen = Boolean(anchorEl);
    
    const iconProps = {
        style: {verticalAlign: 'text-top', marginLeft:'3px'},
        onMouseEnter: handlePopoverOpen,
        // onMouseLeave: handlePopoverClose,
        onFocus: handlePopoverOpen,
        onBlur: handlePopoverClose,
        tabIndex: 0,
    }

    return (
        <>
            <Icon {...iconProps}/>
            <Popover
                anchorEl={anchorEl} open={popoverOpen} onClose={handlePopoverClose} 
                disableRestoreFocus disableEnforceFocus disableAutoFocus disableScrollLock
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} transformOrigin={{vertical:'top', horizontal:'left'}}
                slotProps={{ paper: {onMouseEnter: handlePopoverOpen, onMouseLeave: handlePopoverClose,}, }}
                PopperProps={{strategy: 'fixed'}}
            >
                {shownElement}
            </Popover>
        </>
    )
}

export default IconPopOver