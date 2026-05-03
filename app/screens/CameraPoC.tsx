import { useState } from 'preact/hooks'
import CameraStream from '../plugins/camera-stream.ts'

export const CameraPoCPage = () => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>(['[init] PoC page loaded'])

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev.slice(-20), `[${ts}] ${msg}`])
  }

  const startStream = async () => {
    try {
      setError(null)
      addLog('Calling CameraStream.startCamera()...')
      await CameraStream.startCamera()
      setIsStreaming(true)
      addLog('✅ Camera started successfully')
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
      setIsStreaming(false)
      addLog('✅ Camera stopped successfully')
    } catch (e: any) {
      const msg = e?.message || String(e)
      console.error('Error stopping camera:', e)
      setError(msg)
      addLog(`❌ stopCamera failed: ${msg}`)
    }
  }

  return (
    <div class='poc-container'>
      {/* ── Top 40% — Camera preview zone ── */}
      <div class={`camera-zone ${isStreaming ? 'on' : 'off'}`}>
        {/* Live indicator */}
        {isStreaming && (
          <div class='live-badge'>
            <span class='live-dot' />
            <span>Live</span>
          </div>
        )}

        {/* Off state — show start button */}
        {!isStreaming && (
          <>
            <div class='camera-icon-placeholder'>📷</div>
            <p class='zone-label'>Zone caméra native (40%)</p>
            <button class='btn btn-start' onClick={startStream}>
              ▶ Démarrer la Caméra
            </button>
          </>
        )}

        {/* On state — just a subtle label */}
        {isStreaming && (
          <p class='active-text'>📷 Caméra active — visible ici</p>
        )}
      </div>

      {/* ── Bottom 60% — Controls ── */}
      <div class='controls-zone'>
        <div class='controls-header'>
          <h1>Contrôles du Streaming</h1>
          <p>Section opaque — 60% de l'écran</p>
        </div>

        {error && <div class='error-banner'>⚠️ {error}</div>}

        {isStreaming && (
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
