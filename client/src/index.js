import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { interceptor } from './utils/interceptor';
const container = document.getElementById('root');
const root = createRoot(container);

//apply interceptor to customFetch
interceptor(store);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
