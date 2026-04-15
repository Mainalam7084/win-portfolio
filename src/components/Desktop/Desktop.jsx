import React from 'react'
import { Folder, Image as ImageIcon, FileText, Video, Monitor, Download, Globe } from 'lucide-react'
import { useStore } from '../../core/store'
import { AppRegistry } from '../../core/AppRegistry'
import bgImage from '../../assets/fondoWindows.jpg'

const SHORTCUTS = [
  { name: 'Desktop', icon: Monitor, type: 'explorer' },
  { name: 'Downloads', icon: Download, type: 'explorer' },
  { name: 'Documents', icon: FileText, type: 'explorer' },
  { name: 'Images', icon: ImageIcon, type: 'explorer' },
  { name: 'Videos', icon: Video, type: 'explorer' },
  { name: 'This PC', icon: Monitor, type: 'explorer' },
  { name: 'Chrome', icon: Globe, type: 'chrome' },
]

export default function Desktop() {
  const openWindow = useStore(state => state.openWindow)
  const clearAllWindows = useStore(state => state.clearAllWindows)
  const closeStartMenu = useStore(state => state.closeStartMenu)

  const handleShortcutDoubleLick = (shortcut) => {
    // If it's a folder, open Explorer with that path
    // For now we just open the associated app
    const appConfig = AppRegistry[shortcut.type]
    if (appConfig) {
      openWindow({
        app: shortcut.type,
        title: shortcut.type === 'explorer' ? shortcut.name : appConfig.title,
        props: shortcut.type === 'explorer' ? { initialPath: shortcut.name } : {},
        defaultSize: appConfig.defaultSize,
        defaultPosition: appConfig.defaultPosition
      })
    }
  }

  return (
    <div 
      className="absolute inset-0 bg-[#1f1f1f] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
      onClick={() => closeStartMenu()}
    >
      <div className="flex flex-col flex-wrap h-[calc(100vh-48px)] w-fit content-start p-2 gap-2">
        {SHORTCUTS.map((shortcut, idx) => (
          <div 
            key={idx} 
            className="w-20 p-2 flex flex-col items-center justify-center text-white hover:bg-white/10 border border-transparent hover:border-white/20 rounded shadow-sm cursor-pointer"
            onDoubleClick={() => handleShortcutDoubleLick(shortcut)}
          >
            <shortcut.icon size={36} className="mb-2 drop-shadow-md" strokeWidth={1.5} />
            <span className="text-xs text-center drop-shadow-md break-words line-clamp-2 w-full">{shortcut.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
