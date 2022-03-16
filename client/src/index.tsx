// must load before App

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import './styles/global.scss';

import App from './App';
import { RecoilRoot } from 'recoil';
import { render } from 'preact';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('app')!
);
