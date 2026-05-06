import { useEffect, useRef } from 'preact/hooks'
import mpegts from 'mpegts.js'

interface FlvPlayerProps {
  url: string
  class?: string
}

export const FlvPlayer = ({ url, class: className }: FlvPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<mpegts.Player | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!mpegts.isSupported()) {
      console.error('mpegts.js is not supported in this browser')
      return
    }

    const player = mpegts.createPlayer(
      {
        type: 'flv',
        isLive: true,
        url: url,
      },
      {
        enableWorker: true,
        enableStashBuffer: false, // Désactiver le buffer interne → latence minimale
        stashInitialSize: 128, // Buffer initial minuscule (128 octets)
        lazyLoad: false,
        lazyLoadMaxDuration: 0,
        liveBufferLatencyChasing: true, // Rattraper automatiquement le direct
        liveBufferLatencyMaxLatency: 1.5, // Max 1.5s de retard avant de sauter
        liveBufferLatencyMinRemain: 0.3, // Garder seulement 0.3s de buffer minimum
      },
    )

    player.attachMediaElement(video)
    player.load()

    // Dès que les premières données arrivent, on lance la lecture
    player.on(mpegts.Events.MEDIA_INFO, () => {
      video.play().catch((e: Error) => console.error('Auto-play blocked:', e))
    })

    // Si la vidéo se met en pause à cause d'un buffer vide, relancer
    video.addEventListener('stalled', () => {
      video.play().catch(() => {})
    })

    playerRef.current = player

    return () => {
      if (playerRef.current) {
        playerRef.current.pause()
        playerRef.current.unload()
        playerRef.current.detachMediaElement()
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [url])

  return (
    <div class={`flv-player-container ${className || ''}`}>
      <video
        ref={videoRef}
        playsInline
        disableRemotePlayback
        muted={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
