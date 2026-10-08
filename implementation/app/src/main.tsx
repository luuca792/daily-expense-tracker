import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
// Font bundled with the app (not Google Fonts) so the installed app looks the same offline (D55).
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

// Boot (plan §4.2: open DB → load/migrate → <App> or <BootError>) is added with the data layer in §7 step 2.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
