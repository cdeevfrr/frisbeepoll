export interface PollResponse {
    userName: string,
    willComeIfAtLeast: number,
    willBring: number,
    weather: number,
}

// - I need to update the backend to key off name not name,ID.


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
export async function loadPollResponses(
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

