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

The client side is a react app hosted by github pages, deploy with 
```
cd frisbee-poll
npm run deploy
```






