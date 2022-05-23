// must load before App
import './styles/global.scss';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { RecoilRoot } from 'recoil';
import { render } from 'preact';
import App from './App';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('app')!
);
