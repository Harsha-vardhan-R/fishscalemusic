import React from 'react';

interface InstrumentToggleProps {
  instrument: 'piano' | 'guitar';
  setInstrument: (instrument: 'piano' | 'guitar') => void;
}

export function InstrumentToggle({ instrument, setInstrument }: InstrumentToggleProps) {
  return (
    <div className="lex items-stretch gap-2 p-2 bg-transparent border border-white/15">
      <button
        onClick={() => setInstrument('piano')}
        className={`px-2 py-1 font-semibold border ${
          instrument === 'piano'
            ? 'shadow-lg bg-white text-black'
            : 'border-transparent hover:border-white/15'
        }`}
      >
        Piano
      </button>

      <button
        onClick={() => setInstrument('guitar')}
        className={`px-2 py-1 font-semibold border ${
          instrument === 'guitar'
            ? 'shadow-lg bg-white/90 text-black'
            : 'border-transparent hover:border-white/15'
        }`}
      >
        Fretboard
      </button>
    </div>
  );
}
