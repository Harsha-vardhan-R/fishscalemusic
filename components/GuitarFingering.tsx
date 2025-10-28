import React, { useEffect, useRef, useState } from 'react'
import { SVGuitarChord } from 'svguitar'
import guitarchords from '@tombatossals/chords-db/lib/guitar.json'

interface GuitarChordProps {
    chord: string
}

const GuitarChord: React.FC<GuitarChordProps> = ({ chord }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        containerRef.current.innerHTML = ''

        const [root, suffix] = parseChord(chord)
        const dbRoot = convertNoteToDbFormat(root)
        const mappedSuffix = mapChordSuffix(suffix)
        const chordData = findChordVoicing(dbRoot, mappedSuffix)

        if (!chordData) {
            containerRef.current.innerHTML = '<p>Chord not found</p>'
            return
        }

        const chart = new SVGuitarChord(containerRef.current)
        const startFret = chordData.baseFret || 1

        const fingers = chordData.frets
            .map((fret: number, string: number) => {
                if (fret === -1) return null
                return [7 - (string + 1), fret]
            })
            .filter(Boolean)

        const barres = chordData.barres || []

        chart
            .configure({
                strings: 6,
                frets: 4,
                position: startFret,
                color: 'white',
                backgroundColor: 'transparent',
                showFretNumbers: startFret > 1,
                orientation: 'vertical',
                nutSize: startFret === 1 ? 0.65 : 0
            })
            .chord({
                fingers: fingers.map((f: any) => [f[0], f[1], {}]),
                barres: barres
            })
            .draw()
    }, [chord])

    return (
        <div
            ref={containerRef}
            style={{ minWidth: '160px', maxWidth: '160px' }}
        />
    )
}

function parseChord(chordName: string): [string, string] {
    const match = chordName.match(/^([A-G][#b]?)(.*)$/)
    return match ? [match[1], match[2]] : ['C', '']
}

function convertNoteToDbFormat(note: string): string {
    const noteMap: Record<string, string> = {
        'C': 'C', 'C#': 'Csharp', 'D': 'D', 'D#': 'Eb', 'E': 'E', 'F': 'F',
        'F#': 'Fsharp', 'G': 'G', 'G#': 'Ab', 'A': 'A', 'A#': 'Bb', 'B': 'B'
    }
    return noteMap[note] || note
}

function mapChordSuffix(suffix: string): string {
    const suffixMap: Record<string, string> = {
        '': 'major', 'm': 'minor', 'aug': 'aug', 'dim': 'dim'
    }
    return suffixMap[suffix] || suffix
}

function findChordVoicing(root: string, suffix: string): any {
    const chordList = guitarchords.chords[root as keyof typeof guitarchords.chords]
    if (!chordList) return null
    const found = chordList.find((c: any) => c.suffix === suffix)
    return found?.positions[0] || null
}

export default GuitarChord
