import React, { useState } from 'react'
import { Folder, Image as ImageIcon, FileText, Video, Download, Monitor, HardDrive, File as FileIcon } from 'lucide-react'

const MOCK_FILES = {
  Desktop: [
    { name: 'Projects', type: 'folder', icon: Folder },
    { name: 'notes.txt', type: 'text', icon: FileText },
  ],
  Downloads: [
    { name: 'installer.exe', type: 'file', icon: FileIcon },
    { name: 'vacation.mp4', type: 'video', icon: Video },
  ],
  Documents: [
    { name: 'Resume.pdf', type: 'file', icon: FileText },
  ],
  Images: [
    { name: 'wallpaper.jpg', type: 'image', icon: ImageIcon },
  ],
  Videos: [],
  'This PC': [
    { name: 'Local Disk (C:)', type: 'drive', icon: HardDrive },
  ]
}

const SIDEBAR_ITEMS = [
  { name: 'Quick Access', icon: Folder, isLabel: true },
  { name: 'Desktop', icon: Monitor },
  { name: 'Downloads', icon: Download },
  { name: 'Documents', icon: FileText },
  { name: 'Images', icon: ImageIcon },
  { name: 'Videos', icon: Video },
  { name: 'This PC', icon: HardDrive },
]

export default function Explorer({ initialPath = 'This PC' }) {
  const [currentPath, setCurrentPath] = useState(initialPath)

  const files = MOCK_FILES[currentPath] || []

  return (
    <div className="w-full h-full flex flex-col bg-white text-black text-sm">
      {/* Top Toolbar */}
      <div className="flex items-center px-4 py-2 bg-[#f0f0f0] border-b border-gray-300 gap-4">
        <div className="flex gap-2">
          {/* Mock nav arrows */}
          <div className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 cursor-pointer">&lt;</div>
          <div className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-400">&gt;</div>
        </div>
        <div className="flex-1 bg-white border border-gray-300 px-3 py-1 flex items-center shadow-inner">
          <Folder size={14} className="mr-2 text-blue-500" />
          {currentPath}
        </div>
        <div className="w-48 bg-white border border-gray-300 px-3 py-1 text-gray-500 italic shadow-inner">
          Search {currentPath}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#f5f6f7] border-r border-gray-300 overflow-y-auto py-2">
          {SIDEBAR_ITEMS.map((item, i) => (
            item.isLabel ? (
              <div key={i} className="px-4 py-1 text-xs text-gray-500 mt-2">{item.name}</div>
            ) : (
              <div 
                key={i} 
                className={`flex items-center px-6 py-1 cursor-pointer ${currentPath === item.name ? 'bg-blue-100' : 'hover:bg-[#e5f3ff]'}`}
                onClick={() => setCurrentPath(item.name)}
              >
                <item.icon size={16} className={`mr-2 ${currentPath === item.name ? 'text-blue-500' : 'text-blue-400'}`} />
                <span>{item.name}</span>
              </div>
            )
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          <div className="font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">{currentPath}</div>
          {files.length === 0 ? (
            <div className="text-gray-400 flex justify-center items-center h-32">This folder is empty.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="w-24 flex flex-col items-center justify-start p-2 hover:bg-[#e5f3ff] hover:outline-1 hover:outline-[#cce8ff] rounded border border-transparent cursor-pointer">
                  <file.icon size={40} className={file.type === 'folder' ? 'text-yellow-400' : 'text-blue-400'} />
                  <span className="mt-2 text-center break-words w-full truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
