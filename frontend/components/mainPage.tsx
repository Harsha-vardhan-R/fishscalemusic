"use client"

import { useState, useEffect } from "react";
import { getScaleIntervals, getScaleNotes, NOTES, SCALE_INFO } from "../lib/music-theory";

import NoteSelector from "./NoteSelector";
import ScaleSelector from "./ScaleSelector";
import { NoteDisplayer, IntervalDisplayer } from "./Notes";
import { InstrumentToggle } from "./chooseInstrument";
import PianoDisplay from "./PianoScaleNotesDisplay";
import GuitarDisplay from "./GuitarScaleNotesDisplay";

const MainPage: React.FC = () => {
    const notesToShow: string[] = NOTES;
    
    const [note, setNote] = useState(notesToShow[0]);
    const [scalesToShow, setScalesToShow] = useState<string[]>([]);
    const [scale, setScale] = useState("major");
    const [instrument, setInstrument] = useState("piano");
    const [notesInScale, setNotesInScale] = useState<string[]>([]);
    const [intervals, setIntervals] = useState<string[]>([]);

    useEffect(() => {
        const temp: string[] = [];

        for (const key in SCALE_INFO) {
            temp.push(SCALE_INFO[key as keyof typeof SCALE_INFO].display);
        }

        setScalesToShow(temp);
        if (temp.length > 0) {
            setScale(temp[0]);
        }
    }, []);

    useEffect(() => {
        const scaleKey = Object.keys(SCALE_INFO).find(
            key => SCALE_INFO[key as keyof typeof SCALE_INFO].display === scale
        ) as keyof typeof SCALE_INFO | undefined;

        if (scaleKey) {
            setNotesInScale(getScaleNotes(note, scaleKey));
            setIntervals(getScaleIntervals(scaleKey));
        }
    }, [note, scale]);

    return (
        <div className="flex flex-row gap-8 px-12 overflow-clip justify-center items-center w-screen">
            <div className="flex flex-col gap-8 px-4 overflow-ellipsis justify-center items-center min-w-1/3 max-w-1/3">
                <div className="relative flex items-center justify-center">
                    <span className="absolute -left-16 text-2xl font-semibold text-gray-400 -rotate-90 whitespace-nowrap">
                        NOTE
                    </span>
                    <NoteSelector note={note} notes={notesToShow} setNote={setNote} />
                </div>
                <rect className="bg-white/15 h-0.5 w-65"></rect>
                <div className="relative flex items-center justify-center">
                    <span className="absolute -left-24 text-2xl font-semibold text-gray-400 -rotate-90 whitespace-nowrap">
                        SCALE
                    </span>
                    <ScaleSelector scale={scale} scales={scalesToShow} setScale={setScale} />
                </div>
                <rect className="bg-white/15 h-0.5 w-65"></rect>
                <div className="relative flex items-center justify-center">
                    <span className="absolute -left-16 text-2xl font-semibold text-gray-400 -rotate-90 whitespace-nowrap">
                        DISP
                    </span>
                    <InstrumentToggle instrument={instrument as 'piano' | 'guitar'} setInstrument={setInstrument as (instrument: 'piano' | 'guitar') => void} />
                </div>
            </div>
            <div className="min-w-2/3 max-w-2/3 overflow-clip">
                <NoteDisplayer notes={notesInScale} />
                <IntervalDisplayer notes={intervals} />
                {instrument === "piano" ? 
                    <PianoDisplay notes={notesInScale} /> : 
                    <GuitarDisplay notes={notesInScale} rootNote={note} />}
            </div>
        </div>
    );
}

export default MainPage;
