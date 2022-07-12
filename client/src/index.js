import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { interceptor } from './utils/interceptor';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container);

//apply interceptor to customFetch
interceptor(store);

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer
      position='top-center'
      autoClose={2000}
      hideProgressBar
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      transition={Zoom}
    />
  </Provider>
);
