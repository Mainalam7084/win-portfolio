import { create } from 'zustand'

export const useStore = create((set) => ({
  // Window Management
  windows: [],
  activeWindowId: null,
  maxZIndex: 1,

  // Start Menu
  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // System State
  systemState: {
    battery: { level: 100, charging: false },
    wifi: true,
  },
  updateSystemState: (updates) => set((state) => ({
    systemState: { ...state.systemState, ...updates }
  })),

  isShieldActive: false,
  setShieldActive: (active) => set({ isShieldActive: active }),

  toggleWindowConfig: (id) => set((state) => {
    const existing = state.windows.find(w => w.id === id)
    if (!existing) return state

    // If active, minimize it
    if (state.activeWindowId === id) {
      return {
        windows: state.windows.map(w => w.id === id ? { ...w, minimized: true } : w),
        activeWindowId: null
      }
    }

    // Otherwise, bring to front and unminimize
    return {
      windows: state.windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: state.maxZIndex + 1 } : w),
      activeWindowId: id,
      maxZIndex: state.maxZIndex + 1
    }
  }),

  // Window Actions
  openWindow: (appData) => set((state) => {
    // Check if window already open by app type
    const existing = state.windows.find(w => w.app === appData.app)
    if (existing) {
      return {
        windows: state.windows.map(w => w.id === existing.id ? { ...w, minimized: false, props: appData.props, zIndex: state.maxZIndex + 1 } : w),
        activeWindowId: existing.id,
        maxZIndex: state.maxZIndex + 1,
        isStartMenuOpen: false
      }
    }

    const newWindow = {
      id: `win_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      app: appData.app, // Id from AppRegistry
      title: appData.title,
      props: appData.props || {},
      position: appData.defaultPosition || { x: 50, y: 50 },
      size: appData.defaultSize || { width: 800, height: 600 },
      minimized: false,
      maximized: false,
      zIndex: state.maxZIndex + 1,
    }

    return {
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      maxZIndex: state.maxZIndex + 1,
      isStartMenuOpen: false // Close start menu on app open
    }
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, minimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, minimized: false, zIndex: state.maxZIndex + 1 } : w),
    activeWindowId: id,
    maxZIndex: state.maxZIndex + 1
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, maximized: !w.maximized, zIndex: state.maxZIndex + 1 } : w),
    activeWindowId: id,
    maxZIndex: state.maxZIndex + 1
  })),

  focusWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, zIndex: state.maxZIndex + 1 } : w),
    activeWindowId: id,
    maxZIndex: state.maxZIndex + 1
  })),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, position } : w)
  })),

  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, size } : w)
  })),

  clearAllWindows: () => set({ windows: [], activeWindowId: null })
}))
