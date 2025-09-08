// When a user first opens the app, (or on a cookie wipe), they
// won't have a name. 
// This component lets them enter a name.

import { useState } from "react"

export function NameEntry({
    setNameCallback,
    existingName,
}: {
    setNameCallback: (name: string) => Promise<void>,
    existingName?: string,
}){
    const [nameValue, setNameValue] = useState(existingName || '')
    const [showingForm, setShowingForm] = useState<boolean>(!existingName)


    const entryForm = <form onSubmit={async (e) => {
        e.preventDefault()
        setShowingForm(false)
        await setNameCallback(nameValue)
    }}>
      <label htmlFor="myInput">What is your name?</label>
      <input
        type="text"
        id="myInput"
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>


    return <div onClick={() => setShowingForm(true)}>
      {showingForm ? entryForm: nameValue }
    </div>
}