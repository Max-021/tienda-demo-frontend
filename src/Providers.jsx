import React from "react";
import { NotificationProvider } from "./components/reusables/NotificationContext.jsx";
import { LoadingProvider } from "./components/reusables/LoadingContext.jsx";
import App from "./App.jsx";

const Providers = () => {
    return <NotificationProvider>
        <LoadingProvider>
            <App/>
        </LoadingProvider>
    </NotificationProvider>
}

export default Providers;