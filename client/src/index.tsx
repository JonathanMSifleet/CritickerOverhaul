// must load before App
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { render } from 'preact';
import { RecoilRoot } from 'recoil';
import App from './App';
import './styles/global.scss';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('app')!
);
