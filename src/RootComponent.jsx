import React, { useEffect } from 'react';
import { StrictMode } from 'react';
import OneSignal from 'react-onesignal';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import App from './App';

const RootComponent = () => {
    useEffect(() => {
        // OneSignal is initialized in index.html
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
