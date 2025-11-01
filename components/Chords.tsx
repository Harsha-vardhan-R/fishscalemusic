import React from "react"
import GuitarChord from "./GuitarFingering"
import PianoChord from "./PianoFingering"

export const ShowChordDiagrams: React.FC<{chords : string[], instrument: string, extra_styles?: string}> = ({chords, instrument, extra_styles = ""}) => {
    return <div className="flex flex-row m-0 gap-0 p-0 justify-center items-center">
        {  chords.map((chord, index) => (
        <div key={index} className={`${extra_styles}`}> 
            {instrument === "guitar" ? <GuitarChord chord={chord} /> : <PianoChord chord={chord} />}
        </ div>))}
    </div>
}