import { Folder, Globe as ChromeIcon, Radio } from 'lucide-react'

// Import applications statically for now
import Explorer from '../apps/Explorer/Explorer'
import ChromeApp from '../apps/Chrome/Chrome'
import RadioApp from '../apps/Radio/Radio'

export const AppRegistry = {
  explorer: {
    id: 'explorer',
    title: 'File Explorer',
    icon: Folder,
    component: Explorer,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 100, y: 100 },
  },
  chrome: {
    id: 'chrome',
    title: 'Google Chrome',
    icon: ChromeIcon,
    component: ChromeApp,
    defaultSize: { width: 1024, height: 768 },
    defaultPosition: { x: 50, y: 50 },
  },
  radio: {
    id: 'radio',
    title: 'Radio',
    icon: Radio,
    component: RadioApp,
    defaultSize: { width: 400, height: 600 },
    defaultPosition: { x: 200, y: 100 },
  }
}
