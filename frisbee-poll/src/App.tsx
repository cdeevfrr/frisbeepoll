import React, { CSSProperties, useEffect, useState } from 'react';
import { PollResponses } from './Components/PollResponses';
import { NameEntry } from './Components/NameEntry';
import Cookies from 'js-cookie';
import { loadPollResponses, PollResponse } from './Components/DataLoading';
import { ResponseDetails } from './Components/ResponseDetails';

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

export interface PendingResponseDetails {
  willComeIfAtLeast: number,
  willBring: number,
  weather: number, // percentage indicating the highest chance of rain where you'll still come
}

function App() {
  const [userName, setUserName] = useState<string | undefined>(Cookies.get("userName"));
  const [pollResponses, setPollResponses] = useState<Array<PollResponse>>([]);
  const [loadingPollResponses, setLoadingPollResponses] = useState(false);

  // local draft of response (editing mode)
  const [pendingResponseDetails, setPendingResponseDetails] = useState<PendingResponseDetails>({
    willComeIfAtLeast: 0,
    willBring: 1,
    weather: 50,
  });

  // once submitted, backend is source of truth
  const [submittedResponse, setSubmittedResponse] = useState<PollResponse | undefined>();

  // On first render, load poll responses.
  useEffect(() => {
    loadPollResponses(setPollResponses, setLoadingPollResponses);
  }, []);

  // When poll responses changes, update submitted response.
  useEffect(() => {
    const foundResponse = pollResponses.find(response => response.userName === userName)
    if (foundResponse){
      setSubmittedResponse(foundResponse)
    }
  }, pollResponses)

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

      <main style={styles.pageContainer}>
        {userName && (
          <ResponseDetails
            userName={userName}
            pending={pendingResponseDetails}
            onChangePending={setPendingResponseDetails}
            submitted={submittedResponse}
            onSubmit={async () => {
              // TODO: send to backend (make sure to await, so the load will see our edits)
              setSubmittedResponse({
                userName: userName,
                weather: pendingResponseDetails.weather,
                willBring: pendingResponseDetails.willBring,
                willComeIfAtLeast: pendingResponseDetails.willComeIfAtLeast
              })
              // This re-load will trigger another setSubmittedResponse because of 
              // the useEffect watching for changes in pollResponses.
              // That's ok.
              await loadPollResponses(setPollResponses, setLoadingPollResponses);
              
            }}
          />
        )}
      </main>
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
  },
  pageContainer: {
    marginTop: '2rem',
  }
};