import React, { useEffect, useState } from 'react'
import { ChevronUp, Wifi, Shield, Usb } from 'lucide-react'
import { useStore } from '../../core/store'
import { motion, AnimatePresence } from 'framer-motion'

export default function SystemTray() {
  const [time, setTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
  const [showHiddenIcons, setShowHiddenIcons] = useState(false)
  const openWindow = useStore(state => state.openWindow)

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Battery
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.floor(battery.level * 100))
        setIsCharging(battery.charging)

        battery.addEventListener('levelchange', () => setBatteryLevel(Math.floor(battery.level * 100)))
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging))
      })
    }
  }, [])

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formattedDate = time.toLocaleDateString()

  const openRadio = () => {
    openWindow({
      app: 'radio',
      title: 'Radio',
      defaultSize: { width: 400, height: 600 },
      defaultPosition: { x: window.innerWidth - 420, y: window.innerHeight - 660 }
    })
  }

  return (
    <>
      {/* Invisible overlay for Hidden Icons popup cancellation */}
      {showHiddenIcons && (
        <div className="fixed inset-0 z-40" onPointerDown={() => setShowHiddenIcons(false)} />
      )}

      <div className="flex h-full items-center text-xs text-white relative z-50">
        
        {/* Hidden Icons Button */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`h-full px-2 flex items-center hover:bg-white/10 transition-colors cursor-pointer ${showHiddenIcons ? 'bg-white/10' : ''}`}
          onClick={() => setShowHiddenIcons(!showHiddenIcons)}
        >
          <ChevronUp 
            size={16} 
            className={`transition-transform duration-300 ${showHiddenIcons ? 'rotate-180' : 'rotate-0'}`} 
          />
        </motion.div>

        {/* Hidden Icons Popup */}
        <AnimatePresence>
          {showHiddenIcons && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute bottom-12 left-0 w-32 bg-[#1f1f1f]/95 backdrop-blur-xl border border-[#3a3a3a] shadow-lg flex flex-wrap p-2 rounded-t-md z-[60]"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-1/3 aspect-square flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors text-gray-300" title="Safely Remove Hardware">
                <Usb size={16} />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-1/3 aspect-square flex items-center justify-center hover:bg-white/10 rounded cursor-pointer transition-colors text-gray-300" title="Windows Security">
                <Shield size={15} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network / Battery / Volume cluster */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-full px-2 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer"
          onClick={openRadio}
        >
          <Wifi size={15} />
          {/* Basic Battery Icon Representation */}
          <div className="flex items-center gap-1" title={`${batteryLevel}% ${isCharging ? '(Charging)' : ''}`}>
            <div className="w-5 h-[10px] border border-white rounded-[2px] p-[1px] flex relative">
              <div 
                className={`h-full bg-white transition-all ${batteryLevel < 20 && !isCharging ? 'bg-red-500' : ''}`}
                style={{ width: `${batteryLevel}%` }}
              />
              {isCharging && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-green-500 font-bold mix-blend-difference">⚡</div>}
            </div>
          </div>
        </motion.div>

        {/* Time & Date */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="h-full px-2 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer min-w-[70px]"
        >
          <span>{formattedTime}</span>
          <span>{formattedDate}</span>
        </motion.div>
        
        {/* Show Desktop sliver */}
        <div className="w-1.5 h-full border-l border-gray-600 hover:bg-white/20 cursor-pointer" title="Show Desktop"></div>
      </div>
    </>
  )
}
