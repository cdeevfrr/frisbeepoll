/**
 * The PollResponses component loads poll responses from the "server"
 * and shows how many people are expected to show up.
 * 
 * Users can also refresh the data (re-loading from server).
 */

import { PollResponse } from "./DataLoading";

export function PollResponses({pollResponses}: {pollResponses: Array<PollResponse>}){
    return <div>
        <p>I see {pollResponses.length} responses</p>
    </div>
}
