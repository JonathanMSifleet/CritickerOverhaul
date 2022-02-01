const Film = lazy(() => import('./components/pages/Film/Film'));
const Home = lazy(() => import('./components/pages/Home/Home'));
const Profile = lazy(() => import('./components/pages/Profile/Profile'));
const TextOnlyPage = lazy(() => import('./components/pages/TextOnlyPage/TextOnlyPage'));
import { createHashHistory } from 'history';
import Router from 'preact-router';
import { lazy, Suspense } from 'preact/compat';
import { FC, useEffect, useState } from 'react';
import Spinner from './components/elements/Spinner/Spinner';

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
            {/* to do: <AsyncRoute
            path={'/*'}
            getComponent={(): Promise<FC> =>
              import('./components/pages/Home/Home').then((module) => module.default)
            }
          /> */}
          </Router>
        </Suspense>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
