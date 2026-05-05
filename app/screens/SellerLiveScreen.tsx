import { useState } from 'preact/hooks'
import CameraStream from '../plugins/camera-stream.ts'

export const SellerLiveScreen = () => {
  const [isStreaming, setIsStreaming] = useState(false)

  const toggleStream = async () => {
    if (isStreaming) {
      await CameraStream.stopCamera()
      setIsStreaming(false)
    } else {
      // En production, l'URL et la clé viendraient du backend
      const _rtmpUrl = 'rtmp://localhost:1935/live'
      const _streamKey = 'mystream'

      // On commence par afficher la caméra en 40% (mode prévisualisation)
      await CameraStream.startCamera({ mode: '40percent' })

      // TODO: Appeler l'encodage RTMP natif via le plugin
      // await CameraStream.startStream({ url: rtmpUrl, key: streamKey })

      setIsStreaming(true)
    }
  }

  return (
    <div class={`poc-container ${isStreaming ? 'fullscreen-mode' : ''}`}>
      {/* Zone Caméra (Transparente) */}
      <div class={`camera-zone ${isStreaming ? 'on' : 'off'}`}>
        {isStreaming && (
          <div class='live-badge'>
            <span class='live-dot' />
            <span>EN DIRECT</span>
          </div>
        )}
        {!isStreaming && (
          <div class='camera-placeholder'>
            <span>📷</span>
            <p>Prêt à streamer ?</p>
          </div>
        )}
      </div>

      {/* Zone Contrôles (Opaque) */}
      <div class='controls-zone'>
        <div class='seller-header'>
          <h2>Tableau de Bord Vendeur</h2>
          <p>Gérez vos enchères et interagissez avec vos acheteurs.</p>
        </div>

        <div class='seller-stats'>
          <div class='stat-card'>
            <span class='stat-label'>Vues</span>
            <span class='stat-value'>0</span>
          </div>
          <div class='stat-card'>
            <span class='stat-label'>Enchères</span>
            <span class='stat-value'>0€</span>
          </div>
        </div>

        <button
          type='button'
          class={`btn ${isStreaming ? 'btn-stop' : 'btn-start'}`}
          onClick={toggleStream}
        >
          {isStreaming ? 'Arrêter le Live' : 'Démarrer le Live'}
        </button>
      </div>
    </div>
  )
}
