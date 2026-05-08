import { SystemBars, SystemBarsStyle } from '@capacitor/core'
import { Feed } from './components/Feed.tsx'
import { TopBar } from './components/TopBar.tsx'
import { BottomNavBar } from './components/BottomNavBar.tsx'
import { LiveScreen } from './screens/LiveScreen.tsx'
import { CameraPoCPage } from './screens/CameraPoC.tsx'

import { useState } from 'preact/hooks'
import { Livestream } from './data.ts'

export const App = () => {
  const [activeStream, setActiveStream] = useState<Livestream | null>(null)
  const [activeTab, setActiveTab] = useState('accueil')

  SystemBars.setStyle({
    style: SystemBarsStyle.Dark, // Dark icons for light backgrounds
  })

  return (
    <div class='h-full w-full flex flex-col'>
      {activeStream && (
        <LiveScreen
          stream={activeStream}
          onClose={() => setActiveStream(null)}
        />
      )}
      
      {/* Content Area */}
      <div class='flex-1 relative overflow-hidden'>
        {activeTab === 'accueil' && (
          <>
            <Feed onStreamClick={setActiveStream} />
            <div class='absolute top-0 left-0 right-0 z-10 pointer-events-none'>
              <div class='pointer-events-auto'>
                <TopBar />
              </div>
            </div>
          </>
        )}
        {activeTab === 'vendre' && <CameraPoCPage />}
        {activeTab !== 'accueil' && activeTab !== 'vendre' && (
          <div class="flex items-center justify-center h-full text-base-content/50">
            {activeTab} - En construction
          </div>
        )}
      </div>

      {activeTab !== 'vendre' && (
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
