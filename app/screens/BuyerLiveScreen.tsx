import { HlsPlayer } from '../components/buyer/HlsPlayer.tsx'

export const BuyerLiveScreen = () => {
  // En production, cette URL viendra du backend
  const streamUrl = 'http://192.168.1.137:8080/live/mystream.m3u8'

  return (
    <div class='buyer-screen'>
      <HlsPlayer url={streamUrl} class='main-video' />

      {/* Overlay UI (Chat, Enchères) */}
      <div class='buyer-overlay'>
        <div class='top-bar'>
          <div class='live-indicator'>LIVE</div>
          <div class='viewer-count'>👁️ 124</div>
        </div>

        <div class='chat-container'>
          <p>
            <strong>User123:</strong> Magnifique ! 🔥
          </p>
          <p>
            <strong>BuyerX:</strong> Combien pour le sac ?
          </p>
        </div>

        <div class='action-buttons'>
          <button type='button' class='btn-bid'>Enchérir - 50€</button>
        </div>
      </div>
    </div>
  )
}
