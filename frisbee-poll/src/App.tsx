import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PollResponses } from './Components/PollResponses';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <PollResponses/>
      </header>
    </div>
  );
}

export default App;
