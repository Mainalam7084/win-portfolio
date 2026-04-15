import React, { useEffect, useState } from 'react'
import { ChevronUp, Wifi, Shield, Usb } from 'lucide-react'
import { useStore } from '../../core/store'

export default function SystemTray() {
  const [time, setTime] = useState(new Date())
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
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
    <div className="flex h-full items-center text-xs text-white">
      {/* Hidden Icons */}
      <div className="h-full px-2 flex items-center hover:bg-white/10 transition-colors cursor-pointer">
        <ChevronUp size={16} />
      </div>

      {/* Defender/USB Static */}
      <div className="h-full px-2 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer text-gray-300">
        <Usb size={15} />
        <Shield size={14} />
      </div>

      {/* Network / Battery / Volume cluster */}
      <div 
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
      </div>

      {/* Time & Date */}
      <div className="h-full px-2 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer min-w-[70px]">
        <span>{formattedTime}</span>
        <span>{formattedDate}</span>
      </div>
      
      {/* Show Desktop sliver */}
      <div className="w-1.5 h-full border-l border-gray-600 hover:bg-white/20 cursor-pointer" title="Show Desktop"></div>
    </div>
  )
}
