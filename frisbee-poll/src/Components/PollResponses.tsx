/**
 * The PollResponses shows users how many people are expected to show up,
 * and their names.
 */

import { CSSProperties } from "react";
import { computeComing } from "../util";
import { PollResponse } from "./sheetsAPI";


export function PollResponses({pollResponses}: {pollResponses: Array<PollResponse>}){
    const weatherValue = 0 // hard coded for now
    const playerAnnotations = computeComing(pollResponses, weatherValue)
    const joining = pollResponses.filter(x => playerAnnotations[x.userName])
    const waiting = pollResponses.filter(x => !playerAnnotations[x.userName])

    // Below is mostly chatGPT generated. 
    return (
    <div style={styles.container}>
      {/* Joining players */}
      <div style={styles.groupRow}>
        {joining.map((p) => (
          <div key={p.userName} style={styles.playerBox}>
            <span style={styles.joiningName}>{renderName(p, styles.joiningName)}</span>
            <div style={{ ...styles.iconCircle, ...styles.joiningCircle }}>🥏</div>
          </div>
        ))}
      </div>

      {/* Waiting players */}
      <div style={styles.groupRow}>
        {waiting.map((p) => {
          return (
            <div key={p.userName} style={styles.playerBox}>
              <span style={styles.countNeeded}>
                Joins at {p.willComeIfAtLeast} players
              </span>
              <span style={styles.waitingName}>{renderName(p, styles.joiningName)}</span>
              <div style={{ ...styles.iconCircle, ...styles.waitingCircle }}>🤔</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderName(p: PollResponse, style: CSSProperties) {
    return (
      <span style={style}>
        {p.userName}
        {p.willBring > 1 ? ` +${p.willBring - 1}` : ""}
      </span>
    );
  }

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
  },
  groupRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
  },
  playerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  joiningName: {
    color: "green",
    fontWeight: 600,
    marginBottom: "4px",
  },
  waitingName: {
    color: "orange",
    fontWeight: 600,
    marginTop: "2px",
  },
  countNeeded: {
    fontSize: "0.8rem",
    color: "orange",
    marginBottom: "2px",
  },
  iconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  joiningCircle: {
    backgroundColor: "#d1fadf", // light green
  },
  waitingCircle: {
    backgroundColor: "#fef3c7", // light orange
  },
};