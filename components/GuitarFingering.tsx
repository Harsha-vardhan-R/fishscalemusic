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
        const dbRoot = convertToDbFormat(root)
        const mappedSuffix = mapChordSuffix(suffix)
        
        console.log('Input:', chord, '| DB Format:', dbRoot, mappedSuffix)

        let chordData = findChordVoicing(dbRoot, mappedSuffix)

        if (!chordData) {
            console.log('Chord not found:', chord)
            containerRef.current.innerHTML = `<p style="color: #999; font-size: 12px;">Chord not found: ${chord}</p>`
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
                orientation: 'vertical' as any
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
    const match = chordName.match(/^([A-G][#b]{0,2})(.*)$/)
    return match ? [match[1], match[2]] : ['C', '']
}

function convertToDbFormat(note: string): string {
    let normalized = note

    if (normalized.includes('##')) {
        const baseNote = normalized.replace('##', '')
        const doubleSharpMap: Record<string, string> = {
            'C': 'D',
            'D': 'E',
            'E': 'F#',
            'F': 'G',
            'G': 'A',
            'A': 'B',
            'B': 'C#'
        }
        normalized = doubleSharpMap[baseNote] || baseNote
    }

    if (normalized.includes('bb')) {
        const baseNote = normalized.replace('bb', '')
        const doubleFlatMap: Record<string, string> = {
            'C': 'Bb',
            'D': 'B',
            'E': 'D',
            'F': 'Eb',
            'G': 'F',
            'A': 'G',
            'B': 'A'
        }
        normalized = doubleFlatMap[baseNote] || baseNote
    }

    const dbFormatMap: Record<string, string> = {
        'C': 'C',
        'D': 'D',
        'E': 'E',
        'F': 'F',
        'G': 'G',
        'A': 'A',
        'B': 'B',
        
        'C#': 'Csharp',
        'D#': 'Eb',
        'F#': 'Fsharp',
        'G#': 'Ab',
        'A#': 'Bb',
        
        'Db': 'Csharp',
        'Eb': 'Eb',
        'Gb': 'Fsharp',
        'Ab': 'Ab',
        'Bb': 'Bb',
        
        'E#': 'F',
        'B#': 'C',
        'Fb': 'E',
        'Cb': 'B'
    }

    return dbFormatMap[normalized] || normalized
}

function mapChordSuffix(suffix: string): string {
    const suffixMap: Record<string, string> = {
        '': 'major',
        'm': 'minor',
        'aug': 'aug',
        'dim': 'dim',
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
