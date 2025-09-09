import { useState } from "react";
import { PendingResponseDetails } from "../App";
import { PollResponse } from "./sheetsAPI";

const weatherff = false

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
  const [editMode, setEditMode] = useState(!submitted);

  if (!editMode && submitted) {
    return (
      <div>
        <h2>{userName}, you’ve responded:</h2>
        <ul>
          <li>
            I’ll come if at least{" "}
            {submitted.willComeIfAtLeast === 0
              ? "anyone is going"
              : `${submitted.willComeIfAtLeast} people are going`}
          </li>
          <li>I’ll bring {submitted.willBring - 1} extra players</li>
          {weatherff && <li>
            I’ll still come with up to {submitted.weather}% chance of rain
          </li>}
        </ul>
        <button onClick={() => setEditMode(true)}>Change my response</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Hi {userName}, fill in your response</h2>

      <label>
        I’ll come if at least{" "}
        <input
          type="text"
          inputMode="numeric"
          value={pending.willComeIfAtLeast.toString()}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChangePending({
              ...pending,
              willComeIfAtLeast: v === "" ? 0 : parseInt(v, 10) || 0,
            });
          }}
        />{" "}
        people are going
        <small style={{ display: "block", color: "#666" }}>
          Enter 0 if you’ll come no matter what
        </small>
      </label>

      <br />

      <label>
        I’ll bring{" "}
        <input
          type="text"
          inputMode="numeric"
          value={pending.extras.toString()}
          onChange={(e) => {
            const v = e.target.value.trim();
            onChangePending({
              ...pending,
              extras: v === "" ? 0 : parseInt(v, 10) || 0,
            });
          }}
        />{" "}
        extra people
      </label>

      {weatherff && <br />}

      {weatherff && <label>
        I’ll still come if rain chance is up to{" "}
        <input
          type="range"
          min="0"
          max="100"
          value={pending.weather}
          onChange={(e) =>
            onChangePending({
              ...pending,
              weather: parseInt(e.target.value, 10),
            })
          }
        />{" "}
        {pending.weather}%
      </label>}

      <br />

      <button
        onClick={() => {
          onSubmit();
          setEditMode(false);
        }}
      >
        Submit
      </button>
    </div>
  );
}
