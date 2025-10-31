"use client"

import { useState, useEffect } from "react";
import { getScaleIntervals, getScaleNotes, NOTES, SCALE_INFO, getScaleChords } from "../lib/music-theory";

import NoteSelector from "./NoteSelector";
import ScaleSelector from "./ScaleSelector";
import { NoteDisplayer, IntervalDisplayer } from "./Notes";
import { InstrumentToggle } from "./chooseInstrument";
import PianoDisplay from "./PianoScaleNotesDisplay";
import GuitarDisplay from "./GuitarScaleNotesDisplay";
import { ShowChordDiagrams } from "./Chords";
import SongDrawer from "./searchResults";


const MainPage: React.FC = () => {
    const notesToShow: string[] = NOTES;
    
    const [note, setNote] = useState(notesToShow[0]);
    const [scalesToShow, setScalesToShow] = useState<string[]>([]);
    const [scale, setScale] = useState("major");
    const [instrument, setInstrument] = useState("guitar");
    const [notesInScale, setNotesInScale] = useState<string[]>([]);
    const [intervals, setIntervals] = useState<string[]>([]);
    const [chords, setChords] = useState<string[]>([]);
    const [chordIntervals, setChordIntervals] = useState<string[]>([]);
    const [chordList, setChordList] = useState<string[]>([]);
    const [ open, setOpen ] = useState(false);

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
            setChords(getScaleChords(note, scaleKey).chords);
            setChordIntervals(getScaleChords(note, scaleKey).degrees);
        }
    }, [note, scale]);

    const addChord = (chord: string) => {
        setChordList(prevList => [...prevList, chord]);
    }

    const backPressed = () => {
        if (chordList.length === 0) return;
        chordList.pop();
        let newList = [...chordList]
        setChordList(newList);
    }

    const [searchResults, setSearchResults] = useState<any[]>([]);

    async function search() {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chords: chordList }),
        });

        const data = await response.json().then(_ => {setOpen(true); return _});
        setSearchResults(data.results);
    }

    return (
        <>
            <SongDrawer results={searchResults} count={15} setOpen={setOpen} open={open} />
            <div className="flex flex-col w-screen h-screen">
                <div className="flex flex-row gap-8 overflow-clip justify-center items-center w-screen h-full z-10">
                    <div className="flex flex-col gap-8 px-4 overflow-visible justify-center items-center min-w-[20%] max-w-[20%]">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute -left-16 text-2xl font-semibold text-gray-400 -rotate-90 whitespace-nowrap select-none">
                                NOTE
                            </span>
                            <NoteSelector note={note} notes={notesToShow} setNote={setNote} />
                        </div>
                        <div className="bg-white/10 h-px w-full"></div>
                        <div className="relative flex items-center justify-center">
                            <span className="absolute -left-24 text-2xl font-semibold text-gray-400 -rotate-90 whitespace-nowrap select-none">
                                SCALE
                            </span>
                            <ScaleSelector scale={scale} scales={scalesToShow} setScale={setScale} />
                        </div>
                        <div className="bg-white/10 h-px w-full"></div>
                        <div className="relative flex items-center justify-center min-h-16">
                            <span className="absolute -left-16 text-2xl font-semibold text-gray-400 -rotate-90 select-none">
                                DISP
                            </span>
                            <InstrumentToggle instrument={instrument as 'piano' | 'guitar'} setInstrument={setInstrument as (instrument: 'piano' | 'guitar') => void} />
                        </div>
                        <p className="p-0 text-sm italic text-white/25 select-none hover:text-white/50 transition">try scrolling on the options above :)</p>
                    </div>
                    <div className="flex flex-col min-w-2/3 max-w-2/3 justify-center items-center h-full p-6">
                        <div className="flex flex-col items-center justify-center p-1 border-white/10 w-full transition-all duration-500 min-h-[40%]">
                            <span className="text-2xl font-semibold text-gray-400 p-2 select-none">
                                NOTES IN SCALE
                            </span>
                            <NoteDisplayer notes={notesInScale} extra_styles="transition-all duration-100"/>
                            <IntervalDisplayer notes={intervals} />
                            {instrument === "piano" ? 
                                <PianoDisplay notes={notesInScale} /> : 
                                <GuitarDisplay notes={notesInScale} rootNote={note} />}
                            <p className="p-1 text-sm italic text-white/25 select-none hover:text-white/50 transition">the colours are just for better contrast across, may not represent how to play the scale</p>
                        </div>
                        <span className="h-8"/>
                        <div className={`flex flex-col items-center justify-center overflow-visible transition-height duration-1000 w-full ${chords.length !== 0 ? " p-2 border-white/10 min-h-[40%]" : ""}`}>
                            {
                                chords.length !== 0 &&  
                                <span className="text-2xl font-semibold text-gray-400 p-2 select-none">
                                    DIATONIC CHORDS
                                </span>
                            }
                            {
                                chords.length !== 0 &&  
                                <p className="pb-2 text-sm italic text-white/25 select-none hover:text-white/50 transition">click on the chord names to make a list below</p>
                            }
                            
                            <NoteDisplayer notes={chords} onPress={addChord} 
                                extra_styles="min-w-34 border-white border border-solid 
                                    overflow-scroll cursor-pointer active:border-amber-600 active:text-amber-600 
                                    select-none transition duration-50 ease-out hover:scale-105 active:scale-100"/>
                            <IntervalDisplayer notes={chordIntervals} extra_styles="min-w-34"/>
                            <ShowChordDiagrams chords={chords} instrument={instrument} extra_styles="min-w-34 " />
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 flex flex-row h-22 min-h-22 gap-1 p-4 w-full bg-black z-50" >
                    <div className="flex-1 flex flex-row p-1 gap-1 border justify-left border-white/25 w-max">
                        {
                            chordList.map((chord, index) => (<div key={index} className="flex-1 max-w-22 text-xl m-px p-1 border text-center font-semibold border-white/25 text-white/90">{chord}</div>))
                        }
                    </div>
                    <button onClick={() => backPressed()} className="w-28 cursor-pointer text-lg font-bold bg-transparent text-white/90 hover:bg-white hover:text-black border border-white/25 active:bg-white/60 transition-colors duration-200 ease-out"> BACK </button>
                    <button onClick={() => search()} className="w-28 text-xl cursor-pointer font-bold bg-transparent text-white/90 hover:bg-white hover:text-black border border-white/25 active:bg-white/60 transition-colors duration-200 ease-out"> SEARCH </button>
                </div>
            </div>
        </>
    );
}

export default MainPage;
