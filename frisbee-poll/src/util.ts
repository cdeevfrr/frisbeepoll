import { PollResponse } from "./Components/sheetsAPI";

// Given an array of responses & a current weather, figure out who's coming and who isn't.
export function computeComing(pollResponses: Array<PollResponse>, weather: number){
    /**
     * Algorithm outline:
     * 
     * Sort by number needed. Now, an imaginary input might be
     * 
     * 0 0 2 5 7 7 7 7 7 7 7 7 7 
     * 
     * The first 2 players are coming no matter what; the third once they see the first two.
     * The fourth player will only come if at least 4 other players show up.
     * 
     * Here's the key insight: If at any time, array[p2] <= p2, 
     * then everyone at p2 and to the left can come. Just watch for off-by-1 errors.
     * 
     * Eg, the player at index 7 will only come if at least 7 people show up. 
     * But, because they're spot 7 in the sorted array, this means that 
     * there are at least 7 people with numbers less than or equal to 7; so
     * that player & everyone to their left can all come.
     * 
     * We're looking for the max value of p2 that satisfies that constraint (array[p2] <= p2).
     * 
     */

    // First, compute the largest number of joining players, see algorithm above.
    const constraintNumbers: number[] = [];
    pollResponses.filter(x => x.weather >= weather).forEach(response => {
        for (let i = 0; i < response.willBring; i++){
            constraintNumbers.push(response.willComeIfAtLeast)
        }
    })
    constraintNumbers.sort((a, b) => a-b)

    let joiningPlayers = 0
    for (let i = 0; i < constraintNumbers.length; i++){
        if (constraintNumbers[i] <= i + 1) {// If index 0 has a value of 1 or less, that player is going.
            joiningPlayers = i+1
        }
    }

    // Now, turn joiningPlayers number into an output that makes sense.
    const returnVal: any = {}
    for (const response of pollResponses){
        returnVal[response.userName] = (response.weather >= weather && response.willComeIfAtLeast <= joiningPlayers)
    }

    return returnVal
}