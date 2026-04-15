import React from 'react'
import { useStore } from './store'
import { AppRegistry } from './AppRegistry'
import Window from '../components/Window/Window'

export default function WindowManager() {
  const windows = useStore(state => state.windows)

  return (
    <>
      {windows.map(win => {
        const appConfig = AppRegistry[win.app]
        if (!appConfig) return null

        const AppContent = appConfig.component

        return (
          <Window key={win.id} windowData={win} appConfig={appConfig}>
            <AppContent {...(win.props || {})} />
          </Window>
        )
      })}
    </>
  )
}
