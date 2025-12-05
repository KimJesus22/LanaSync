import React, { useEffect } from 'react';
import { StrictMode } from 'react';
import OneSignal from 'react-onesignal';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import App from './App';

const RootComponent = () => {
    useEffect(() => {
        // Initialize OneSignal
        // Replace 'YOUR-ONESIGNAL-APP-ID' with the actual ID provided by the user
        OneSignal.init({
            appId: "YOUR-ONESIGNAL-APP-ID",
            allowLocalhostAsSecureOrigin: true,
        }).then(() => {
            console.log("OneSignal Initialized");
        }).catch(err => {
            console.error("OneSignal Initialization Error:", err);
        });
    }, []);

    return (
        <StrictMode>
            <GlobalErrorBoundary>
                <App />
            </GlobalErrorBoundary>
        </StrictMode>
    );
};

export default RootComponent;
