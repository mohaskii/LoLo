import { SystemBars, SystemBarsStyle } from '@capacitor/core'
import { Feed } from './components/Feed.tsx'
import { TopBar } from './components/TopBar.tsx'
import { BottomNavBar } from './components/BottomNavBar.tsx'
import { LiveScreen } from './screens/LiveScreen.tsx'
import { CameraPoC } from './screens/CameraPoC.tsx'
import { useState } from 'preact/hooks'
import { Livestream } from './data.ts'

export const App = () => {
  const [activeStream, setActiveStream] = useState<Livestream | null>(null)
  const [showCameraPoC, setShowCameraPoC] = useState(false)

  SystemBars.setStyle({
    style: SystemBarsStyle.Dark, // Dark icons for light backgrounds
  })

  return (
    <div class='h-full w-full flex flex-col'>
      {activeStream && (
        <LiveScreen stream={activeStream} onClose={() => setActiveStream(null)} />
      )}
      {showCameraPoC && (
        <CameraPoC onClose={() => setShowCameraPoC(false)} />
      )}
      <div class='flex-1 relative'>
        <Feed onStreamClick={setActiveStream} />
        <div class='absolute top-0 left-0 right-0 z-10'>
          <TopBar />
        </div>
      </div>
      <BottomNavBar onSellClick={() => setShowCameraPoC(true)} />
    </div>
  )
}
