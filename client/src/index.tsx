// import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'bootstrap-css-only/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './assets/MaterialBootStrap/scss/mdb-free.scss';
import Context from './hooks/store/context';
import StateHook from './hooks/store/StateHook';
import './styles/global.scss';

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
