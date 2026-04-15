import React, { useState } from 'react'
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Globe, ExternalLink, MoreVertical } from 'lucide-react'

export default function Chrome() {
  // Safe default homepage that fully supports iframes
  const defaultHome = 'https://www.wikipedia.org'
  const [history, setHistory] = useState([defaultHome])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const [inputVal, setInputVal] = useState(defaultHome)
  const [iframeKey, setIframeKey] = useState(0)

  const currentUrl = history[currentIndex]

  const handleNavigate = (e) => {
    e.preventDefault()
    let finalUrl = inputVal.trim()
    
    // If it's a generic word (no dots except localhost), treat as a Search!
    // We use Bing because Google enforces a blocking cookie-consent wall in iframes.
    if (!finalUrl.includes('.') && !finalUrl.includes('localhost')) {
      finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(finalUrl)}`
    } else if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
       // Auto-detect localhost vs remote https
       if (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1')) {
         finalUrl = `http://${finalUrl}`
       } else {
         finalUrl = `https://${finalUrl}`
       }
    }

    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(finalUrl)
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
    setInputVal(finalUrl) // keep bar updated with formatted URL
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setInputVal(history[currentIndex - 1])
    }
  }

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setInputVal(history[currentIndex + 1])
    }
  }

  const goHome = () => {
    if (currentUrl === defaultHome) return
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(defaultHome)
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
    setInputVal(defaultHome)
  }

  const reload = () => {
    setIframeKey(k => k + 1) // Changing key forces iframe remount
  }

  return (
    <div className="w-full h-full flex flex-col bg-white text-black font-sans">
      {/* Chrome Tab Bar Mock */}
      <div className="flex items-end gap-2 px-3 pt-2 bg-[#dfe1e5] border-b border-gray-300 select-none">
        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-t-lg border-t border-x border-gray-300 text-sm font-medium text-gray-700 min-w-[150px] shadow-sm relative z-10">
          <Globe size={14} className="text-gray-500" />
          <span className="truncate max-w-[120px]">{(inputVal || '').replace('https://', '').replace('www.', '').replace('/search?q=', 'Search: ')}</span>
        </div>
      </div>

      {/* Chrome Actions / Navbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-white border-b border-gray-300">
        <div className="flex items-center gap-1 text-gray-500">
          <button onClick={goBack} disabled={currentIndex === 0} className="p-1.5 hover:bg-gray-100 rounded-full disabled:opacity-30 transition-colors"><ArrowLeft size={16} /></button>
          <button onClick={goForward} disabled={currentIndex === history.length - 1} className="p-1.5 hover:bg-gray-100 rounded-full disabled:opacity-30 transition-colors"><ArrowRight size={16} /></button>
          <button onClick={reload} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><RotateCw size={14} /></button>
          <button onClick={goHome} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Home size={16} /></button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-[#f1f3f4] border border-transparent hover:border-gray-300 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-sm rounded-full px-3 py-1 transition-all">
          <Lock size={12} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent text-gray-800"
            placeholder="Search Google or type a URL"
          />
          <Star size={14} className="text-gray-400 hover:text-yellow-500 cursor-pointer ml-2" />
        </form>

        {/* Real Chrome Extensions / Profile area */}
        <div className="flex items-center gap-1 text-gray-500">
          <button 
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group relative"
            onClick={() => window.open(currentUrl, "ChromeExternal", "width=1000,height=700,left=200,top=100,menubar=no,toolbar=no,location=yes,status=no")}
            title="Open as Standalone Chrome Window"
          >
            <ExternalLink size={16} className="text-gray-600 group-hover:text-blue-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors mx-1">
            <div className="w-6 h-6 rounded-full bg-blue-600 border border-blue-700 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">M</div>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Iframe content */}
      <div className="flex-1 bg-[#f8f9fa] relative">
        <iframe 
          key={iframeKey}
          src={currentUrl} 
          className="w-full h-full border-none"
          title="browser"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}
