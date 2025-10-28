import React from 'react';

interface InstrumentToggleProps {
  instrument: 'piano' | 'guitar';
  setInstrument: (instrument: 'piano' | 'guitar') => void;
}

export function InstrumentToggle({ instrument, setInstrument }: InstrumentToggleProps) {
  return (
    <div className="relative flex items-stretch p-1 bg-transparent border border-white/15">
      <div
        className="absolute top-1 bottom-1 bg-white shadow-lg transition-all duration-200 ease-in-out"
        style={{
          left: instrument === 'piano' ? '4px' : '50%',
          width: instrument === 'piano' ? 'calc(50% - 4px)' : 'calc(50% - 4px)'
        }}
      />
      
      <button
        onClick={() => setInstrument('piano')}
        className={`relative z-10 px-2 py-1 font-semibold flex-1 transition-colors duration-300 w-28 ${
          instrument === 'piano'
            ? 'text-black'
            : 'text-white hover:text-white/70'
        }`}
      >
        Piano
      </button>

      <button
        onClick={() => setInstrument('guitar')}
        className={`relative z-10 px-2 py-1 font-semibold flex-1 transition-colors duration-300 ${
          instrument === 'guitar'
            ? 'text-black'
            : 'text-white hover:text-white/70'
        }`}
      >
        Fretboard
      </button>
    </div>
  );
}
