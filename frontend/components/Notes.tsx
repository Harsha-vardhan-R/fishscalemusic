"use client"

import { useState } from "react";

interface NoteDisplayerProps {
    notes: string[];
}

const NoteDisplayer: React.FC<NoteDisplayerProps> = ({ notes }) => {
    const hasSharp = (note: string) => note.includes("#");

    return (
        <div className="flex flex-row gap-5 justify-center">
            {notes.map((note, index) => (
                <div
                    key={`${note}-${index}`}
                    className={`
                        px-4 py-2 font-bold text-3xl
                        min-w-25 text-center
                        transition-all duration-100
                        border border-white/25
                        ${hasSharp(note) ? "border-dashed" : "" } 
                        cursor-default
                        hover:border-white/50
                    `}
                >
                    {note}
                </div>
            ))}
        </div>
    );
}

export default NoteDisplayer;
