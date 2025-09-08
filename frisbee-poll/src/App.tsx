import React, { CSSProperties, useState } from 'react';
import { PollResponses } from './Components/PollResponses';
import { NameEntry } from './Components/NameEntry';
import Cookies from 'js-cookie';
import { ResponseFlow } from './Components/ResponseFlow';


function App() {
  const [userName, setUserName] = useState<string | undefined>(Cookies.get("userName"));

  return (
    <div style={{textAlign: 'center'}}>
      <header style={styles.appHeader}>
          <PollResponses/>
          <NameEntry 
          setNameCallback={async (name)=>{
            Cookies.set("userName", name, {expires: 180})
            setUserName(name)
          }} 
          existingName={userName}
          />
      </header>
      <div style={styles.appHeader}>
        {userName && <ResponseFlow/>}
      </div>
    </div>
  );
}

export default App;

const styles: {[key: string]: CSSProperties} = {
  appHeader: {
    backgroundColor: '#282c34',
    minHeight: '10vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }
}
