import React from 'react';
import { createRoot } from 'react-dom/client';
import MoneyTracker from './components/MoneyTracker';

const container = document.getElementById('root');
const root = createRoot(container);

document.addEventListener('DOMContentLoaded', () => {
    root.render(<MoneyTracker />);
});