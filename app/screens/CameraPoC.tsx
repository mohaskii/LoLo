import { useState } from 'preact/hooks'
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ShoppingBag,
  MessageSquare,
  Gavel,
} from 'lucide-preact'
import CameraStream from '../plugins/camera-stream.ts'

export const CameraPoC = ({ onClose }: { onClose: () => void }) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startStream = async () => {
    try {
      setError(null)
      await CameraStream.startCamera()
      setIsStreaming(true)
    } catch (e: any) {
      console.error('Error starting camera:', e)
      setError(e?.message || 'Failed to start camera')
    }
  }

  const stopStream = async () => {
    try {
      setError(null)
      await CameraStream.stopCamera()
      setIsStreaming(false)
    } catch (e: any) {
      console.error('Error stopping camera:', e)
      setError(e?.message || 'Failed to stop camera')
    }
  }

  return (
    <div class='fixed inset-0 z-50 flex flex-col' style={{ background: 'transparent' }}>
      {/* ── Top 40% — transparent to show native camera ── */}
      <div
        class='relative flex flex-col items-center justify-center'
        style={{
          height: '40vh',
          backgroundColor: isStreaming ? 'transparent' : 'rgba(0,0,0,0.85)',
          transition: 'background-color 0.4s ease',
        }}
      >
        {/* Back button */}
        <button
          onClick={onClose}
          class='absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-full z-10'
        >
          <ChevronLeft class='w-5 h-5 text-white' />
        </button>

        {/* LIVE indicator when streaming */}
        {isStreaming && (
          <div class='absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center z-10'>
            <span class='w-2 h-2 rounded-full bg-error mr-2 animate-pulse' />
            <span class='text-xs font-bold text-white uppercase'>Live</span>
          </div>
        )}

        {/* Center content when camera is off */}
        {!isStreaming && (
          <div class='flex flex-col items-center gap-4'>
            <div class='w-20 h-20 rounded-full bg-base-300/30 backdrop-blur-md flex items-center justify-center border border-white/10'>
              <Camera class='w-10 h-10 text-white/70' />
            </div>
            <p class='text-white/80 text-sm font-medium'>
              Prévisualisation Native (40%)
            </p>
            <button
              onClick={startStream}
              class='bg-primary text-primary-content font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-transform'
            >
              <Camera class='w-4 h-4' />
              Démarrer la Caméra
            </button>
          </div>
        )}

        {/* Overlay text when camera IS streaming */}
        {isStreaming && (
          <p
            class='text-white text-sm font-medium drop-shadow-lg'
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
          >
            📷 Caméra active
          </p>
        )}
      </div>

      {/* ── Bottom 60% — opaque controls ── */}
      <div
        class='flex-1 bg-base-100 flex flex-col overflow-hidden'
        style={{ height: '60vh' }}
      >
        {/* Controls header */}
        <div class='px-5 pt-5 pb-3 border-b border-base-300'>
          <h1 class='text-lg font-bold text-base-content'>
            Contrôles du Streaming
          </h1>
          <p class='text-xs text-base-content/60 mt-0.5'>
            Section opaque — 60% de l'écran
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div class='mx-5 mt-3 bg-error/10 border border-error/30 text-error text-xs px-3 py-2 rounded-lg'>
            ⚠️ {error}
          </div>
        )}

        {/* Stop button */}
        {isStreaming && (
          <div class='px-5 pt-4'>
            <button
              onClick={stopStream}
              class='w-full bg-error text-error-content font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md'
            >
              <CameraOff class='w-4 h-4' />
              Arrêter la Caméra
            </button>
          </div>
        )}

        {/* Mock content area */}
        <div class='flex-1 overflow-y-auto px-5 pt-4 pb-6 space-y-4'>
          {/* Product list mock */}
          <div class='bg-base-200 rounded-xl p-4'>
            <div class='flex items-center gap-2 mb-3'>
              <ShoppingBag class='w-4 h-4 text-accent' />
              <span class='text-sm font-bold text-base-content'>
                Produits en vente
              </span>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                class='flex items-center gap-3 py-2.5 border-b border-base-300 last:border-0'
              >
                <div class='w-10 h-10 bg-base-300 rounded-lg flex items-center justify-center text-xs text-base-content/40'>
                  #{i}
                </div>
                <div class='flex-1'>
                  <p class='text-sm font-medium text-base-content'>
                    Produit {i}
                  </p>
                  <p class='text-xs text-base-content/50'>
                    {(i * 15 + 10).toFixed(2)} €
                  </p>
                </div>
                <span class='text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium'>
                  En vente
                </span>
              </div>
            ))}
          </div>

          {/* Chat mock */}
          <div class='bg-base-200 rounded-xl p-4'>
            <div class='flex items-center gap-2 mb-3'>
              <MessageSquare class='w-4 h-4 text-secondary' />
              <span class='text-sm font-bold text-base-content'>
                Chat en direct
              </span>
            </div>
            <div class='space-y-2'>
              {['Super qualité !', 'Combien ?', 'Je prends ! 🔥'].map(
                (msg, i) => (
                  <div
                    key={i}
                    class='bg-base-300/50 rounded-lg px-3 py-1.5 text-xs text-base-content'
                  >
                    <span class='font-bold mr-1.5 text-primary'>
                      user_{i + 1}
                    </span>
                    {msg}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Bid button */}
          <button class='w-full bg-secondary text-secondary-content font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform'>
            <Gavel class='w-4 h-4' />
            Enchérir maintenant
          </button>
        </div>
      </div>
    </div>
  )
}
