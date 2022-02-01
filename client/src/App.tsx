import Router from 'preact-router';
import { useEffect, useState } from 'react';
import Spinner from './components/elements/Spinner/Spinner';
// const Film = lazy(() => import('./components/pages/Film/Film'));
import Home from './components/pages/Home/Home';
// const Profile = lazy(() => import('./components/pages/Profile/Profile'));
// const TextOnlyPage = lazy(() => import('./components/pages/TextOnlyPage/TextOnlyPage'));

const App: React.FC = () => {
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Roboto"').then(() => {
      setFontReady(true);
    });
  }, []);

  return (
    <>
      {fontReady ? (
        // @ts-expect-error
        <Router>
          <Home path={'/'} />
          {/* <TextOnlyPage path={'/privacy'}  />
              <TextOnlyPage path={'/abuse'} />
              <TextOnlyPage path={'/contact'}  />
              <TextOnlyPage path={'/about'}  />
              <TextOnlyPage path={'/resources'} e />
              <TextOnlyPage path={'/terms'} />
              <Route path={'/profile/'} element={<Profile />} />
              <Route path={'/profile/:username'} element={<Profile />} />
              <Route path={'/film/:id'} element={<Film />} />
              <Route path="/*" element={<Navigate to="/?error=404" />} /> */}
        </Router>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
