import React, { useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Radio as RadioIcon, Music, AlertCircle } from 'lucide-react'
import { useRadioStore, MOCK_STATIONS } from '../../core/radioStore'

export default function Radio() {
  const { 
    isPlaying, 
    isBuffering, 
    error, 
    currentStation, 
    initAudio, 
    togglePlay, 
    playNext, 
    playPrev, 
    setStation 
  } = useRadioStore()

  useEffect(() => {
    initAudio()
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] text-white">
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 relative">
          <Music size={48} className="text-white" />
          {(isPlaying || isBuffering) && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-center">{currentStation.name}</h2>
        <p className="text-gray-400 text-sm mb-4">Live Broadcasting</p>

        {error && (
          <div className="mb-4 text-xs text-red-400 flex items-center bg-red-400/10 px-3 py-1.5 rounded-full">
            <AlertCircle size={14} className="mr-2" /> {error}
          </div>
        )}

        <div className="flex items-center gap-6">
          <button onClick={playPrev} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition active:scale-95">
            <SkipBack size={24} />
          </button>
          
          <button 
            className="p-5 bg-blue-600 rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center"
            onClick={togglePlay}
          >
            {isBuffering ? (
              <div className="w-8 h-8 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={32} />
            ) : (
              <Play size={32} className="ml-1" />
            )}
          </button>
          
          <button onClick={playNext} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition active:scale-95">
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border-t border-gray-800 h-1/3 overflow-y-auto p-4 custom-scrollbar">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Stations</h3>
        <div className="flex flex-col gap-2">
          {MOCK_STATIONS.map(station => (
            <button
              key={station.id}
              onClick={() => {
                setStation(station)
                if (!isPlaying) togglePlay() // Wait, setStation automatically plays if isPlaying was true, but if it was false, the user clicked it so they probably want it to start playing.
                // Let's check: if !isPlaying, calling togglePlay after setStation is fine since wait, setStation doesn't block. togglePlay will hit `.play()`.
              }}
              className={`flex items-center p-3 rounded-lg text-left transition ${currentStation.id === station.id ? 'bg-blue-600/20 border border-blue-500/50' : 'hover:bg-gray-800 border border-transparent'}`}
            >
              <RadioIcon size={20} className={`mr-3 ${currentStation.id === station.id ? 'text-blue-400' : 'text-gray-400'}`} />
              <span className={currentStation.id === station.id ? 'text-white font-medium' : 'text-gray-300'}>{station.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
