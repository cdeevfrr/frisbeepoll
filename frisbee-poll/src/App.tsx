import React, { CSSProperties, useEffect, useState } from 'react';
import { PollResponses } from './Components/PollResponses';
import { NameEntry } from './Components/NameEntry';
import Cookies from 'js-cookie';
import { ResponseFlow } from './Components/ResponseFlow';
import { loadPollResponses, PollResponse } from './Components/DataLoading';

// TODO NEXT
// - I need to make a response flow.
//
//  Page 1:
//    Floating header shows who's there
//    Name needs to fill in
//       "What do we call you on the field?"
//  
//  Page 2:
//    Same floating header
//    Shows sane defaults for all the responses
//    Submit button. 
//
//  Page 3:
//    Same floating header
//    _name_, you've responded with ___
//    Button at the bottom to make a new response (takes you to page 2 state)

interface PendingResponseDetails {
  willComeIfAtLeast: number,
  willBring: number,
  weather: number, // percentage indicating the highest chance of rain where you'll still come
}

function App() {
  const [userName, setUserName] = useState<string | undefined>(Cookies.get("userName"));

  const [pollResponses, setPollResponses] = useState<Array<PollResponse>>([]);
      const [loadingPollResponses, setLoadingPollResponses] = useState(false)
  
      useEffect(() => {
          loadPollResponses(setPollResponses, setLoadingPollResponses)
      }, [])

  const [pendingResponseDetails, setPendingResponseDetails] = useState<PendingResponseDetails>({
    willComeIfAtLeast: 0,
    willBring: 1,
    weather: 1,
  })

  return (
    <div style={{textAlign: 'center'}}>
      <header style={styles.appHeader}>
          <PollResponses pollResponses={pollResponses}/>
          <button 
            onClick={() => loadPollResponses(setPollResponses, setLoadingPollResponses)}
            disabled={loadingPollResponses}
          >Refresh</button>
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
