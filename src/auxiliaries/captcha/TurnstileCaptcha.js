import React, { useRef, useEffect } from 'react'

export default function TurnstileCaptcha({siteKey, onVerify, theme = 'light'}) {
    const widgetId = useRef(null);

    useEffect(() => {
        console.log('siteKey →', siteKey, typeof siteKey);
        if(!window.turnstile || widgetId.current !== null) return;

        widgetId.current = window.turnstile.render('#cf-turnstile', {
            sitekey: siteKey,
            theme,
            callback: (token) => onVerify(token),
            'error-callback': () => onVerify(null),
            'expired-callback': () => onVerify(null),
        });
    }, [siteKey, onVerify]);

    return <div id='cf-turnstile' style={{alignSelf:'flex-end', margin:'6px 0'}}/>
}