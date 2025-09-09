// Switches between edit form and summary

import { useState } from "react";
import { PendingResponseDetails } from "../App";
import { PollResponse } from "./DataLoading";

export function ResponseDetails({
    userName,
    pending,
    onChangePending,
    submitted,
    onSubmit,
}: {
    userName: string;
    pending: PendingResponseDetails;
    onChangePending: (d: PendingResponseDetails) => void;
    submitted: PollResponse | undefined;
    onSubmit: () => void;
}) {
    const [editMode, setEditMode] = useState(!submitted)

    if (!editMode && submitted) {
        // Show report view
        return (
            <div>
                <h2>{userName}, you’ve responded:</h2>
                <ul>
                    <li>Will come if at least {submitted.willComeIfAtLeast} are coming</li>
                    <li>Will bring {submitted.willBring}</li>
                    <li>Okay with up to {submitted.weather}% chance of rain</li>
                </ul>
                <button onClick={() => setEditMode(true)}>Change my response</button>
            </div>
        );
    }

    // Otherwise show editing form
    return (
        <div>
            <h2>Hi {userName}, fill in your response</h2>
            <label>
                Will come if at least:
                <input
                    type="number"
                    value={pending.willComeIfAtLeast}
                    onChange={e => onChangePending({ ...pending, willComeIfAtLeast: +e.target.value })}
                />
            </label>
            <br />
            <label>
                Will bring:
                <input
                    type="number"
                    value={pending.willBring}
                    onChange={e => onChangePending({ ...pending, willBring: +e.target.value })}
                />
            </label>
            <br />
            <label>
                Max rain % you’ll still come:
                <input
                    type="number"
                    value={pending.weather}
                    onChange={e => onChangePending({ ...pending, weather: +e.target.value })}
                />
            </label>
            <br />
            <button onClick={() => {
                onSubmit()
                setEditMode(false)
            }}>
                Submit
            </button>
        </div>
    );
}
