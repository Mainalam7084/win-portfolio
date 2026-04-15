import React, { useState } from 'react'
import { Search, ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react'

export default function Chrome() {
  const [url, setUrl] = useState('https://www.wikipedia.org')
  const [inputVal, setInputVal] = useState('https://www.wikipedia.org')

  const handleNavigate = (e) => {
    e.preventDefault()
    let finalUrl = inputVal
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`
    }
    setUrl(finalUrl)
    setInputVal(finalUrl)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white text-black">
      {/* Chrome Header / Navbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f1f3f4] border-b border-gray-300">
        <div className="flex items-center gap-2 text-gray-600">
          <button className="p-1 hover:bg-gray-200 rounded-full"><ArrowLeft size={16} /></button>
          <button className="p-1 hover:bg-gray-200 rounded-full"><ArrowRight size={16} /></button>
          <button className="p-1 hover:bg-gray-200 rounded-full"><RotateCw size={16} /></button>
          <button className="p-1 hover:bg-gray-200 rounded-full"><Home size={16} /></button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white border border-transparent hover:border-gray-300 focus-within:border-blue-500 focus-within:shadow-sm rounded-full px-4 py-1">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </form>
      </div>

      {/* Iframe content */}
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="browser"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}
