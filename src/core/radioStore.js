import { create } from 'zustand'

export const MOCK_STATIONS = [
  { id: 1, name: 'Lofi Hip Hop', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  { id: 2, name: 'Classical FM', url: 'https://strm112.1.fm/classical_mobile_mp3' },
  { id: 3, name: 'Synthwave / Retro', url: 'https://strm112.1.fm/back280s_mobile_mp3' },
]

export const useRadioStore = create((set, get) => ({
  // Initialize native Audio object outside React components
  audioElement: new Audio(),
  
  isPlaying: false,
  isBuffering: false,
  currentStation: MOCK_STATIONS[0],
  error: null,

  // Initialize event listeners once
  initAudio: () => {
    const audio = get().audioElement
    
    // Safety check to avoid duplicate listeners
    if (audio.onended !== null) return

    audio.onended = () => set({ isPlaying: false })
    audio.onerror = () => {
      set({ isPlaying: false, error: "Stream unreachable." })
    }
    audio.onplaying = () => set({ isBuffering: false })
    audio.onwaiting = () => set({ isBuffering: true })
    
    audio.src = get().currentStation.url
  },

  togglePlay: () => {
    const { audioElement, isPlaying } = get()
    set({ error: null })

    if (isPlaying) {
      audioElement.pause()
      set({ isPlaying: false })
    } else {
      set({ isBuffering: true })
      audioElement.play().then(() => {
        set({ isPlaying: true, isBuffering: false })
      }).catch(err => {
        console.error("Audio playback failed:", err)
        set({ error: "Error playing stream.", isBuffering: false, isPlaying: false })
      })
    }
  },

  stopAudio: () => {
    const { audioElement } = get()
    audioElement.pause()
    set({ isPlaying: false, isBuffering: false })
  },

  playNext: () => {
    const { currentStation, _playStation } = get()
    const currentIndex = MOCK_STATIONS.findIndex(s => s.id === currentStation.id)
    const nextObj = MOCK_STATIONS[(currentIndex + 1) % MOCK_STATIONS.length]
    _playStation(nextObj)
  },

  playPrev: () => {
    const { currentStation, _playStation } = get()
    const currentIndex = MOCK_STATIONS.findIndex(s => s.id === currentStation.id)
    const nextObj = MOCK_STATIONS[(currentIndex - 1 + MOCK_STATIONS.length) % MOCK_STATIONS.length]
    _playStation(nextObj)
  },

  setStation: (stationObj) => {
    get()._playStation(stationObj)
  },

  _playStation: (stationObj) => {
    const audio = get().audioElement
    const wasPlaying = get().isPlaying

    audio.pause()
    set({ currentStation: stationObj, error: null })
    audio.src = stationObj.url
    audio.load()

    if (wasPlaying) {
      set({ isBuffering: true })
      audio.play().catch(err => {
        console.error("Audio playback failed:", err)
        set({ error: "Autoplay blocked. Please press play manually.", isPlaying: false })
      }).finally(() => {
        set({ isBuffering: false })
      })
    }
  }
}))
