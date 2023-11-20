import { CssBaseline } from '@mui/material';

import { Provider } from 'react-redux';
import store from './store/store';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

export const API_URL = "http://127.0.0.1:8000/api/";
export const API_STATIC_MEDIA = "http://127.0.0.1:8000/";
export const IS_DEBUG = false;




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
