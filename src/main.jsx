import React from 'react';
import { createRoot } from 'react-dom/client';
import ClaimsManagement from './components/ClaimsManagement';
import './styles.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><ClaimsManagement /></React.StrictMode>);
