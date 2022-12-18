// must load before App
import './styles/global.scss';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { render } from 'preact';
import App from './App';

const queryClient = new QueryClient();

render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('app')!
);
