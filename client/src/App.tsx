import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Home from './components/pages/Home/Home';
import SimplePage from './components/pages/SimplePage/SimplePage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/privacy">
          <SimplePage pageName={`privacy`} />
        </Route>
        <Route exact path="/abuse">
          <SimplePage pageName={`abuse`} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
