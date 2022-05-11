// must load before App
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// eslint-disable-next-line sort-imports-es6-autofix/sort-imports-es6
import './styles/global.scss';
import { RecoilRoot } from 'recoil';
import { render } from 'react-dom';
import App from './App';

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById('root')
);
