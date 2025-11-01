import React, { useRef, useEffect } from 'react'
import { Chord } from 'tonal'
import ReactDOM from 'react-dom/client'

interface PianoChordProps {
    chord: string
}

function normalizeChordName(chord: string): string {
    const doubleSharpsToNote: Record<string, string> = {
        'C##': 'D',
        'D##': 'E',
        'E##': 'F#',
        'F##': 'G',
        'G##': 'A',
        'A##': 'B',
        'B##': 'C#'
    }

    const doubleFlatsToNote: Record<string, string> = {
        'Cbb': 'Bb',
        'Dbb': 'B',
        'Ebb': 'D',
        'Fbb': 'Eb',
        'Gbb': 'F',
        'Abb': 'G',
        'Bbb': 'A'
    }

    let normalized = chord

    for (const [doubleSharp, note] of Object.entries(doubleSharpsToNote)) {
        normalized = normalized.replace(doubleSharp, note)
    }

    for (const [doubleFlat, note] of Object.entries(doubleFlatsToNote)) {
        normalized = normalized.replace(doubleFlat, note)
    }

    const sharpToFlat: Record<string, string> = {
        'C#': 'Db',
        'D#': 'Eb',
        'F#': 'Gb',
        'G#': 'Ab',
        'A#': 'Bb'
    }
    
    for (const [sharp, flat] of Object.entries(sharpToFlat)) {
        normalized = normalized.replace(sharp, flat)
    }
    
    return normalized
}

function simplifyToSharps(notes: string[]): string[] {
    const enharmonicMap: Record<string, string> = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
        'E#': 'F', 'B#': 'C', 'Fb': 'E', 'Cb': 'B',
        'C##': 'D', 'D##': 'E', 'E##': 'F#', 'F##': 'G#', 'G##': 'A#', 'A##': 'B#', 'B##': 'C#',
        'Cbb': 'A#', 'Dbb': 'C', 'Ebb': 'D', 'Fbb': 'D#', 'Gbb': 'F', 'Abb': 'G', 'Bbb': 'A',
    };

    return notes.map(note => enharmonicMap[note] || note);
}

const PianoChord: React.FC<PianoChordProps> = ({ chord }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const rootRef = useRef<ReactDOM.Root | null>(null)

    const whiteKeyHeight = 135
    const whiteKeyWidth = 22
    const blackKeyHeight = 60
    const blackKeyWidth = 14
    const fontSize = 10

    useEffect(() => {
        if (!containerRef.current) return

        const normalizedChord = normalizeChordName(chord);
        const chordData = Chord.get(normalizedChord)
        let chordNotes = chordData.notes.map(n => n.replace(/\d/g, ''))
        chordNotes = simplifyToSharps(chordNotes)
        const uniqueChordNotes = [...new Set(chordNotes)]
        
        if (!chordData.notes || chordData.notes.length === 0) {
            if (!rootRef.current) {
                rootRef.current = ReactDOM.createRoot(containerRef.current)
            }
            rootRef.current.render(<p>Chord not found</p>)
            return
        }

        const startOctave = 2
        const octaveCount = 1
        const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
        const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#']

        const elements: any[] = []
        let whiteKeyIndex = 0

        for (let octave = startOctave; octave < startOctave + octaveCount; octave++) {
            whiteKeys.forEach((note) => {
                const isHighlighted = uniqueChordNotes.includes(note)
                const color = isHighlighted ? '#FFD56B' : '#FFFFFF'

                elements.push(
                    <g key={`white-${note}-${octave}-${whiteKeyIndex}`}>
                        <rect
                            x={whiteKeyIndex * whiteKeyWidth}
                            y={0}
                            width={whiteKeyWidth}
                            height={whiteKeyHeight}
                            fill={color}
                            stroke="#000"
                            strokeWidth={1}
                        />
                        {isHighlighted && (
                            <text
                                x={whiteKeyIndex * whiteKeyWidth + whiteKeyWidth / 2}
                                y={whiteKeyHeight - 4}
                                textAnchor="middle"
                                fontSize={fontSize}
                                fill="#000"
                                fontFamily="sans-serif"
                            >
                                {note}
                            </text>
                        )}
                    </g>
                )
                whiteKeyIndex++
            })
        }

        whiteKeyIndex = 0
        for (let octave = startOctave; octave < startOctave + octaveCount; octave++) {
            blackKeys.forEach((blackNote, idx) => {
                const blackKeyOffset = (blackKeyWidth / 2) + (whiteKeyWidth * (idx < 2 ? idx + 0.5 : idx + 1.5))
                const isHighlighted = uniqueChordNotes.includes(blackNote)
                const color = isHighlighted ? '#FF8800' : '#222222'

                elements.push(
                    <g key={`black-${blackNote}-${octave}-${whiteKeyIndex}`}>
                        <rect
                            x={whiteKeyIndex * whiteKeyWidth + blackKeyOffset - blackKeyWidth / 2}
                            y={0}
                            width={blackKeyWidth}
                            height={blackKeyHeight}
                            fill={color}
                            stroke="#000"
                            strokeWidth={1}
                        />
                        {isHighlighted && (
                            <text
                                x={whiteKeyIndex * whiteKeyWidth + blackKeyOffset}
                                y={blackKeyHeight - 4}
                                textAnchor="middle"
                                fontSize={fontSize - 2}
                                fill="#000"
                                fontFamily="sans-serif"
                            >
                                {blackNote}
                            </text>
                        )}
                    </g>
                )
            })
            whiteKeyIndex += 7
        }

        const totalWidth = whiteKeyIndex * whiteKeyWidth
        const totalHeight = whiteKeyHeight

        const svg = (
            <svg width={totalWidth} height={totalHeight} style={{ maxWidth: `${totalWidth}px`, minWidth: `${totalWidth}px` }}>
                {elements}
            </svg>
        )

        if (!rootRef.current) {
            rootRef.current = ReactDOM.createRoot(containerRef.current)
        }
        rootRef.current.render(svg)
    }, [chord, whiteKeyWidth, whiteKeyHeight, blackKeyWidth, blackKeyHeight, fontSize])

    return (
        <div
            ref={containerRef}
            style={{ display: 'inline-block', rotate: '-90deg', marginTop: '20px' }}
        />
    )
}

export default PianoChord