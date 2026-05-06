import { useState } from 'preact/hooks'
import CameraStream from '../plugins/camera-stream.ts'

export const CameraPoCPage = () => {
  const [streamMode, setStreamMode] = useState<
    'none' | '40percent' | 'fullscreen'
  >('none')
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
    <div
      class={`poc-container ${
        streamMode === 'fullscreen' ? 'fullscreen-mode' : ''
      }`}
    >
      <style>
        {`
/* ── CameraStream PoC — Minimal CSS ──
   Every layer MUST be transparent so the native SurfaceView
   behind the WebView can show through the top 40%.
*/

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* CRITICAL: html + body + #app all transparent */
html, body {
    background-color: transparent !important;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
    -webkit-tap-highlight-color: transparent;
}

#app {
    background-color: transparent !important;
    width: 100%;
    height: 100%;
    position: relative;
}

/* ── Layout ── */

.poc-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
}

/* Top 40% — transparent to let native camera through */
.camera-zone {
    height: 40vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.camera-zone.off {
    background-color: rgba(0, 0, 0, 0.9);
}

.camera-zone.on {
    background-color: transparent;
}

.controls-zone {
    height: 60vh;
    background-color: #111;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 20px;
}

/* ── Fullscreen mode overrides ── */
.poc-container.fullscreen-mode .camera-zone {
    height: 100vh;
}

.poc-container.fullscreen-mode .controls-zone {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    max-height: 50vh;
    background-color: rgba(17, 17, 17, 0.6);
    backdrop-filter: blur(10px);
    z-index: 20;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
}

/* ── Buttons ── */

.btn {
    border: none;
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.1s ease, opacity 0.2s ease;
    width: 100%;
}

.btn:active {
    transform: scale(0.97);
}

.btn-start {
    background-color: #22c55e;
    color: #000;
}

.btn-start.fullscreen {
    background-color: #a855f7;
    color: #fff;
}

.btn-stop {
    background-color: #ef4444;
    color: #fff;
}

.button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    width: 100%;
}

/* ── Status indicators ── */

.live-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    padding: 6px 14px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
}

.live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ef4444;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.camera-icon-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin-bottom: 16px;
    background: rgba(255, 255, 255, 0.05);
}

.zone-label {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 20px;
}

.active-text {
    font-size: 16px;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

/* ── Controls zone content ── */

.controls-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.controls-header h1 {
    font-size: 18px;
    font-weight: 700;
}

.controls-header p {
    font-size: 12px;
    opacity: 0.5;
    margin-top: 4px;
}

.error-banner {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 16px;
}

.status-log {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 14px;
    margin-top: 16px;
    font-size: 12px;
    font-family: monospace;
    max-height: 200px;
    overflow-y: auto;
}

.status-log p {
    margin-bottom: 4px;
    opacity: 0.7;
}

.status-log p:last-child {
    opacity: 1;
    color: #22c55e;
}
        `}
      </style>
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
              <button
                class='btn btn-start'
                onClick={() => startStream('40percent')}
              >
                ▶ Mode 40%
              </button>
              <button
                class='btn btn-start fullscreen'
                onClick={() => startStream('fullscreen')}
              >
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
              {streamMode === 'fullscreen'
                ? (
                  <button
                    class='btn btn-start'
                    onClick={() => startStream('40percent')}
                  >
                    ⬇️ Réduire à 40%
                  </button>
                )
                : (
                  <button
                    class='btn btn-start fullscreen'
                    onClick={() => startStream('fullscreen')}
                  >
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
          {logs.map((log, i) => <p key={i}>{log}</p>)}
        </div>
      </div>
    </div>
  )
}
