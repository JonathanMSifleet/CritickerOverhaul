import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import AbusePolicy from './components/pages/FooterPages/AbusePolicy/AbusePolicy';
import PrivacyPolicy from './components/pages/FooterPages/PrivacyPolicy/PrivacyPolicy';
import Home from './components/pages/Home/Home';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/privacy">
          <PrivacyPolicy />
        </Route>
        <Route exact path="/abuse">
          <AbusePolicy />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
