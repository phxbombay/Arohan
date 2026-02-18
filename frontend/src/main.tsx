
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// import "./styles/global.css";

import { LocationProvider } from "./context/LocationContext";
import { SocketProvider } from "./context/SocketContext";
import { initGA } from './utils/analytics';
// Service Worker DISABLED — was caching stale content and causing iOS white screen
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize Google Analytics 4
initGA();

// Service Worker DISABLED — was the root cause of iOS white screen (stale cache)
// serviceWorkerRegistration.register();

createRoot(document.getElementById("root")!).render(
    <LocationProvider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </LocationProvider>
);
