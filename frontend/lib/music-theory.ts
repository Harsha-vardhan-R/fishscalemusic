import { Scale, Chord, Mode, Key, Note } from "tonal";

export const NOTES = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B",
];

export const SCALE_INFO = {
    major: { display: "Major", tonalName: "major" },
    minor: { display: "Natural Minor", tonalName: "minor" },
    hminor: { display: "Harmonic Minor", tonalName: "harmonic minor" },
    ionian: { display: "Ionian", tonalName: "ionian" },
    dorian: { display: "Dorian", tonalName: "dorian" },
    phrygian: { display: "Phrygian", tonalName: "phrygian" },
    lydian: { display: "Lydian", tonalName: "lydian" },
    mixolydian: { display: "Mixolydian", tonalName: "mixolydian" },
    aeolian: { display: "Aeolian", tonalName: "aeolian" },
    locrian: { display: "Locrian", tonalName: "locrian" },
    majPentatonic: { display: "Major Pentatonic", tonalName: "major pentatonic" },
    minPentatonic: { display: "Minor Pentatonic", tonalName: "minor pentatonic" },
    majBlues: { display: "Major Blues", tonalName: "major blues" },
    minBlues: { display: "Minor Blues", tonalName: "minor blues" },
};

function simplifyToSharps(notes: string[]): string[] {
    const enharmonicMap: Record<string, string> = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
        'E#': 'F', 'B#': 'C', 'Fb': 'E', 'Cb': 'B',
        'C##': 'D', 'D##': 'E', 'E##': 'F#', 'F##': 'G#', 'G##': 'A#', 'A##': 'B#', 'B##': 'C#',
        'Cbb': 'A#', 'Dbb': 'C', 'Ebb': 'D', 'Fbb': 'D#', 'Gbb': 'F', 'Abb': 'G', 'Bbb': 'A',
    };

    return notes.map(note => enharmonicMap[note] || note);
}

export function getScaleNotes(root: string, scaleType: keyof typeof SCALE_INFO): string[] {
    const scaleInfo = SCALE_INFO[scaleType];
    if (!scaleInfo) return [];

    const scale = Scale.get(`${root} ${scaleInfo.tonalName}`);
    return simplifyToSharps(scale.notes);
}

export function intervalToSemitones(interval: string): number {
    const semitoneMap: Record<string, number> = {
      '1P': 0,
      '2m': 1,
      '2M': 2,
      '3m': 3,
      '3M': 4,
      '4P': 5,
      '4A': 6,
      '5d': 6,
      '5P': 7, 
      '6m': 8,
      '6M': 9,
      '7m': 10,
      '7M': 11,
      '8P': 12,
    };
  
    return semitoneMap[interval] ?? NaN;
}

export function getScaleIntervals(scaleType: keyof typeof SCALE_INFO): string[] {
    const scaleInfo = SCALE_INFO[scaleType];
    if (!scaleInfo) return [];

    const scale = Scale.get(`C ${scaleInfo.tonalName}`);
    const interval_semitones = scale.intervals.map(intervalToSemitones);
    return scale.intervals.map((interval, index) => [interval, interval_semitones[index]].join(", "));
}
