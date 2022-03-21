const Film = lazy(() => import('./views/Film/Film'));
const Home = lazy(() => import('./views/Home/Home'));
const Profile = lazy(() => import('./views/Profile/Profile'));
const Ratings = lazy(() => import('./views/Ratings/Ratings'));
const TextOnlyPage = lazy(() => import('./views/TextOnlyPage/TextOnlyPage'));

import 'preact/debug';

import { FC, useEffect, useState } from 'react';
import { Suspense, lazy } from 'preact/compat';

import Router from 'preact-router';
import Spinner from './components/Spinner/Spinner';
import { createHashHistory } from 'history';

const App: FC = () => {
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
        <Suspense fallback={<Spinner />}>
          {/* @ts-expect-error */}
          <Router history={createHashHistory()}>
            <Home path="/" />
            <TextOnlyPage path="/information/:path" />
            <Film path={'/film/:id'} />
            <Profile path={'/profile/:username?'} />
            <Ratings path={'/ratings/:username?'} />
          </Router>
        </Suspense>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
