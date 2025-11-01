"use client"

import { useState, useEffect } from "react";
import { getScaleIntervals, getScaleNotes, NOTES, SCALE_INFO, getScaleChords, simplifyToSharps, convertChordsToSharps } from "../lib/music-theory";

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
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const temp: string[] = [];
        for (const key in SCALE_INFO) {
            temp.push(SCALE_INFO[key as keyof typeof SCALE_INFO].display);
        }
        setScalesToShow(temp);
    }, []);

    useEffect(() => {
        if (scalesToShow.length > 0 && !scalesToShow.includes(scale)) {
            setScale(scalesToShow[0]);
        }
    }, [scalesToShow]);

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
        setChordList(prevList => prevList.slice(0, -1));
    }

    const [searchResults, setSearchResults] = useState<any[]>([]);

    async function search() {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chords: convertChordsToSharps(chordList) }),
        });

        const data = await response.json().then(_ => {setOpen(true); return _});
        setSearchResults(data.results);
    }

    return (
        <>
            <SongDrawer results={searchResults} count={15} setOpen={setOpen} open={open} />
            <div className="flex flex-col w-screen min-h-full max-h-full overflow-scroll pb-24">
                <div className="flex flex-col 2xl:flex-row gap-8 w-full flex-1 px-4 2xl:px-8 py-8 justify-center items-center">
                    <div className="hidden 2xl:flex flex-col gap-8 justify-center items-center w-1/6">
                        <div className="flex items-center justify-center w-full">
                            <NoteSelector note={note} notes={notesToShow} setNote={setNote} />
                        </div>
                        <div className="bg-white/10 h-px w-full"></div>
                        <div className="flex items-center justify-center w-full">
                            <ScaleSelector scale={scale} scales={scalesToShow} setScale={setScale} />
                        </div>
                        <div className="bg-white/10 h-px w-full"></div>
                        <div className="flex items-center justify-center min-h-16 w-full">
                            <InstrumentToggle instrument={instrument as 'piano' | 'guitar'} setInstrument={setInstrument as (instrument: 'piano' | 'guitar') => void} />
                        </div>
                    </div>

                    <div className="2xl:hidden flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <span className="text-lg font-semibold text-gray-400 p-2 select-none">NOTE</span>
                            <NoteSelector note={note} notes={notesToShow} setNote={setNote} />
                            <div className="bg-white/10 h-px w-1/2"></div>
                            <span className="text-lg font-semibold text-gray-400 p-2 select-none">SCALE</span>
                            <ScaleSelector scale={scale} scales={scalesToShow} setScale={setScale} />
                            <div className="bg-white/10 h-px w-1/2"></div>
                            <span className="text-lg font-semibold text-gray-400 p-2 select-none">DISPLAY</span>
                            <InstrumentToggle instrument={instrument as 'piano' | 'guitar'} setInstrument={setInstrument as (instrument: 'piano' | 'guitar') => void} />
                        </div>
                    </div>

                    <div className="flex flex-col w-full 2xl:w-2/3 justify-center items-center gap-6">
                        <div className="flex flex-col items-center justify-center w-full">
                            <span className="text-2xl font-semibold text-gray-400 p-1 select-none">
                                NOTES IN SCALE
                            </span>
                            <NoteDisplayer notes={notesInScale} extra_styles="transition-all duration-100"/>
                            <div className="hidden 2xl:block">
                                <IntervalDisplayer notes={intervals} />
                            </div>
                            <div className="w-full lg:w-4/5 overflow-x-scroll">
                                {instrument === "piano" ? 
                                    <PianoDisplay notes={simplifyToSharps(notesInScale)} /> : 
                                    <GuitarDisplay notes={simplifyToSharps(notesInScale)} rootNote={simplifyToSharps([note])[0]} />
                                }
                            </div>
                        </div>

                        {chords.length !== 0 && (
                            <div className="flex flex-col items-center justify-center overflow-visible w-full">
                                <span className="text-2xl font-semibold text-gray-400 select-none">
                                    DIATONIC CHORDS
                                </span>
                                <p className="pb-2 text-sm italic text-white/25 select-none hover:text-white/50 transition">click on the chord names to make a list below</p>
                                <NoteDisplayer notes={chords} onPress={addChord} 
                                    extra_styles="cursor-pointer active:text-amber-600 select-none transition duration-50 ease-out hover:scale-105 active:scale-100"/>
                                <div className="hidden 2xl:block">
                                    <IntervalDisplayer notes={chordIntervals} extra_styles=""/>
                                </div>
                                <ShowChordDiagrams chords={chords} instrument={instrument} extra_styles="" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 flex flex-col sm:flex-row gap-1 w-screen bg-black z-50 h-16 m-2">
                    <div className="flex-1 flex flex-row p-1 gap-1 border justify-left border-white/25 w-max">
                        {
                            chordList.map((chord, index) => (
                                <div key={index} className="flex-1 max-w-22 text-xl m-px p-2 border text-center font-semibold border-white/25 text-white/90">
                                    {chord}
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex gap-2 w-64">
                        <button onClick={() => backPressed()} className="flex-1 cursor-pointer text-lg font-bold bg-transparent text-white/90 hover:bg-white hover:text-black active:bg-white/60 transition-colors duration-200 ease-out border border-white/25"> 
                            BACK 
                        </button>
                        <button onClick={() => search()} className="flex-1 text-lg sm:text-xl cursor-pointer font-bold bg-transparent text-white/90 hover:bg-white hover:text-black active:bg-white/60 transition-colors duration-200 ease-out border border-white/25"> 
                            SEARCH 
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPage;
