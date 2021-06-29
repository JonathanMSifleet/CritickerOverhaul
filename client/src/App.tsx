import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Auth from './components/pages/Auth/Auth';
import Home from './components/pages/Home/Home';
import PrivacyPolicy from './components/pages/PrivacyPolicy/PrivacyPolicy';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route exact path="/privacy">
          <PrivacyPolicy />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
