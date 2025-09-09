# Frisbee Poll

An app designed to make it easy for people to RSVP for pickup frisbee in Tallahassee.

See it at [https://cdeevfrr.github.io/frisbeepoll/](https://cdeevfrr.github.io/frisbeepoll/)

## Why?

Some people use WhatsApp, some Facebook, some Discord.

Everyone wants to know how many people they can expect to show up, because it's only fun to play if there are enough players. But the responses on any one site won't show things accurately.

This app is designed to make it easy for people to indicate that they want to come, and under what conditions; and to make it obvious how many people are currently planning to show up at any given time (so anyone can check and see.)

## Architecture

Most of the app is client side javascript (via typescript/react). The client only stores the user's name.

The datastore for poll responses is a google sheet. To make it so you don't need an identity to modify the google sheet, the google sheet has an app-script attached that accepts HTTP requests, and adds/removes rows based on those requests. 

## Architecture details

Requests work with JSON, shapes below. The lack of auth is intentional and an accepted risk. 

```
PUT pollResponse
Body is a pollResponse. Overwrites any responses with the same sourceID

GET pollResponses
Response shape: {
    pollId: string,
    responses: Array<PollResponse & {timestamp?: string}>,
}

PollResponse: {
   userName: string, // Manually input by the user, stored in cookies in client.
   sourceID: string // Randomly generated once per client & stored in client cookies.
   pollId: string // see POST poll
   responseDetails: PollResponseDetails
}

PollResponseDetails : {
    willComeIfAtLeast: number, // Indicates that they plan to show up if at least n other players plan to show up
    willBring: number // Indicates that this person will bring additional players who did NOT respond to the poll
    weather: percentage // Indicates that they plan to show up if the chance of rain/lightning is less than this percentage
}

DELETE pollResponse
Body {
    sourceID: string,
    userName: string,
    pollId: string
}

POST poll
Body is a string for the poll name. 
Wipes the current poll and makes a new one.
```

## Deploys

### Client side website

The client side is a react app hosted by github pages, deploy with 
```
cd frisbee-poll
npm run deploy
```

### Backend datastore / Server

The datastore is this [google sheet](https://docs.google.com/spreadsheets/d/1C3eWxsOnYxwh7xr7I0vuOykd8_ONUQ6lZApSohTSJ84). Edit the app script (go to sheet -> extensions tab -> click "apps script") and then copy-paste SheetScript/script.js code into it. Click "deploy" at the top right and make sure it succeeds, with web app URL still "https://script.google.com/macros/s/AKfycbzzWSfaZ_B7cTClelRACQSpdlL8KXiisBERPwGavoUJLp18sG0SJrAMfsU4oFEGZqRLAA/exec"


# Testing

## Backend

Some test curls you can make to ensure it's working (pull up the [sheet](https://docs.google.com/spreadsheets/d/1C3eWxsOnYxwh7xr7I0vuOykd8_ONUQ6lZApSohTSJ84/) while doing these):

- Make/refresh the test poll: (TODO: Behavior is good, response is buggy)
```
curl -L -X POST \
  -H "Content-Type: application/json" \
  -d '"TestPoll"' \
  "https://script.google.com/macros/s/AKfycbw5SbH69fGoYclgyZa7yIeMY-Kbvw9wonzvDq9GE7yB9FNRUGvcVrxRuvatFeoDWoZpuw/exec?action=postPoll"
```

- Add a response to the test poll: (TODO: Behavior is good, response is buggy when using CURL but works in client.)

```
curl -L -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Danny",
    "sourceID": "abc123",
    "pollId": "TestPoll",
    "responseDetails": {
      "willComeIfAtLeast": 6,
      "willBring": 1,
      "weather": 40
    }
  }' \
  "https://script.google.com/macros/s/AKfycbw5SbH69fGoYclgyZa7yIeMY-Kbvw9wonzvDq9GE7yB9FNRUGvcVrxRuvatFeoDWoZpuw/exec?action=putPollResponse"
```

- Get all poll responses for the current poll
```
curl -L "https://script.google.com/macros/s/AKfycbw5SbH69fGoYclgyZa7yIeMY-Kbvw9wonzvDq9GE7yB9FNRUGvcVrxRuvatFeoDWoZpuw/exec?action=getPollResponses"
```

- Delete the test poll response (TODO: Behavior is good, response is buggy)
```
curl -L -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Danny",
    "sourceID": "abc123",
    "pollId": "TestPoll"
  }' \
  "https://script.google.com/macros/s/AKfycbw5SbH69fGoYclgyZa7yIeMY-Kbvw9wonzvDq9GE7yB9FNRUGvcVrxRuvatFeoDWoZpuw/exec?action=deletePollResponse"
```

