/**
 * Application Entry Point
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('App', () => App);

// Mount for web
const rootTag = document.getElementById('root');

if (rootTag) {
  const root = createRoot(rootTag);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
