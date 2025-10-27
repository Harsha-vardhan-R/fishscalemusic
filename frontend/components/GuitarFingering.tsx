import React, { useEffect, useRef } from 'react'
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
                position: chordData.firstFret || 1,
                color: 'white',
                backgroundColor: 'transparent',
                showFretNumbers: true,
                orientation: 'vertical',
                mirror: true
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
    const parsedChord = chordName.includes('m') || chordName.includes('dim') || chordName.includes('aug') 
    ? chordName 
    : chordName + 'M'
    const match = chordName.match(/^([A-G][#b]?)(.*)$/)
    return match ? [match[1], match[2]] : ['C', '']
}

function convertNoteToDbFormat(note: string): string {
    const noteMap: Record<string, string> = {
        'C': 'C',
        'C#': 'Csharp',
        'D': 'D',
        'D#': 'Eb',
        'E': 'E',
        'F': 'F',
        'F#': 'Fsharp',
        'G': 'G',
        'G#': 'Ab',
        'A': 'A',
        'A#': 'Bb',
        'B': 'B'
    }
    return noteMap[note] || note
}

function mapChordSuffix(suffix: string): string {
    const suffixMap: Record<string, string> = {
        '': 'major',
        'm': 'minor',
        'aug': 'aug',
        'dim': 'dim'
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
