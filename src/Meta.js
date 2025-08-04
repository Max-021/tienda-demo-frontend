import React from "react";
import { Helmet } from "react-helmet";
import appInfo from "./data/appInfo";


const Meta = () => {
    return (
        <Helmet htmlAttributes={{
            lang: appInfo.lang,
        }}>
            <title>{appInfo.title}</title>
            <meta name="description" content={appInfo.description} />

            <link rel="icon" href={appInfo.favicon} />

            {appInfo.appleTouchIcon && (
            <link rel="apple-touch-icon" href={appInfo.appleTouchIcon} />
            )}
        </Helmet>
    )
}

export default Meta;