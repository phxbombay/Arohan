
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// import "./styles/global.css";

import { LocationProvider } from "./context/LocationContext";
import { SocketProvider } from "./context/SocketContext";
import { initGA } from './utils/analytics';
// Service Worker ENABLED with optimized logic for Safari/iOS
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize Google Analytics 4
initGA();

// Service Worker ENABLED - robust logic added to serviceWorkerRegistration.ts
serviceWorkerRegistration.register();

createRoot(document.getElementById("root")!).render(
    <LocationProvider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </LocationProvider>
);
