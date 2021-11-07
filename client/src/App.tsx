import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home/Home';
import TextOnlyPage from './components/pages/TextOnlyPage/TextOnlyPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/privacy">
          <TextOnlyPage pageName={`privacy`} />
        </Route>
        <Route path="/abuse">
          <TextOnlyPage pageName={`abuse`} />
        </Route>
        <Route path="/contact">
          <TextOnlyPage pageName={`contact`} />
        </Route>
        <Route path="/about">
          <TextOnlyPage pageName={`about`} />
        </Route>
        <Route path="/resources">
          <TextOnlyPage pageName={`resources`} />
        </Route>
        <Route path="/terms">
          <TextOnlyPage pageName={`terms`} />
        </Route>
        <Navigate to="/?error=404" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
