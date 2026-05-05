import { useState } from 'preact/hooks'
import { SellerLiveScreen } from './screens/SellerLiveScreen.tsx'
import { BuyerLiveScreen } from './screens/BuyerLiveScreen.tsx'
import { CameraPoCPage } from './screens/CameraPoC.tsx'

export const App = () => {
  const [view, setView] = useState<'poc' | 'seller' | 'buyer'>('poc')

  return (
    <div id='main-app' class='h-full w-full'>
      <nav
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          padding: '10px',
        }}
      >
        <button
          type='button'
          onClick={() => setView('poc')}
          style={{ color: view === 'poc' ? '#a855f7' : '#fff' }}
        >
          PoC
        </button>
        <button
          type='button'
          onClick={() => setView('seller')}
          style={{ color: view === 'seller' ? '#a855f7' : '#fff' }}
        >
          Vendeur
        </button>
        <button
          type='button'
          onClick={() => setView('buyer')}
          style={{ color: view === 'buyer' ? '#a855f7' : '#fff' }}
        >
          Acheteur
        </button>
      </nav>

      {view === 'poc' && <CameraPoCPage />}
      {view === 'seller' && <SellerLiveScreen />}
      {view === 'buyer' && <BuyerLiveScreen />}
    </div>
  )
}
