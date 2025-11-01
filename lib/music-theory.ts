import { Scale, Chord, Mode, Key, Note } from "tonal";

export const NOTES = [
    "C", "C#", "D", "Eb", "E", "F",
    "F#", "G", "Ab", "A", "Bb", "B",
];

export const SCALE_INFO = {
    major: { display: "Major", tonalName: "major" },
    minor: { display: "Natural Minor", tonalName: "minor" },
    hminor: { display: "Harmonic Minor", tonalName: "harmonic minor" },
    dorian: { display: "Dorian", tonalName: "dorian" },
    phrygian: { display: "Phrygian", tonalName: "phrygian" },
    lydian: { display: "Lydian", tonalName: "lydian" },
    mixolydian: { display: "Mixolydian", tonalName: "mixolydian" },
    locrian: { display: "Locrian", tonalName: "locrian" },
    majPentatonic: { display: "Major Pentatonic", tonalName: "major pentatonic" },
    minPentatonic: { display: "Minor Pentatonic", tonalName: "minor pentatonic" },
    majBlues: { display: "Major Blues", tonalName: "major blues" },
    minBlues: { display: "Minor Blues", tonalName: "minor blues" },
};

export function simplifyToSharps(notes: string[]): string[] {
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
    return scale.notes;
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

export function getScaleChords(root: string, scaleType: keyof typeof SCALE_INFO): { chords: string[], degrees: string[] } {
    const scaleInfo = SCALE_INFO[scaleType];
    if (!scaleInfo) return { chords: [], degrees: [] };

    const scaleNotes = getScaleNotes(root, scaleType);
    if (scaleNotes.length === 0) return { chords: [], degrees: [] };

    const chords: string[] = [];
    const degrees: string[] = [];

    switch (scaleType) {
        case 'major':
            chords.push(
                `${scaleNotes[0]}`,
                `${scaleNotes[1]}m`,
                `${scaleNotes[2]}m`,
                `${scaleNotes[3]}`,
                `${scaleNotes[4]}`,
                `${scaleNotes[5]}m`,
                `${scaleNotes[6]}dim`
            );
            degrees.push('I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°');
            break;

        case 'minor':
            chords.push(
                `${scaleNotes[0]}m`,
                `${scaleNotes[1]}dim`,
                `${scaleNotes[2]}`,
                `${scaleNotes[3]}m`,
                `${scaleNotes[4]}m`,
                `${scaleNotes[5]}`,
                `${scaleNotes[6]}`
            );
            degrees.push('i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII');
            break;

        case 'hminor':
            chords.push(
                `${scaleNotes[0]}m`,
                `${scaleNotes[1]}dim`,
                `${scaleNotes[2]}aug`,
                `${scaleNotes[3]}m`,
                `${scaleNotes[4]}`,
                `${scaleNotes[5]}`,
                `${scaleNotes[6]}dim`
            );
            degrees.push('i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°');
            break;

        case 'dorian':
            chords.push(
                `${scaleNotes[0]}m`,
                `${scaleNotes[1]}m`,
                `${scaleNotes[2]}`,
                `${scaleNotes[3]}`,
                `${scaleNotes[4]}m`,
                `${scaleNotes[5]}dim`,
                `${scaleNotes[6]}`
            );
            degrees.push('i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII');
            break;

        case 'phrygian':
            chords.push(
                `${scaleNotes[0]}m`,
                `${scaleNotes[1]}`,
                `${scaleNotes[2]}`,
                `${scaleNotes[3]}m`,
                `${scaleNotes[4]}dim`,
                `${scaleNotes[5]}`,
                `${scaleNotes[6]}m`
            );
            degrees.push('i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'vii');
            break;

        case 'lydian':
            chords.push(
                `${scaleNotes[0]}`,
                `${scaleNotes[1]}`,
                `${scaleNotes[2]}m`,
                `${scaleNotes[3]}dim`,
                `${scaleNotes[4]}`,
                `${scaleNotes[5]}m`,
                `${scaleNotes[6]}m`
            );
            degrees.push('I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii');
            break;

        case 'mixolydian':
            chords.push(
                `${scaleNotes[0]}`,
                `${scaleNotes[1]}m`,
                `${scaleNotes[2]}dim`,
                `${scaleNotes[3]}`,
                `${scaleNotes[4]}m`,
                `${scaleNotes[5]}m`,
                `${scaleNotes[6]}`
            );
            degrees.push('I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII');
            break;

        case 'locrian':
            return { chords: [], degrees: [] };

        case 'majPentatonic':
            if (scaleNotes.length >= 5) {
                chords.push(
                    `${scaleNotes[0]}`,
                    `${scaleNotes[1]}m`,
                    `${scaleNotes[2]}m`,
                    `${scaleNotes[3]}`,
                    `${scaleNotes[4]}m`
                );
                degrees.push('I', 'ii', 'iii', 'V', 'vi');
            }
            break;

        case 'minPentatonic':
            if (scaleNotes.length >= 5) {
                chords.push(
                    `${scaleNotes[0]}m`,
                    `${scaleNotes[1]}`,
                    `${scaleNotes[2]}m`,
                    `${scaleNotes[3]}m`,
                    `${scaleNotes[4]}`
                );
                degrees.push('i', 'bIII', 'iv', 'v', 'bVII');
            }
            break;

        default:
            return { chords: [], degrees: [] };
    }

    return { chords, degrees };
}
