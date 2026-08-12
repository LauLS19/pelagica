import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { init } from '@noriginmedia/norigin-spatial-navigation';
import { setClientInfo } from '@pelagica/core';
import App from './App.tsx';
import pkg from '../package.json' with { type: 'json' };

import './index.css';
import './theme.css';

init();
setClientInfo({ name: 'Pelagica Tizen', version: pkg.version });

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
