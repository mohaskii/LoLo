import { useEffect, useRef } from 'preact/hooks'
import Hls from 'hls.js'

interface HlsPlayerProps {
  url: string
  class?: string
}

export const HlsPlayer = ({ url, class: className }: HlsPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.error('Auto-play blocked:', e))
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support (Safari/iOS)
      video.src = url
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
  }, [url])

  return (
    <div class={`hls-player-container ${className || ''}`}>
      <video
        ref={videoRef}
        controls
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
