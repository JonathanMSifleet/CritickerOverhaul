import { createHashHistory } from 'history';
import { detect } from 'detect-browser';
import { FC } from 'preact/compat';
import { lazy, Suspense } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userInfoState } from './store';
import Router from 'preact-router';
import Spinner from './components/Spinner/Spinner';

const Film = lazy(() => import('./views/Film/Film'));
const Home = lazy(() => import('./views/Home/Home'));
const InvalidRoute = lazy(() => import('./views/InvalidRoute/InvalidRoute'));
const Profile = lazy(() => import('./views/Profile/Profile'));
const PasswordReset = lazy(() => import('./views/PasswordReset/PasswordReset'));
const Ratings = lazy(() => import('./views/Ratings/Ratings'));
const Search = lazy(() => import('./views/Search/Search'));
const TextOnlyPage = lazy(() => import('./views/TextOnlyPage/TextOnlyPage'));
const VerifyEmail = lazy(() => import('./views/VerifyEmail/VerifyEmail'));

const App: FC = () => {
  const [fontReady, setFontReady] = useState(false);
  const resetUserState = useResetRecoilState(userInfoState);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    const hasShownWarning = localStorage.getItem('hasShownBrowserWarning');
    if (hasShownWarning) return;

    const browser = detect()!.name;
    if (!(browser === 'chrome' || browser === 'edge-chromium'))
      alert('This website may not work properly in your browser. Please use Chrome or Edge.');

    localStorage.setItem('hasShownBrowserWarning', 'true');
  }, []);

  useEffect(() => {
    document.fonts.load('1rem "Roboto"').then(() => setFontReady(true));
  }, []);

  const detectRouteChange = (): void => {
    if (!userState.loggedIn) return;

    if (userState.accessToken.accessTokenExpiry < Date.now()) {
      alert('Your access token has expired. Please log in again');
      resetUserState();
    }
  };

  return (
    <>
      {fontReady ? (
        // @ts-expect-error
        <Suspense fallback={<Spinner />}>
          {/* @ts-expect-error */}
          <Router history={createHashHistory()} onChange={detectRouteChange}>
            <Home path={'/'} />
            <Film path={'/film/:imdbID'} />
            <PasswordReset path={'/passwordReset/:emailAddress/:token'} />
            <Profile path={'/profile/:username?'} />
            <Ratings path={'/ratings/:username?'} />
            <Search path={'/search/:searchQuery'} />
            <TextOnlyPage path={'/information/:path'} />
            <VerifyEmail path={'/verifyEmail/:username/:token'} />
            <InvalidRoute path={'/:*'} />
          </Router>
        </Suspense>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
