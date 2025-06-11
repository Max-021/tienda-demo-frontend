import React from "react";
import { NotificationProvider } from "./components/reusables/NotificationContext";
import { LoadingProvider } from "./components/reusables/LoadingContext";
import App from "./App";

const Providers = () => {
    return <NotificationProvider>
        <LoadingProvider>
            <App/>
        </LoadingProvider>
    </NotificationProvider>
}

export default Providers;