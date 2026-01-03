/**
 * Point d'entrée principal de l'application React.
 * Configure React et monte l'application sur le DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'leaflet/dist/leaflet.css';

/**
 * Récupère l'élément root du DOM.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error(
        'Élément root non trouvé. Assurez-vous que index.html contient <div id="root"></div>'
    );
}

/**
 * Crée la racine React et monte l'application.
 */
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
