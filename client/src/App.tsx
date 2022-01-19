import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Film from './components/pages/Film/Film';
import Home from './components/pages/Home/Home';
import Profile from './components/pages/Profile/Profile';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/privacy'} element={<TextOnlyPage pageName={`privacy`} />} />
        <Route path={'/abuse'} element={<TextOnlyPage pageName={`abuse`} />} />
        <Route path={'/contact'} element={<TextOnlyPage pageName={`contact`} />} />
        <Route path={'/about'} element={<TextOnlyPage pageName={`about`} />} />
        <Route path={'/resources'} element={<TextOnlyPage pageName={`resources`} />} />
        <Route path={'/terms'} element={<TextOnlyPage pageName={`terms`} />} />
        <Route path={'/profile/'} element={<Profile />} />
        <Route path={'/profile/:id'} element={<Profile />} />
        <Route path={'/film/:id'} element={<Film />} />
        <Route path="" element={<Navigate to="/?error=404" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
