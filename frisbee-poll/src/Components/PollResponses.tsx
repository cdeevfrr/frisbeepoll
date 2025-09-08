/**
 * The PollResponses component loads poll responses from the "server"
 * and shows how many people are expected to show up.
 * 
 * Users can also refresh the data (re-loading from server).
 */

import { useEffect, useState } from "react";


interface PollResponse {
    userName: string,
    willComeIfAtLeast: 6,
    willBring: 1,
}

export function PollResponses(){
    const [pollResponses, setPollResponses] = useState<Array<PollResponse>>([]);
    const [loadingPollResponses, setLoadingPollResponses] = useState(false)

    useEffect(() => {
        loadPollResponses(setPollResponses, setLoadingPollResponses)
    }, [])

    return <div>
        <p>I see {pollResponses.length} responses</p>
        <button 
          onClick={() => loadPollResponses(setPollResponses, setLoadingPollResponses)}
          disabled={loadingPollResponses}
        >Refresh</button>
    </div>
}

// Example response can be acquired from top level Readme testing commands for backend.
// {
//   "pollId":"TestPoll",
//   "responses":[
//      {
//        "userName":"Danny",
//        "sourceID":"abc123",
//        "pollId":"TestPoll",
//        "willComeIfAtLeast":6,
//        "willBring":1,
//        "weather":40,
//        "timestamp":"2025-09-08T19:30:50.539Z"
//  }]}
async function loadPollResponses(
        setPollResponsesCallback: (responses: Array<PollResponse>) => void, 
        setLoadingPollResponses: (b: boolean) => void
) {
    setLoadingPollResponses(true)
    const params = new URLSearchParams({action: "getPollResponses"})
    const url = new URL("https://script.google.com/macros/s/AKfycbylpnPSTkSud1nAMM4Uju39-fpalnYIOf6Hsfi7bXdphaAK_YwrtgBhHksTpPhlBRa2uQ/exec")
    url.search = params.toString()

    const response = await fetch(url)

    const body = await response.json()

    // TODO: Actually verify shape of body, throw errors if bad.
    // This is just a stand-in.
    if (body.responses.length > 0 && body.responses[0]){
        setPollResponsesCallback(body.responses)
    }
    setLoadingPollResponses(false)
}