import 'bootstrap-css-only/css/bootstrap.min.css';
import './assets/MDBootstrap/scss/mdb-free.scss';
import './styles/global.scss';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import Context from './hooks/store/context';
import StateHook from './hooks/store/StateHook';

const AppWithState = () => {
  const store = StateHook();
  return (
    <Context.Provider value={store}>
      <App />
    </Context.Provider>
  );
};

ReactDom.render(
  <React.StrictMode>
    <AppWithState />
  </React.StrictMode>,
  document.getElementById('app')
);
