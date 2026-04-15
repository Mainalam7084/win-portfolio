import React from 'react'
import Desktop from './components/Desktop/Desktop'
import Taskbar from './components/Taskbar/Taskbar'
import WindowManager from './core/WindowManager'
import { useStore } from './core/store'

function App() {
  const isShieldActive = useStore(state => state.isShieldActive)

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative select-none">
      {/* Global dragging shield to block iframe pointer event swallowing */}
      {isShieldActive && <div className="absolute inset-0 z-[9999] cursor-move" />}
      
      <div className="flex-1 relative z-0">
        <Desktop />
        <WindowManager />
      </div>
      <div className="h-12 relative z-50">
        <Taskbar />
      </div>
    </div>
  )
}

export default App
