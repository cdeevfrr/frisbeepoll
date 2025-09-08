import React, { CSSProperties } from 'react';
import { PollResponses } from './Components/PollResponses';

function App() {
  return (
    <div style={{textAlign: 'center'}}>
      <header style={styles.appHeader}>
        <PollResponses/>
      </header>
    </div>
  );
}

export default App;

const styles: {[key: string]: CSSProperties} = {
  appHeader: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }
}
