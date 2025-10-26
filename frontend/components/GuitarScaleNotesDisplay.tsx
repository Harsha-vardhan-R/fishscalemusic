import React, { useEffect, useRef } from 'react'
import { SVGuitarChord } from 'svguitar'

interface GuitarDisplayProps {
    notes: string[]
    rootNote: string
}

const GuitarDisplay: React.FC<GuitarDisplayProps> = ({ notes, rootNote }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const octaveColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD56B']

    useEffect(() => {
        if (!containerRef.current) return
        containerRef.current.innerHTML = ''
        const chart = new SVGuitarChord(containerRef.current)

        const tuning: string[] = ['E', 'B', 'G', 'D', 'A', 'E']
        const chromatic = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

        const stringNotes = tuning.map(base => {
            const startIdx = chromatic.indexOf(base)
            const frets: string[] = []
            for (let f = 0; f <= 20; f++) frets.push(chromatic[(startIdx + f) % 12])
            return frets
        })

        const rootPositions: number[] = []
        for (let string = 0; string < 6; string++) {
            for (let fret = 0; fret <= 20; fret++) {
                if (stringNotes[string][fret] === rootNote) {
                    rootPositions.push(fret)
                }
            }
        }

        const uniqueRoots = [...new Set(rootPositions)].sort((a, b) => a - b)

        const getZone = (fret: number): number => {
            for (let i = 0; i < uniqueRoots.length; i++) {
                const current = uniqueRoots[i]
                const next = uniqueRoots[i + 1] || 21
                const midpoint = (current + next) / 2
                if (fret < midpoint) return i
            }
            return uniqueRoots.length - 1
        }

        const highlights: [number, number, { color?: string; text?: string; shape?: string }?][] = []

        for (let string = 0; string < 6; string++) {
            for (let fret = 0; fret <= 20; fret++) {
                const note = stringNotes[string][fret]
                if (notes.includes(note)) {
                    const zone = getZone(fret)
                    const color = octaveColors[zone % octaveColors.length]
                    highlights.push([string + 1, fret, { color: (note === rootNote) ? "darkviolet" : color, text: note,  shape: (note === rootNote) ? 'square' : "circle" }])
                }
            }
        }

        chart
            .configure({
                strings: 6,
                frets: 20,
                position: 1,
                color: '#EEE',
                fingerTextColor: '#000',
                fingerTextSize: 20,
                backgroundColor: 'transparent',
                orientation: 'horizontal',
                fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19].map(j => j-1),
                showFretNumbers: true,
                fretMarkerColor: '#888'
            })
            .chord({
                fingers: highlights as any,
                barres: []
            })
            .draw()

    }, [notes, rootNote])

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center"
            style={{ width: '100%', maxWidth: '900px', minHeight: '150px', margin: '0 auto' }}
        />
    )
}

export default GuitarDisplay
