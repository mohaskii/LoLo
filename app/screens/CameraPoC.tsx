import { useEffect, useState } from 'preact/hooks'
import CameraStream from '../plugins/camera-stream.ts'
import { SystemBars } from '@capacitor/core'

type ViewMode = 'fullscreen' | 'manager'

export const CameraPoCPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('fullscreen')

  useEffect(() => {
    const initCamera = async () => {
      try {
        await CameraStream.startCamera({ mode: 'fullscreen' })
      } catch (e: any) {
        console.error('Error starting camera:', e)
        setError(e?.message || String(e))
      }
    }
    initCamera()
    SystemBars.show()

    return () => {
      CameraStream.stopCamera()
    }
  }, [])

  const switchToManager = async () => {
    SystemBars.hide()
    try {
      await CameraStream.startCamera({ mode: '40percent' })
      setViewMode('manager')
    } catch (e: any) {
      console.error('Error switching to manager:', e)
      setError(e?.message || String(e))
    }
  }

  const switchToFullscreen = async () => {
    try {
      await CameraStream.startCamera({ mode: 'fullscreen' })
      setViewMode('fullscreen')
    } catch (e: any) {
      console.error('Error switching to fullscreen:', e)
      setError(e?.message || String(e))
    }
  }
  const flipCamera = async () => {
    try {
      await CameraStream.flipCamera()
    } catch (e: any) {
      console.error('Error flipping camera:', e)
      setError(e?.message || String(e))
    }
  }

  return (
    <div class='relative w-full h-full bg-transparent overflow-hidden font-sans'>
      <style>
        {`
        /* CRITICAL: html + body + #app all transparent for native camera */
        html, body, #app {
            background-color: transparent !important;
        }
        /* Override #app safe-area sizing so it covers the full viewport */
        #app {
            top: 0 !important;
            height: 100vh !important;
        }

        /* Panel slide animation */
        @keyframes panelSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .panel-enter {
          animation: panelSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        `}
      </style>

      {/* ═══════════════════════════════════════════ */}
      {/* FULLSCREEN MODE — Camera + overlay controls */}
      {/* ═══════════════════════════════════════════ */}
      {viewMode === 'fullscreen' && (
        <>
          {/* Close Button Top Right */}
          <button class='absolute top-30 right-6 text-white p-2 z-50 opacity-80 hover:opacity-100'>
            <svg
              width='26'
              height='26'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>

          {/* Center Start Button */}
          <div class='absolute bottom-60 left-0 right-0 flex justify-center z-40'>
            <button class='w-[110px] h-[110px] rounded-full bg-primary text-primary-content text-2xl font-bold flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-transform active:scale-95'>
              Start
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div class='absolute bottom-30 left-4 right-4 flex gap-3 z-40'>
            {/* Left container (BRB, Stream Manager) */}
            <div class='flex-[1.2] bg-black/40 backdrop-blur-md rounded-[2rem] flex justify-evenly items-center py-4 px-2'>
              <button class='flex flex-col items-center gap-1.5 text-white opacity-90 hover:opacity-100 transition-opacity'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <path d='M5 22h14'></path>
                  <path d='M5 2h14'></path>
                  <path d='M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22'>
                  </path>
                  <path d='M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2'>
                  </path>
                </svg>
                <span class='text-[11px] font-medium tracking-wide'>BRB</span>
              </button>

              <button
                onClick={switchToManager}
                class='flex flex-col items-center gap-1.5 text-white opacity-90 hover:opacity-100 transition-opacity'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
                  <line x1='9' y1='3' x2='9' y2='21'></line>
                </svg>
                <span class='text-[11px] font-medium text-center leading-tight tracking-wide'>
                  Stream<br />Manager
                </span>
              </button>
            </div>

            {/* Right container (Flip, Mute) */}
            <div class='flex-1 bg-black/40 backdrop-blur-md rounded-[2rem] flex justify-evenly items-center py-4 px-2'>
              <button
                onClick={flipCamera}
                class='flex flex-col items-center gap-1.5 text-white opacity-90 hover:opacity-100 transition-opacity'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <path d='M17 2.1l4 4-4 4' />
                  <path d='M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4' />
                  <path d='M21 11.8v2a4 4 0 0 1-4 4H4.2' />
                </svg>
                <span class='text-[11px] font-medium tracking-wide'>Flip</span>
              </button>

              <button class='flex flex-col items-center gap-1.5 text-white opacity-90 hover:opacity-100 transition-opacity'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'>
                  </path>
                  <path d='M19 10v2a7 7 0 0 1-14 0v-2'></path>
                  <line x1='12' y1='19' x2='12' y2='23'></line>
                  <line x1='8' y1='23' x2='16' y2='23'></line>
                </svg>
                <span class='text-[11px] font-medium tracking-wide'>Mute</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* MANAGER MODE — 40% camera preview + tools panel */}
      {/* ═══════════════════════════════════════════════ */}
      {viewMode === 'manager' && (
        <>
          {/* Top 40% — transparent camera preview zone */}
          <div class='h-[40vh] bg-transparent relative' style="padding-top: var(--safe-area-inset-top)">
            {/* Live indicator badge */}
            <div class='absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold uppercase text-white z-10'>
              <span class='w-2 h-2 rounded-full bg-error animate-pulse' />
              <span>Preview</span>
            </div>

            {/* Return to fullscreen — floating button */}
            <button
              onClick={switchToFullscreen}
              class='absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/70 transition-colors z-10'
              title='Plein écran'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <polyline points='15 3 21 3 21 9'></polyline>
                <polyline points='9 21 3 21 3 15'></polyline>
                <line x1='21' y1='3' x2='14' y2='10'></line>
                <line x1='3' y1='21' x2='10' y2='14'></line>
              </svg>
            </button>
          </div>

          {/* Bottom 60% — Stream Manager Panel */}
          <div class='h-[60vh] bg-base-200 rounded-t-3xl panel-enter flex flex-col overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.3)]'>
            {/* Panel Header */}
            <div class='flex items-center justify-between px-5 pt-5 pb-3'>
              <div class='flex items-center gap-3'>
                <div class='w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center'>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    class='text-primary'
                  >
                    <rect x='3' y='3' width='18' height='18' rx='2' ry='2'>
                    </rect>
                    <line x1='9' y1='3' x2='9' y2='21'></line>
                  </svg>
                </div>
                <div>
                  <h2 class='text-base font-bold text-base-content'>
                    Stream Manager
                  </h2>
                  <p class='text-[11px] text-base-content/50'>Outils vendeur</p>
                </div>
              </div>
              <button
                onClick={switchToFullscreen}
                class='text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors'
              >
                ← Retour
              </button>
            </div>

            {/* Divider */}
            <div class='h-px bg-base-content/8 mx-5' />

            {/* Scrollable tools area */}
            <div class='flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3'>
              {/* Quick Actions Grid */}
              <div class='grid grid-cols-3 gap-3'>
                {/* Add Product */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-primary'
                    >
                      <line x1='12' y1='5' x2='12' y2='19'></line>
                      <line x1='5' y1='12' x2='19' y2='12'></line>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Ajouter<br />Produit
                  </span>
                </button>

                {/* Pinned Product */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-gold-500'
                    >
                      <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'>
                      </path>
                      <circle cx='12' cy='10' r='3'></circle>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Épingler<br />Produit
                  </span>
                </button>

                {/* Polls / Sondage */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-green-500'
                    >
                      <line x1='18' y1='20' x2='18' y2='10'></line>
                      <line x1='12' y1='20' x2='12' y2='4'></line>
                      <line x1='6' y1='20' x2='6' y2='14'></line>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Sondage
                  </span>
                </button>

                {/* Timer */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-secondary'
                    >
                      <circle cx='12' cy='12' r='10'></circle>
                      <polyline points='12 6 12 12 16 14'></polyline>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Timer
                  </span>
                </button>

                {/* Overlay / Banner */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-orchid-400/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-orchid-400'
                    >
                      <rect x='2' y='7' width='20' height='10' rx='2' ry='2'>
                      </rect>
                      <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'>
                      </path>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Bannière
                  </span>
                </button>

                {/* Giveaway */}
                <button class='flex flex-col items-center gap-2 p-4 rounded-2xl bg-base-300 hover:bg-base-300/80 transition-colors'>
                  <div class='w-10 h-10 rounded-full bg-error/15 flex items-center justify-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      class='text-error'
                    >
                      <polyline points='20 12 20 22 4 22 4 12'></polyline>
                      <rect x='2' y='7' width='20' height='5'></rect>
                      <line x1='12' y1='22' x2='12' y2='7'></line>
                      <path d='M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z'>
                      </path>
                      <path d='M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'>
                      </path>
                    </svg>
                  </div>
                  <span class='text-[11px] font-medium text-base-content/80 text-center leading-tight'>
                    Giveaway
                  </span>
                </button>
              </div>

              {/* Stream Stats Summary */}
              <div class='mt-2 p-4 rounded-2xl bg-base-300'>
                <h3 class='text-xs font-bold text-base-content/60 uppercase tracking-wider mb-3'>
                  Stats en direct
                </h3>
                <div class='grid grid-cols-3 gap-3'>
                  <div class='text-center'>
                    <p class='text-xl font-bold text-base-content'>0</p>
                    <p class='text-[10px] text-base-content/50 mt-0.5'>
                      Spectateurs
                    </p>
                  </div>
                  <div class='text-center'>
                    <p class='text-xl font-bold text-primary'>0</p>
                    <p class='text-[10px] text-base-content/50 mt-0.5'>
                      Ventes
                    </p>
                  </div>
                  <div class='text-center'>
                    <p class='text-xl font-bold text-green-500'>0€</p>
                    <p class='text-[10px] text-base-content/50 mt-0.5'>
                      Revenus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error toast — always visible */}
      {error && (
        <div class='absolute top-24 left-4 right-4 bg-error/80 text-error-content px-4 py-2 rounded-xl text-sm z-50 text-center backdrop-blur-sm'>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}
