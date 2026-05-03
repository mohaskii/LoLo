import { useState } from 'preact/hooks'
import CameraStream from '../plugins/camera-stream.ts'

export const CameraPoCPage = () => {
  const [streamMode, setStreamMode] = useState<'none' | '40percent' | 'fullscreen'>('none')
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>(['[init] PoC page loaded'])

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev.slice(-20), `[${ts}] ${msg}`])
  }

  const startStream = async (mode: '40percent' | 'fullscreen') => {
    try {
      setError(null)
      addLog(`Calling CameraStream.startCamera({ mode: '${mode}' })...`)
      await CameraStream.startCamera({ mode })
      setStreamMode(mode)
      addLog(`✅ Camera started successfully in ${mode} mode`)
    } catch (e: any) {
      const msg = e?.message || String(e)
      console.error('Error starting camera:', e)
      setError(msg)
      addLog(`❌ startCamera failed: ${msg}`)
    }
  }

  const stopStream = async () => {
    try {
      setError(null)
      addLog('Calling CameraStream.stopCamera()...')
      await CameraStream.stopCamera()
      setStreamMode('none')
      addLog('✅ Camera stopped successfully')
    } catch (e: any) {
      const msg = e?.message || String(e)
      console.error('Error stopping camera:', e)
      setError(msg)
      addLog(`❌ stopCamera failed: ${msg}`)
    }
  }

  return (
    <div class={`poc-container ${streamMode === 'fullscreen' ? 'fullscreen-mode' : ''}`}>
      {/* ── Camera preview zone ── */}
      <div class={`camera-zone ${streamMode !== 'none' ? 'on' : 'off'}`}>
        {/* Live indicator */}
        {streamMode !== 'none' && (
          <div class='live-badge'>
            <span class='live-dot' />
            <span>Live ({streamMode})</span>
          </div>
        )}

        {/* Off state — show start buttons */}
        {streamMode === 'none' && (
          <>
            <div class='camera-icon-placeholder'>📷</div>
            <p class='zone-label'>Zone caméra native</p>
            <div class='button-group'>
              <button class='btn btn-start' onClick={() => startStream('40percent')}>
                ▶ Mode 40%
              </button>
              <button class='btn btn-start fullscreen' onClick={() => startStream('fullscreen')}>
                ▶ Plein Écran
              </button>
            </div>
          </>
        )}

        {/* On state — show toggle buttons instead of simple label */}
        {streamMode !== 'none' && (
          <div class='flex flex-col items-center gap-4 mt-8'>
            <p class='active-text'>📷 Caméra active — visible ici</p>
            <div class='button-group' style={{ padding: '0 20px' }}>
              {streamMode === 'fullscreen' ? (
                <button class='btn btn-start' onClick={() => startStream('40percent')}>
                  ⬇️ Réduire à 40%
                </button>
              ) : (
                <button class='btn btn-start fullscreen' onClick={() => startStream('fullscreen')}>
                  ⬆️ Plein Écran
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom 60% — Controls ── */}
      <div class='controls-zone'>
        <div class='controls-header'>
          <h1>Contrôles du Streaming</h1>
          <p>Section opaque — 60% de l'écran</p>
        </div>

        {error && <div class='error-banner'>⚠️ {error}</div>}

        {streamMode !== 'none' && (
          <button class='btn btn-stop' onClick={stopStream}>
            ⏹ Arrêter la Caméra
          </button>
        )}

        {/* Debug log */}
        <div class='status-log'>
          {logs.map((log, i) => (
            <p key={i}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
