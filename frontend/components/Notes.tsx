"use client"

import { useState } from "react";

interface NoteDisplayerProps {
    notes: string[];
    extra_styles?: string;
    onPress?: (note: string) => void;
}

export const NoteDisplayer: React.FC<NoteDisplayerProps> = ({ notes, extra_styles = "", onPress = () => {} }) => {
    const hasSharp = (note: string) => note.includes("#");

    return (
        <div className="flex flex-row gap-5 justify-center">
            {notes.map((note, index) => (
                <div
                    key={`${note}-${index}`}
                    onClick={() => onPress(note)}
                    className={`
                        px-4 py-2 font-bold text-3xl
                        min-w-25 text-center
                        
                        border border-white/25
                        ${hasSharp(note) ? "border-dashed" : "" } 
                        cursor-default
                        hover:border-white/50 ${extra_styles}
                    `}
                >
                    {note}
                </div>
            ))}
        </div>
    );
}

export const IntervalDisplayer: React.FC<NoteDisplayerProps> = ({ notes, extra_styles = "" }) => {
    const hasSharp = (note: string) => note.includes("#");

    return (
        <div className="flex flex-row gap-5 justify-center">
            {notes.map((note, index) => (
                <div
                    key={`${note}-${index}`}
                    className={`
                        px-4 py-2 text-lg
                        min-w-25 text-center
                        transition-all duration-100
                        text-gray-600 ${extra_styles}
                        cursor-default`}>
                    {note}
                </div>
            ))}
        </div>
    );
}