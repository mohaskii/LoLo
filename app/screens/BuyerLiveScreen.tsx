import { FlvPlayer } from '../components/buyer/FlvPlayer.tsx'

export const BuyerLiveScreen = () => {
  // HTTP-FLV pour une latence minimale (~1s vs ~10s avec HLS)
  const streamUrl = 'http://192.168.1.137:8080/live/mystream.flv'

  return (
    <div class='buyer-screen'>
      <FlvPlayer url={streamUrl} class='main-video' />

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


      </div>
    </div>
  )
}
