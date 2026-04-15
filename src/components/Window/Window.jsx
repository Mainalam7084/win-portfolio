import React, { useState, useRef } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { ResizableBox } from 'react-resizable'
import { X, Square, Minus } from 'lucide-react'
import { useStore } from '../../core/store'
import 'react-resizable/css/styles.css'

export default function Window({ windowData, appConfig, children }) {
  const { id, title, position, size, minimized, maximized, zIndex } = windowData
  
  const closeWindow = useStore(state => state.closeWindow)
  const minimizeWindow = useStore(state => state.minimizeWindow)
  const maximizeWindow = useStore(state => state.maximizeWindow)
  const focusWindow = useStore(state => state.focusWindow)
  const updateWindowPosition = useStore(state => state.updateWindowPosition)
  const updateWindowSize = useStore(state => state.updateWindowSize)
  const activeWindowId = useStore(state => state.activeWindowId)
  const setShieldActive = useStore(state => state.setShieldActive)

  const dragControls = useDragControls()
  const [isInteracting, setIsInteracting] = useState(false)
  
  // Track continuous physical position without triggering React renders
  const currentPos = useRef({ x: position.x, y: position.y })

  if (minimized) return null
  const isActive = activeWindowId === id

  const handleDragStart = () => {
    setIsInteracting(true)
    setShieldActive(true)
    focusWindow(id)
  }

  const handleDragStop = () => {
    setIsInteracting(false)
    setShieldActive(false)
    // Synchronize Framer Motion's physical rest state with Zustand to prevent teleporting
    updateWindowPosition(id, { x: currentPos.current.x, y: currentPos.current.y })
  }

  const handleResizeStart = () => {
    setIsInteracting(true)
    setShieldActive(true)
    focusWindow(id)
  }

  const handleResizeStop = (e, { size: newSize }) => {
    setIsInteracting(false)
    setShieldActive(false)
    updateWindowSize(id, { width: newSize.width, height: newSize.height })
  }

  return (
    <motion.div
      drag={!maximized}
      dragControls={dragControls}
      dragListener={false} // Only grabbed via our explicit title bar
      dragMomentum={true}
      dragElastic={0.08} // Tighter, strict physical boundary tension
      dragConstraints={{
        left: 0,
        top: 0,
        right: window.innerWidth - size.width,
        bottom: window.innerHeight - size.height - 48
      }}
      initial={{ x: position.x, y: position.y + 20, opacity: 0, scale: 0.92, width: size.width, height: size.height }}
      animate={{ 
        x: maximized ? 0 : position.x, 
        y: maximized ? 0 : position.y,
        width: maximized ? '100vw' : size.width,
        height: maximized ? 'calc(100vh - 48px)' : size.height,
        opacity: isActive ? 1 : 0.85, 
        scale: isActive ? 1 : 0.98,
      }}
      exit={{ opacity: 0, scale: 0.92, y: currentPos.current.y + 10 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onUpdate={(latest) => {
        // Scrape physical metrics globally
        if (latest.x !== undefined) currentPos.current.x = latest.x
        if (latest.y !== undefined) currentPos.current.y = latest.y
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragStop}
      style={{ position: 'absolute', top: 0, left: 0, zIndex }}
      className={`flex flex-col bg-[#1e1e1e] border-[#3a3a3a] ${maximized ? '' : 'rounded-t-[8px]'} overflow-hidden transition-shadow duration-300 ${isActive ? 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border' : 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border opacity-95'}`}
      onPointerDownCapture={() => !isActive && focusWindow(id)}
    >
      {/* Title Bar strictly handles dragging */}
      <div 
        className={`flex justify-between items-center h-8 select-none ${isActive ? 'bg-[#2b2b2b]' : 'bg-[#1a1a1a]'} text-white border-b border-[#3a3a3a]`}
        onDoubleClick={() => maximizeWindow(id)}
        onPointerDown={(e) => !maximized && dragControls.start(e)}
      >
        <div className="flex items-center gap-2 px-3 text-xs w-full overflow-hidden cursor-default">
          <appConfig.icon size={14} className="text-blue-400 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex h-full">
          <button 
            className="w-11 flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Minus size={14} />
          </button>
          <button 
            className="w-11 flex items-center justify-center hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); maximizeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Square size={12} />
          </button>
          <button 
            className="w-11 flex items-center justify-center hover:bg-red-600 transition-colors group z-50 relative"
            onClick={(e) => { e.stopPropagation(); closeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <X size={16} className="group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white relative overflow-hidden">
        {maximized ? (
          children
        ) : (
          <ResizableBox
            width={size.width}
            height={size.height - 32} // compensate for title bar
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            resizeHandles={['se', 'e', 's']}
            minConstraints={[300, 200]}
            maxConstraints={[2000, 2000]}
          >
            <div className="w-full h-full relative">
              {children}
            </div>
          </ResizableBox>
        )}
      </div>
    </motion.div>
  )
}
