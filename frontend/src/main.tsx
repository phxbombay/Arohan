
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// import "./styles/global.css";

import { LocationProvider } from "./context/LocationContext";
import { initGA } from './utils/analytics';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize Google Analytics 4
initGA();

// Register Service Worker for PWA
serviceWorkerRegistration.register();

createRoot(document.getElementById("root")!).render(
    <LocationProvider>
        <App />
    </LocationProvider>
);
