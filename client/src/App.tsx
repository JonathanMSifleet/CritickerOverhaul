import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import Spinner from './components/Spinner/Spinner';
const Film = lazy(() => import('./views/Film/Film'));
const Home = lazy(() => import('./views/Home/Home'));
const Profile = lazy(() => import('./views/Profile/Profile'));
const TextOnlyPage = lazy(() => import('./views/TextOnlyPage/TextOnlyPage'));

const App: React.FC = () => {
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    document.fonts.load('1rem "Roboto"').then(() => {
      setFontReady(true);
    });
  }, []);

  return (
    <>
      {!fontReady ? (
        <Spinner />
      ) : (
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
              <Route path="/*" element={<Navigate to="/?error=404" />} />
            </Routes>
          </Suspense>
        </HashRouter>
      )}
    </>
  );
};

export default App;

// import { FC, lazy, Suspense, useEffect, useState } from 'react';
// import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
// import Spinner from './components/Spinner/Spinner';

// const Film = lazy(() => import('./views/Film/Film'));
// const Home = lazy(() => import('./views/Home/Home'));
// const InvalidRoute = lazy(() => import('./views/InvalidRoute/InvalidRoute'));
// const PasswordReset = lazy(() => import('./views/PasswordReset/PasswordReset'));
// const Profile = lazy(() => import('./views/Profile/Profile'));
// const Ratings = lazy(() => import('./views/Ratings/Ratings'));
// const Search = lazy(() => import('./views/Search/Search'));
// const TextOnlyPage = lazy(() => import('./views/TextOnlyPage/TextOnlyPage'));
// const VerifyEmail = lazy(() => import('./views/VerifyEmail/VerifyEmail'));

// const App: FC = () => {
//   const [fontReady, setFontReady] = useState(false);

//   useEffect(() => {
//     document.fonts.load('1rem "Roboto"').then(() => {
//       setFontReady(true);
//     });
//   }, []);

//   return (
//     <>
//       {!fontReady ? (
//         <Spinner />
//       ) : (
//         <HashRouter>
//           <Suspense fallback={<Spinner />}>
//             <Routes>
//               <Route path={'/#/'} element={<Home />} />
//               <Route path={'/privacy'} element={<TextOnlyPage />} />
//               <Route path={'/abuse'} element={<TextOnlyPage />} />
//               <Route path={'/contact'} element={<TextOnlyPage />} />
//               <Route path={'/about'} element={<TextOnlyPage />} />
//               <Route path={'/resources'} element={<TextOnlyPage />} />
//               <Route path={'/terms'} element={<TextOnlyPage />} />
//               <Route path={'/profile/'} element={<Profile />} />
//               <Route path={'/profile/:username'} element={<Profile />} />
//               <Route path={'/film/:id'} element={<Film />} />
//               <Route path="/*" element={<Navigate to="/?error=404" />} />
//               <Route path={'/film/:imdbID'} element={<Film />} />
//               <Route path={'/profile/:username'} element={<Profile />} />
//               <Route path={'/passwordReset/:emailAddress/:token'} element={<PasswordReset />} />
//               <Route path={'/ratings/:username'} element={<Ratings />} />
//               <Route path={'/search/:searchQuery'} element={<Search />} />
//               <Route path={'/verifyEmail/:username/:token'} element={<VerifyEmail />} />

//               <Route path={'/privacy'} element={<TextOnlyPage />} />
//               <Route path={'/abuse'} element={<TextOnlyPage />} />
//               <Route path={'/contact'} element={<TextOnlyPage />} />
//               <Route path={'/about'} element={<TextOnlyPage />} />
//               <Route path={'/resources'} element={<TextOnlyPage />} />
//               <Route path={'/terms'} element={<TextOnlyPage />} />
//               <Route path="/*" element={<InvalidRoute />} />
//             </Routes>
//           </Suspense>
//         </HashRouter>
//       )}
//     </>
//   );
// };

// export default App;
