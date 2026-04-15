import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable'
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

  const nodeRef = useRef(null)
  
  // Local state for dimming borders slightly during drag
  const [isInteracting, setIsInteracting] = useState(false)

  if (minimized) return null

  const isActive = activeWindowId === id

  const handleDragStart = () => {
    setIsInteracting(true)
    setShieldActive(true)
    focusWindow(id)
  }

  const handleDragStop = (e, data) => {
    setIsInteracting(false)
    setShieldActive(false)
    updateWindowPosition(id, { x: data.x, y: data.y })
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

  let content = (
    <div 
      className={`flex flex-col bg-[#1e1e1e] border-[#3a3a3a] rounded-t-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isActive ? 'shadow-2xl border' : 'shadow-lg border opacity-95'} transition-shadow`}
      style={{
        width: maximized ? '100vw' : size.width,
        height: maximized ? 'calc(100vh - 48px)' : size.height,
        // We no longer manually disable pointer events here because App.jsx shield covers iframes securely.
      }}
      onPointerDownCapture={() => !isActive && focusWindow(id)}
    >
      {/* Title Bar */}
      <div 
        className={`handle flex justify-between items-center h-8 select-none ${isActive ? 'bg-[#2b2b2b]' : 'bg-[#1a1a1a]'} text-white border-b border-[#3a3a3a]`}
        onDoubleClick={() => maximizeWindow(id)}
      >
        <div className="flex items-center gap-2 px-3 text-xs w-full overflow-hidden">
          <appConfig.icon size={14} className="text-blue-400 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex h-full">
          <button 
            className="w-11 flex items-center justify-center hover:bg-white/10 transition-colors no-drag"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Minus size={14} />
          </button>
          <button 
            className="w-11 flex items-center justify-center hover:bg-white/10 transition-colors no-drag"
            onClick={(e) => { e.stopPropagation(); maximizeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Square size={12} />
          </button>
          <button 
            className="w-11 flex items-center justify-center hover:bg-red-600 transition-colors group no-drag"
            onClick={(e) => { e.stopPropagation(); closeWindow(id) }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <X size={16} className="group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {children}
      </div>
    </div>
  )

  if (maximized) {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex }}>
        {content}
      </div>
    )
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".handle"
      cancel=".no-drag"
      defaultPosition={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div ref={nodeRef} style={{ position: 'absolute', zIndex }}>
        <ResizableBox
          width={size.width}
          height={size.height}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          resizeHandles={['se', 'e', 's']}
          minConstraints={[300, 200]}
          maxConstraints={[2000, 2000]}
        >
          {content}
        </ResizableBox>
      </div>
    </Draggable>
  )
}
