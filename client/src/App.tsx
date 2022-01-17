import React, { useContext, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Film from './components/pages/Film/Film';
import Home from './components/pages/Home/Home';
import Profile from './components/pages/Profile/Profile';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';
import * as actionTypes from './hooks/store/actionTypes';
import Context from './hooks/store/context';

const App: React.FC = () => {
  // application logic goes here:

  const { actions } = useContext(Context);

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
        actions({
          type: actionTypes.setUserInfo,
          payload: userData
        });
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
