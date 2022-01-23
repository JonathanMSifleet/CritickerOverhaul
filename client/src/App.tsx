import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Spinner from './components/elements/Spinner/Spinner';
const Film = lazy(() => import('./components/pages/Film/Film'));
const Home = lazy(() => import('./components/pages/Home/Home'));
const Profile = lazy(() => import('./components/pages/Profile/Profile'));
const TextOnlyPage = lazy(() => import('./components/pages/TextOnlyPage/TextOnlyPage'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/privacy'} element={<TextOnlyPage pageName={`privacy`} />} />
          <Route path={'/abuse'} element={<TextOnlyPage pageName={`abuse`} />} />
          <Route path={'/contact'} element={<TextOnlyPage pageName={`contact`} />} />
          <Route path={'/about'} element={<TextOnlyPage pageName={`about`} />} />
          <Route path={'/resources'} element={<TextOnlyPage pageName={`resources`} />} />
          <Route path={'/terms'} element={<TextOnlyPage pageName={`terms`} />} />
          <Route path={'/profile/'} element={<Profile />} />
          <Route path={'/profile/:username'} element={<Profile />} />
          <Route path={'/film/:id'} element={<Film />} />
          <Route path="/" element={<Navigate to="/?error=404" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
