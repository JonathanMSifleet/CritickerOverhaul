import React, { useContext, useEffect } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
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

  const autoLogin = () => {
    let userData = sessionStorage.getItem('userData') as any;
    if (userData) {
      userData = JSON.parse(userData!);

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
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/privacy">
          <TextOnlyPage pageName={`privacy`} />
        </Route>
        <Route exact path="/abuse">
          <TextOnlyPage pageName={`abuse`} />
        </Route>
        <Route exact path="/contact">
          <TextOnlyPage pageName={`contact`} />
        </Route>
        <Route exact path="/about">
          <TextOnlyPage pageName={`about`} />
        </Route>
        <Route exact path="/resources">
          <TextOnlyPage pageName={`resources`} />
        </Route>
        <Route exact path="/terms">
          <TextOnlyPage pageName={`terms`} />
        </Route>
        <Route exact path="/profile/:username?">
          <Profile />
        </Route>
        <Route exact path="/film/:id">
          <Film />
        </Route>
        <Redirect to="/?error=404" />
      </Switch>
    </HashRouter>
  );
};

export default App;
