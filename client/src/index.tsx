import 'bootstrap-css-only/css/bootstrap.min.css';
import './assets/MDBootstrap/scss/mdb-free.scss';
import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './styles/global.scss';

// const AppWithState = () => {
//   const store = StateHook();
//   return (
//     <Context.Provider value={store}>
//       <App />
//     </Context.Provider>
//   );
// };

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
