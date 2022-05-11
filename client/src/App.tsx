import { detect } from 'detect-browser';
import { FC, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
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
  // const resetUserState = useResetRecoilState(userInfoState);
  // const userState = useRecoilValue(userInfoState);

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

  // const detectRouteChange = (): void => {
  //   if (!userState.loggedIn) return;

  //   if (userState.accessToken.accessTokenExpiry < Date.now()) {
  //     alert('Your access token has expired. Please log in again');
  //     resetUserState();
  //   }
  // };

  return (
    <>
      {fontReady ? (
        <Suspense fallback={<Spinner />}>
          <HashRouter>
            <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={'/film/:imdbID'} element={<Film />} />
              <Route path={'/profile/:username'} element={<Profile />} />
              <Route path={'/passwordReset/:emailAddress/:token'} element={<PasswordReset />} />
              <Route path={'/ratings/:username'} element={<Ratings />} />
              <Route path={'/search/:searchQuery'} element={<Search />} />
              <Route path={'/verifyEmail/:username/:token'} element={<VerifyEmail />} />

              <Route path={'/privacy'} element={<TextOnlyPage />} />
              <Route path={'/abuse'} element={<TextOnlyPage />} />
              <Route path={'/contact'} element={<TextOnlyPage />} />
              <Route path={'/about'} element={<TextOnlyPage />} />
              <Route path={'/resources'} element={<TextOnlyPage />} />
              <Route path={'/terms'} element={<TextOnlyPage />} />
              <Route path="/*" element={<InvalidRoute />} />
            </Routes>
          </HashRouter>
        </Suspense>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default App;
