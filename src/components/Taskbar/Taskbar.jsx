import React, { useState } from 'react'
import WindowsIcon from '../../assets/icons/WindowsIcon'
import SystemTray from '../SystemTray/SystemTray'
import { Folder, Search, Activity, ChevronRight } from 'lucide-react'
import { useStore } from '../../core/store'
import { AppRegistry } from '../../core/AppRegistry'

export default function Taskbar() {
  const windows = useStore(state => state.windows)
  const activeWindowId = useStore(state => state.activeWindowId)
  const toggleWindowConfig = useStore(state => state.toggleWindowConfig)
  const isStartMenuOpen = useStore(state => state.isStartMenuOpen)
  const toggleStartMenu = useStore(state => state.toggleStartMenu)
  const closeStartMenu = useStore(state => state.closeStartMenu)
  const clearAllWindows = useStore(state => state.clearAllWindows)
  const openWindow = useStore(state => state.openWindow)

  // Search logic
  const [searchQuery, setSearchQuery] = useState('')
  const isSearching = searchQuery.trim().length > 0

  const handleOpenExplorer = () => {
    openWindow({
      app: 'explorer',
      title: 'File Explorer',
      defaultSize: AppRegistry.explorer.defaultSize,
      defaultPosition: AppRegistry.explorer.defaultPosition,
      props: { initialPath: 'This PC' } // Enforce robust default
    })
  }

  const handleClearWindows = () => {
    // We add a tiny visual feedback block logic if needed, but Zustand manages the instantaneous sweep.
    clearAllWindows()
  }

  // Filter apps for search menu
  const searchResults = Object.values(AppRegistry).filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group running instances
  const appGroups = windows.reduce((acc, win) => {
    if (!acc[win.app]) acc[win.app] = []
    acc[win.app].push(win)
    return acc
  }, {})

  return (
    <>
      {/* Invisible overlay for Start Menu cancellation */}
      {isStartMenuOpen && (
        <div className="fixed inset-0 z-40" onPointerDown={closeStartMenu} />
      )}

      {/* Invisible overlay for Search cancellation */}
      {isSearching && !isStartMenuOpen && (
        <div className="fixed inset-0 z-40" onPointerDown={() => setSearchQuery('')} />
      )}

      {/* Search Output Dropdown Overlay */}
      {isSearching && !isStartMenuOpen && (
        <div className="absolute bottom-12 left-16 w-80 max-h-[400px] bg-[#1a1a1b]/95 backdrop-blur-xl border border-[#3a3a3a] shadow-2xl flex flex-col p-2 rounded-t-lg z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          <h3 className="text-xs text-gray-400 font-semibold px-2 py-2 border-b border-gray-700/50 mb-2">Best matches for '{searchQuery}'</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {searchResults.length > 0 ? searchResults.map(app => (
              <div 
                key={app.id} 
                className="flex items-center p-2 hover:bg-white/10 rounded-md cursor-pointer transition-colors"
                onClick={() => {
                  setSearchQuery('');
                  openWindow({
                    app: app.id,
                    title: app.title,
                    defaultSize: app.defaultSize,
                    defaultPosition: app.defaultPosition
                  })
                }}
              >
                <div className="w-8 h-8 rounded bg-[#2b2b2b] flex items-center justify-center mr-3 border border-white/5">
                  <app.icon size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-white block leading-tight">{app.title}</span>
                  <span className="text-xs text-gray-400">Desktop App</span>
                </div>
                <ChevronRight size={14} className="text-gray-500" />
              </div>
            )) : (
              <div className="p-4 text-center text-gray-400 text-sm">No apps found.</div>
            )}
          </div>
        </div>
      )}

      {/* Taskbar Bar */}
      <div className="absolute bottom-0 w-full h-12 bg-[#1a1a1a]/90 backdrop-blur-md border-t border-[#3a3a3a] flex items-center justify-between text-white select-none z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        
        {/* Left items */}
        <div className="flex h-full items-center">
          {/* Start Button */}
          <div 
            className={`h-full w-12 flex items-center justify-center hover:bg-white/10 transition-all duration-200 cursor-pointer relative z-50 ${isStartMenuOpen ? 'bg-white/10 text-blue-400' : 'text-white'}`}
            onClick={toggleStartMenu}
          >
            <WindowsIcon size={20} className={isStartMenuOpen ? "drop-shadow-[0_0_8px_rgba(0,120,215,0.8)] scale-110 transition-transform" : "transition-transform"} />
          </div>

          {/* Search Bar Input */}
          <div className="h-8 max-w-xs w-64 bg-white/10 ml-1 rounded flex items-center px-3 hover:bg-white/20 transition-all duration-200 border border-white/5 relative z-50 focus-within:bg-white/20 focus-within:border-blue-500/50">
            <Search size={16} className="mr-2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                if (isStartMenuOpen) closeStartMenu();
                setSearchQuery(e.target.value);
              }}
              placeholder="Type here to search" 
              className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* Task View / Clear Windows */}
          <div 
            className="h-full w-12 flex items-center justify-center hover:bg-white/10 transition-all duration-200 cursor-pointer mx-1 relative z-50 active:scale-95 group"
            onClick={handleClearWindows}
            title="Task View (Clear all windows)"
          >
            <Activity size={18} className="group-hover:text-blue-300 transition-colors" />
          </div>

          {/* Pinned Explorer */}
          <div 
            className={`h-full w-12 flex items-center justify-center hover:bg-white/10 transition-all duration-200 cursor-pointer border-b-2 relative z-50 active:scale-95 ${!appGroups['explorer'] ? 'border-transparent' : 'border-blue-300 bg-white/5'}`}
            onClick={handleOpenExplorer}
          >
            <Folder size={20} className="text-yellow-400 drop-shadow-sm" />
          </div>

          {/* Running Apps grouped */}
          {Object.keys(appGroups).map(appId => {
            if (appId === 'explorer') return null; // Explorer is uniquely pinned above
            
            const appConfig = AppRegistry[appId]
            const groupWindows = appGroups[appId]
            const isActiveGroup = groupWindows.some(w => w.id === activeWindowId)

            return (
              <div 
                key={appId}
                className={`h-full w-12 flex items-center justify-center hover:bg-white/10 transition-all duration-200 cursor-pointer border-b-2 relative z-50 active:scale-95 ${isActiveGroup ? 'border-blue-400 bg-white/5' : 'border-[#1a1a1a] hover:border-gray-500'}`}
                onClick={() => toggleWindowConfig(groupWindows[0].id)}
              >
                <appConfig.icon size={20} className={appConfig.id === 'chrome' ? 'text-blue-200' : 'text-blue-400'} />
              </div>
            )
          })}
        </div>

        {/* Right Items */}
        <SystemTray />

        {/* Start Menu Overlay Pop-up */}
        {isStartMenuOpen && (
          <div className="absolute bottom-12 left-0 w-[400px] h-[550px] bg-[#1f1f1f]/95 backdrop-blur-xl border border-[#3a3a3a] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col p-0 rounded-tr-lg z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-4 border-b border-gray-700/50">
               <h2 className="text-white text-lg font-semibold">Start</h2>
            </div>
            
            {/* Pinned area block */}
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              <h3 className="text-xs text-gray-400 font-semibold mb-4">Pinned Apps</h3>
              <div className="grid grid-cols-4 gap-4">
                 {Object.values(AppRegistry).map(app => (
                   <div 
                     key={app.id} 
                     className="flex flex-col items-center p-2 hover:bg-white/10 rounded-md cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                     onClick={() => openWindow({
                       app: app.id,
                       title: app.title,
                       defaultSize: app.defaultSize,
                       defaultPosition: app.defaultPosition
                     })}
                   >
                     <div className="w-10 h-10 rounded shadow-md bg-[#2b2b2b] border border-white/5 flex items-center justify-center mb-2">
                       <app.icon size={20} className={app.id === 'chrome' ? 'text-blue-300' : app.id === 'explorer' ? 'text-yellow-400' : 'text-blue-500'} />
                     </div>
                     <span className="text-[11px] font-medium text-center leading-tight truncate w-full">{app.title}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Bottom user bar */}
            <div className="h-14 bg-[#111] border-t border-gray-700/50 flex items-center px-4 rounded-br-lg">
              <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 py-1.5 px-3 rounded-md transition-colors w-full">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border border-white/10">
                  <span className="text-xs font-bold text-white">MW</span>
                </div>
                <span className="text-sm font-medium text-gray-200">Main User</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
