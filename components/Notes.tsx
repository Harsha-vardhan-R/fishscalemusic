"use client"

import { useState, useRef, useEffect } from "react";

interface NoteDisplayerProps {
    notes: string[];
    extra_styles?: string;
    onPress?: (note: string) => void;
}

export const NoteDisplayer: React.FC<NoteDisplayerProps> = ({ notes, extra_styles = "", onPress = () => {} }) => {

    return (
        <div className="flex lg:gap-2 flex-row flex-nowrap gap-0 my-4 justify-center w-full px-4">
            {notes.map((note, index) => (
                <div
                    key={`${note}-${index}`}
                    onClick={() => onPress(note)}
                    className={`
                        flex-1 min-w-0 max-w-24
                        m-0 px-0
                        py-3 text-center font-bold
                        text-sm
                        md:text-xl
                        lg:text-2xl 
                        text-white/90
                        border border-white/25
                        cursor-default hover:border-white/50
                        ${extra_styles}
                    `}
                >
                    {note}
                </div>
            ))}
        </div>
    );
}

export const IntervalDisplayer: React.FC<NoteDisplayerProps> = ({ notes, extra_styles = "" }) => {
    const itemCount = notes.length;
    const itemWidth = `calc(100% / ${itemCount} - 0.5rem)`;

    return (
        <div className="flex flex-row gap-2 justify-center w-full flex-nowrap">
            {notes.map((note, index) => (
                <div
                    key={`${note}-${index}`}
                    style={{ width: itemWidth }}
                    className={`
                        shrink-0
                        min-w-24 max-w-24
                        text-lg text-center
                        transition-all duration-100
                        text-gray-600 ${extra_styles}
                        cursor-default
                    `}
                >
                    {note}
                </div>
            ))}
        </div>
    );
}