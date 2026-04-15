import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Music, X } from 'lucide-react'
import { useRadioStore } from '../../core/radioStore'
import { useStore } from '../../core/store'

export default function MiniRadioPlayer() {
  const { isPlaying, currentStation, togglePlay, playNext, playPrev, stopAudio } = useRadioStore()
  
  // Check if radio window is open AND minimized
  const windows = useStore(state => state.windows)
  const restoreWindow = useStore(state => state.restoreWindow)
  const closeWindow = useStore(state => state.closeWindow)
  
  const radioWindow = windows.find(w => w.app === 'radio')
  const isRadioMinimized = radioWindow?.minimized

  // Condition to show the mini widget (keep it visible even if paused so user doesn't lose the interface)
  const shouldShow = isRadioMinimized

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed top-6 right-6 z-[999] bg-[#1e1e1e]/95 backdrop-blur-xl border border-[#3a3a3a] shadow-2xl rounded-xl p-3 w-64 flex flex-col gap-3 group"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-3 cursor-pointer flex-1 overflow-hidden" 
              onClick={() => restoreWindow(radioWindow.id)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 relative">
                <Music size={18} className="text-white" />
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-50"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-white text-sm font-semibold truncate leading-tight">{currentStation.name}</h4>
                <p className="text-blue-400 text-[10px] uppercase font-bold tracking-wider">Live Radio</p>
              </div>
            </div>
            
            <button 
              className="p-1.5 text-gray-400 hover:bg-red-600 hover:text-white rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                stopAudio()
                closeWindow(radioWindow.id)
              }}
              title="Close Radio"
            >
              <X size={16} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={playPrev} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition active:scale-95">
              <SkipBack size={16} />
            </button>
            <button onClick={togglePlay} className="p-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full transition active:scale-95 shadow-md shadow-blue-600/20">
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition active:scale-95">
              <SkipForward size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
