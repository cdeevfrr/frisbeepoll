import React, { CSSProperties, useEffect, useState } from 'react';
import { PollResponses } from './Components/PollResponses';
import { NameEntry } from './Components/NameEntry';
import Cookies from 'js-cookie';
import { ResponseDetails } from './Components/ResponseDetails';
import { loadPollResponses, PollResponse, submitResponse } from './Components/sheetsAPI';

export interface PendingResponseDetails {
  willComeIfAtLeast: number,
  extras: number,
  weather: number, // percentage indicating the highest chance of rain where you'll still come
}

function App() {
  const [userName, setUserName] = useState<string | undefined>(Cookies.get("userName"));
  const [pollResponses, setPollResponses] = useState<Array<PollResponse>>([]);
  const [loadingPollResponses, setLoadingPollResponses] = useState(false);

  // local draft of response (editing mode)
  const [pendingResponseDetails, setPendingResponseDetails] = useState<PendingResponseDetails>({
    willComeIfAtLeast: 0,
    extras: 0,
    weather: 50,
  });

  // once submitted, backend is source of truth
  const [submittedResponse, setSubmittedResponse] = useState<PollResponse | undefined>();

  // On first render, load poll responses.
  useEffect(() => {
    reloadPollResponses({setPollResponses, setLoadingPollResponses, setSubmittedResponse, userName});
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.appHeader}>
        <div style={styles.headerTop}>
          <PollResponses pollResponses={pollResponses}/>
          <button 
            onClick={() => reloadPollResponses({setPollResponses, setLoadingPollResponses, setSubmittedResponse, userName})}
            disabled={loadingPollResponses}
            style={styles.button}
          >
            {loadingPollResponses ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <NameEntry 
          setNameCallback={async (name)=>{
            Cookies.set("userName", name, {expires: 180})
            setSubmittedResponse(undefined)
            setUserName(name)
            try{
              await reloadPollResponses({setPollResponses, setLoadingPollResponses, setSubmittedResponse, userName: name})
            } catch (err) {
              console.log(JSON.stringify(err))
              // TODO: make it clear to the user that an error happened.
              setLoadingPollResponses(false)
            }
          }} 
          existingName={userName}
        />
      </header>

      <main style={styles.pageContainer}>
        {userName && (
          <div style={styles.card}>
            {!loadingPollResponses && <ResponseDetails
              userName={userName}
              pending={pendingResponseDetails}
              onChangePending={setPendingResponseDetails}
              submitted={submittedResponse}
              onSubmit={async () => {  
                setLoadingPollResponses(true)   
                try{
                  await submitResponse({
                    response: { 
                      userName: userName,
                      weather: pendingResponseDetails.weather,
                      willBring: pendingResponseDetails.extras + 1,
                      willComeIfAtLeast: pendingResponseDetails.willComeIfAtLeast,
                    },
                    sourceID: "Unused",
                  })      
                  // This will eventually set loadingPollResponses(false)
                  await reloadPollResponses({setPollResponses, setLoadingPollResponses, setSubmittedResponse, userName});
                } catch (err) {
                  console.log(JSON.stringify(err))
                  // TODO: make it clear to the user that an error happened.
                  setLoadingPollResponses(false)
                }
              }}
            />}
          </div>
        )}
      </main>
    </div>
  );
}

async function reloadPollResponses ({
  setPollResponses, 
  setLoadingPollResponses, 
  setSubmittedResponse, 
  userName
}: {
  setPollResponses: (responses: Array<PollResponse>) => void, 
  setLoadingPollResponses: (b: boolean) => void, 
  setSubmittedResponse: (response: PollResponse) => void, 
  userName: string | undefined,
}) {
  setLoadingPollResponses(true)
  const responses = await loadPollResponses()
  
  if (!responses){
    setLoadingPollResponses(false)
    return
  }

  setPollResponses(responses)

  const foundResponse = responses.find(response => response.userName === userName)
    if (foundResponse){
    setSubmittedResponse(foundResponse)
  }

  setLoadingPollResponses(false)

}

export default App;

const styles: {[key: string]: CSSProperties} = {
  app: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f7f8fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  appHeader: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  },
  pageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem 1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  button: {
    backgroundColor: '#2563eb',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  }
};
