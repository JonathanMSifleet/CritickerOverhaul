import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Home from './components/pages/Home/Home';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';

const App: React.FC = () => {
  return (
    <Router>
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
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
