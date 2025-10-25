export interface NoteSelectorProps { 
    note: String, 
    notes: String[], 
    setNote: (note: string) => void 
};

export interface ScaleSelectorProps { 
    scale: String,
    scales: String[], 
    setScale: (note: string) => void 
};

export interface NoteDisplayerProps { notes: String[] };
export interface ChordDisplayerProps { chords: String[] };

