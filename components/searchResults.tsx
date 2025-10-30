'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SongResult {
  song_name: string;
  artists: string | string[];
  chords: string[];
}

interface SongDrawerProps {
  results: SongResult[];
  count: number;
}

export default function SongDrawer({ results = [], count = 0 }: SongDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className={`fixed top-6 right-6 z-[9999] transition-all duration-400 bg-transparent backdrop-blur-sm rounded-none border-1 py-0 ${
        open ? 'w-100 h-[calc(100vh-128px)] border-white' : 'w-64 h-8 border-white/50'
      }`}
    >
      <Button 
          onClick={() => setOpen(!open)} 
          variant="ghost" 
          size="sm"
          className=" cursor-pointer top-0 self-end text-gray-600 hover:text-black hover:bg-white/90 w-full h-8 text-center rounded-none m-0 active:bg-white/white"
        >
          {open ? 'MINIMISE' : 'MAXIMISE SEARCH RESULTS'}
        </Button>
      <div className="flex flex-col h-full gap-0 p-0 overflow-y-scroll overflow-x-clip">
        

        {open && (
          <>
            <div className="sticky px-6 py-2 border-b border-gray-700">
              <h2 className="text-gray-400 text-sm font-semibold">
                SIMILAR SONGS ({results.length})
              </h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-4">
                {results.length === 0 ? (
                  <p className="text-gray-600 text-sm">No songs found.</p>
                ) : (
                  results.map((song, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-700 last:border-b-0">
                      <div className="text-white font-medium text-sm">
                        {song.song_name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {Array.isArray(song.artists) ? song.artists.join(', ') : song.artists}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {song.chords?.join(' • ') || 'N/A'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </Card>
  );
}
