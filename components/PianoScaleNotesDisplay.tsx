import React from 'react'

interface PianoDisplayProps {
    notes: string[]
}

const PianoDisplay: React.FC<PianoDisplayProps> = ({ notes }) => {

    const startOctave = 2
    const octaveCount = 4
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#']
    const noteNames = notes.map(n => n.replace(/\d/g, ''))
    const octaveColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']

    const renderWhiteKey = (note: string, octave: number, index: number) => {
        const isHighlighted = noteNames.includes(note)
        const color = isHighlighted ? octaveColors[octave - startOctave] : '#FFFFFF'

        return (
            <g key={`white-${note}-${octave}-${index}`}>
                <rect
                    x={index * 30}
                    y={0}
                    width={32}
                    height={150}
                    fill={color}
                    stroke="#000"
                    strokeWidth={1}
                />
                {isHighlighted && (
                    <text
                        x={index * 30 + 16}
                        y={140}
                        textAnchor="middle"
                        fontSize="14"
                        fill="#000"
                        fontFamily="sans-serif"
                    >
                        {note}
                    </text>
                )}
            </g>
        )
    }

    const renderBlackKey = (note: string, octave: number, xOffset: number) => {
        const isHighlighted = noteNames.includes(note)
        const color = isHighlighted ? octaveColors[octave - startOctave] : '#222222'

        return (
            <g key={`black-${note}-${octave}-${xOffset}`}>
                <rect
                    x={xOffset}
                    y={0}
                    width={24}
                    height={90}
                    fill={color}
                    stroke="#000"
                    strokeWidth={1}
                />
                {isHighlighted && (
                    <text
                        x={xOffset + 12}
                        y={80}
                        textAnchor="middle"
                        fontSize="12"
                        fill={color === '#000000' ? '#FFF' : '#000'}
                        fontFamily="sans-serif"
                    >
                        {note}
                    </text>
                )}
            </g>
        )
    }

    const renderKeys = () => {
        const elements: any[] = []
        let whiteKeyIndex = 0
        for (let octave = startOctave; octave < startOctave + octaveCount; octave++) {
            whiteKeys.forEach((note) => {
                elements.push(renderWhiteKey(note, octave, whiteKeyIndex))
                whiteKeyIndex++
            })
        }
        whiteKeyIndex = 0
        for (let octave = startOctave; octave < startOctave + octaveCount; octave++) {
            const blackKeyPositions = [18, 51, 108, 140, 171]
            blackKeyPositions.forEach((pos, idx) => {
                const blackNote = blackKeys[idx]
                elements.push(renderBlackKey(blackNote, octave, whiteKeyIndex * 30 + pos))
            })
            whiteKeyIndex += 7
        }
        return elements
    }

    return (
        <svg width="840" height="150" className="mx-auto">
            {renderKeys()}
        </svg>
    )
}

export default PianoDisplay
