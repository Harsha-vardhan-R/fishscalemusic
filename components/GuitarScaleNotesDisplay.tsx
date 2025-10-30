import React, { useEffect, useRef } from 'react'
import { SVGuitarChord } from 'svguitar'

interface GuitarDisplayProps {
    notes: string[]
    rootNote: string
}

const GuitarDisplay: React.FC<GuitarDisplayProps> = ({ notes, rootNote }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    
    const noteColors: Record<string, string> = {
        'C': '#E74C3C', 
        'C#': '#9B59B6',
        'D': '#3498DB', 
        'D#': '#1ABC9C',
        'E': '#2ECC71', 
        'F': '#F39C12', 
        'F#': '#E67E22',
        'G': '#F1C40F', 
        'G#': '#16A085',
        'A': '#8E44AD', 
        'A#': '#34495E',
        'B': '#E91E63'  
    }

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

        const highlights: [number, number, { color?: string; text?: string; shape?: string }?][] = []

        for (let string = 0; string < 6; string++) {
            for (let fret = 0; fret <= 20; fret++) {
                const note = stringNotes[string][fret]
                if (notes.includes(note)) {
                    const color = noteColors[note] || '#999'
                    highlights.push([
                        string + 1, 
                        fret, 
                        { 
                            color: (note === rootNote) ? "white" : color, 
                            text: note,
                            shape: (note === rootNote) ? 'square' : "circle" 
                        }
                    ])
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
                fingerTextSize: 22,
                backgroundColor: 'transparent',
                orientation: 'horizontal' as any,
                fretMarkers: [3, 5, 7, 9, 12, 15, 17, 19].map(j => j-1),
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
            className="flex justify-center items-center overflow-scroll"
            style={{ width: '100%', maxWidth: '850px', minWidth: '850px', minHeight: '150px', margin: '0 auto' }}
        />
    )
}

export default GuitarDisplay
