import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home/Home';
import Profile from './components/pages/Profile/Profile';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Redirect to="/?error=404" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
