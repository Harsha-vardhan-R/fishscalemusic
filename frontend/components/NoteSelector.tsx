"use client"
import { useEffect, useState, useRef } from "react";
import { NoteSelectorProps } from "./interface";

const NoteSelector: React.FC<NoteSelectorProps> = ({ note, notes, setNote }) => {
    const [indx, setIndx] = useState(notes.indexOf(note));
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        setIndx(notes.indexOf(note));
    }, [note, notes]);

    useEffect(() => {
        setNote(String(notes[indx]));
    }, [indx, notes, setNote]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            setIndx(prevIndx => {
                if (e.deltaY < 0) {
                    return prevIndx > 0 ? prevIndx - 1 : notes.length - 1;
                } else {
                    return prevIndx < (notes.length - 1) ? prevIndx + 1 : 0;
                }
            });
        };

        container.addEventListener("wheel", handleWheel);
        return () => container.removeEventListener("wheel", handleWheel);
    }, [notes]);

    const handleUp = () => {
        setIndx(prev => prev > 0 ? prev - 1 : notes.length - 1);
    };

    const handleDown = () => {
        setIndx(prev => prev < notes.length - 1 ? prev + 1 : 0);
    };

    return (
        <div className="flex flex-col min-w-32 min-h-1/2" ref={containerRef}>
            <button onClick={handleUp} className="bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                -1 semitone
            </button>
            <h4 className="font-mono text-white/15 text-2xl text-center"> {indx <= 0 ? notes[notes.length-1] : notes[indx-1]} </h4>
            <h4 className="font-mono text-white text-8xl font-bold text-center transition-all duration-300"> {notes[indx]} </h4>
            <h4 className="font-mono text-white/15 text-2xl text-center"> {indx >= (notes.length-1) ? notes[0] : notes[indx+1]} </h4>
            <button onClick={handleDown} className="bg-transparent italic rounded max-h-6 text-violet-500/75 text-center hover:text-gray-500 active:text-white">
                +1 semitone
            </button>
        </div>
    );
}

export default NoteSelector;
