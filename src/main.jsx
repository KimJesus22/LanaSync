import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.jsx'
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import OneSignal from 'react-onesignal'; // Added OneSignal import
import React, { useEffect } from 'react'; // Added React and useEffect import for OneSignal initialization

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Wrapper component to handle OneSignal initialization
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

createRoot(document.getElementById('root')).render(
  <RootComponent />
)
