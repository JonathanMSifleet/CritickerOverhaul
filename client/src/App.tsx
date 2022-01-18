import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Film from './components/pages/Film/Film';
import Home from './components/pages/Home/Home';
import Profile from './components/pages/Profile/Profile';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';
import { userInfoState } from './recoilStore/store';

const App: React.FC = () => {
  // @ts-expect-error
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  // application logic goes here:

  useEffect(() => {
    autoLogin();
  }, []);

  const autoLogin = (): void => {
    const sessionStorageUserData = sessionStorage.getItem('userData');
    if (sessionStorageUserData) {
      const userData = JSON.parse(sessionStorageUserData);

      if (new Date().getTime() > userData!.expiryDate) {
        sessionStorage.removeItem('userData');
      } else {
        setUserInfo(userData);
      }
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/privacy'} element={<TextOnlyPage pageName={`privacy`} />} />
        <Route path={'/abuse'} element={<TextOnlyPage pageName={`abuse`} />} />
        <Route path={'/contact'} element={<TextOnlyPage pageName={`contact`} />} />
        <Route path={'/about'} element={<TextOnlyPage pageName={`about`} />} />
        <Route path={'/resources'} element={<TextOnlyPage pageName={`resources`} />} />
        <Route path={'/terms'} element={<TextOnlyPage pageName={`terms`} />} />
        <Route path={'/profile/*'} element={<Profile />} />
        <Route path={'/film/*'} element={<Film />} />
        <Route path="" element={<Navigate to="/?error=404" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
