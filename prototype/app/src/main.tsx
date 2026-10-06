import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { demoData } from './store/seed';
import { useStore } from './store/store';
import './styles/app.css';

// Data lives in memory only (no saving), so every load starts fresh with the sample data for a quick tour.
// URL switch, nothing on screen (D25): ?seed=empty starts with no data instead → 1.0 Welcome.
const seed = new URLSearchParams(location.search).get('seed');
useStore.getState().replace(seed === 'empty' ? null : demoData());
if (seed) history.replaceState(null, '', location.pathname + '#/');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
