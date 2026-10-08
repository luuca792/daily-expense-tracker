import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { requestPersist } from './data/persist';
import { getRepository } from './data/repository';
import { BootError } from './screens/BootError';
import { startAutosave } from './state/autosave';
import { useStore } from './state/store';
// Font bundled with the app (not Google Fonts) so the installed app looks the same offline (D55).
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

/** Boot (plan §4.2): ask for persistent storage → load / migrate / validate → <App> or <BootError> */
const root = ReactDOM.createRoot(document.getElementById('root')!);

async function boot() {
  void requestPersist();
  const repo = getRepository();
  const [res, lastExportAt] = await Promise.all([repo.load(), repo.getLastExportAt()]);
  if (res.kind === 'error') {
    console.error('BootError', res.reason, res.message);
    root.render(<BootError raw={res.raw} />);
    return;
  }
  useStore.getState().init(res.kind === 'ok' ? res.data : null, lastExportAt);
  startAutosave(useStore, { repo });
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

boot().catch((e) => {
  // IndexedDB unavailable (e.g. blocked in a private window): nothing can be read, so there is nothing to export
  console.error(e);
  root.render(<BootError raw={null} />);
});
