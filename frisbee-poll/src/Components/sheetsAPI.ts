export interface PollResponse {
    userName: string,
    willComeIfAtLeast: number,
    willBring: number,
    weather: number,
}

const baseURL = "https://script.google.com/macros/s/AKfycbw5SbH69fGoYclgyZa7yIeMY-Kbvw9wonzvDq9GE7yB9FNRUGvcVrxRuvatFeoDWoZpuw/exec"

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
    const url = new URL(baseURL)
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

export async function submitResponse({
    sourceID,
    response,
}:{
    sourceID: string,
    response: PollResponse
}): Promise<any> {
    const params = new URLSearchParams({action: "putPollResponse"})
    const url = new URL(baseURL)
    url.search = params.toString()

    const payload = {
        userName: response.userName,
        sourceID, // TODO remove. Not going to be used.
        pollId: "TestPoll", // TODO remove. 
        // We want to change the API here so you don't have to specify a 
        // pollID when submitting a response - it just goes to the latest poll by default.
        responseDetails: {
            willComeIfAtLeast: response.willComeIfAtLeast,
            willBring: response.willBring,
            weather: response.weather,
        },
    }

    const resp = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "text/plain;charset=utf-8"}, // Use this content type to avoid CORS preflight requests.
        body: JSON.stringify(payload),
    })

    if (!resp.ok) {
        throw new Error(`Failed to submit response: ${resp.status} ${resp.statusText}`)
    }

    const body = await resp.json()
    console.log("I got body " + JSON.stringify(body))
    return body
}

