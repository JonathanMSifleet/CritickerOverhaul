// must load before App
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import Context from './hooks/store/context';
import StateHook from './hooks/store/StateHook';
import './styles/global.scss';

const AppWithState = (): JSX.Element => {
  const store = StateHook();
  return (
    <Context.Provider value={store}>
      <App />
    </Context.Provider>
  );
};

render(
  <StrictMode>
    <AppWithState />
  </StrictMode>,
  document.getElementById('app')
);
