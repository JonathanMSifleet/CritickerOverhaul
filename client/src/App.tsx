import React from 'react';

const App: React.FC = () => {
  return (
    <>
      <h2>Welcome to React App</h2>
      <h3>Date : {new Date().toDateString()}</h3>
    </>
  );
};

export default App;
