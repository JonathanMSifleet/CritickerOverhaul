import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './App.module.scss';

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
