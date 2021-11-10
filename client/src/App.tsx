import React from 'react';
import Home from './components/pages/Home/Home';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

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
        <Redirect to="/?error=404" />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
