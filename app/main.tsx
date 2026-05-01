import { render } from 'preact'
import { useSignal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import {
  Bell,
  Heart,
  Home,
  LucideIcon,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Share2,
  User,
  VolumeX,
} from 'lucide-preact'
import gsap from 'gsap'
import { Livestream, mockLivestreams } from './data.ts'

const TabItem = ({ icon: Icon, label, active = false }: {
  icon: LucideIcon
  label: string
  active?: boolean
}) => {
  return (
    <div
      class={`flex text-xs flex-col items-center w-16 ${
        active && 'text-primary '
      }`}
    >
      <Icon strokeWidth={4} />
      <span class='mt-1 text-[10px]'>{label}</span>
    </div>
  )
}

const TopBar = () => {
  return (
    <div>
      <div class='flex justify-between items-center px-4 py-3  '>
        <div class='flex space-x-6 relative'>
          <div class='relative'>
            <span class='text-xl font-bold opacity-70'>Suivie</span>
          </div>
          <div class='relative'>
            <span class='text-xl font-bold '>Pour Toi</span>
            <div class='absolute bottom-0 left-0 right-0 h-0.5 bg-base-content' />
          </div>
        </div>
        <Bell strokeWidth={4} class='w-6 h-6 ' />
      </div>
      <div class='flex overflow-x-auto scrollbar-hide px-4 py-2 space-x-3'>
        <div class='bg-primary text-primary-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Tout
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Vêtements
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Électronique
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs    text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Maison & Jardin
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Véhicules
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Livres & Médias
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Services
        </div>
      </div>
    </div>
  )
}
const BotomNavBAr = () => {
  return (
    <div class='flex justify-around items-center bg-base-100 py-2 '>
      <TabItem icon={Home} active label='Accueil' />
      <TabItem icon={Search} label='Rechercher' />
      <TabItem icon={Plus} label='Vendre' />
      <TabItem icon={MessageSquare} label='Messages' />
      <TabItem icon={User} label='Profil' />
    </div>
  )
}

const FeedItem = (
  { stream, isActive }: { stream: Livestream; isActive: boolean },
) => {
  return (
    <div class='h-full w-full relative bg-black'>
      {/* Background Image / Video Mock */}
      <img
        src={stream.thumbnail.fullSizeImage || stream.thumbnail.biggerImage}
        class='absolute inset-0 w-full h-full object-cover opacity-90'
        alt={stream.title}
      />

      {/* Right Side Actions */}
      <div class='absolute right-4 bottom-10 flex flex-col items-center space-y-5'>
        <div class=' '>
          <div class='w-12 h-12 rounded-full ring-primary  ring-5 '>
            <img
              src={stream.user.profileImage.url}
              class='w-full h-full rounded-full '
            />
          </div>
          <div class='flex flex-col items-center'>
            <div class=' bottom-2.5 bg-error  text-[9px] font-bold px-1.5 py-0.5 rounded '>
              LIVE
            </div>
            <span class=' bottom-2.5 text-[10px]' >{stream.activeViewers}</span>
          </div>
        </div>

        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <Share2 class='w-6 h-6' />
          </div>
        </button>
        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <VolumeX class='w-6 h-6' />
          </div>
        </button>
        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <MoreVertical class='w-6 h-6' />
          </div>
        </button>
      </div>

      {/* Bottom Info */}
      <div class='absolute left-4 bottom-10 right-20 '>
        <div class='flex items-center space-x-2 mb-2'>
          <h2 class='font-bold text-lg drop-shadow-md'>
            {stream.user.username}
          </h2>
          <button class='bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center border border-white/20'>
            <Heart class='w-3 h-3 mr-1' /> Follow
          </button>
        </div>
        <p class='text-sm line-clamp-2 mb-3 drop-shadow-md opacity-90'>
          {stream.title}
        </p>
        <div class='flex flex-wrap gap-2'>
          <span class='bg-black/40 backdrop-blur-md text-xs px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 font-medium'>
            <span class='w-2 h-2 rounded-sm bg-purple-500'></span> Just Chatting
          </span>
          {stream.livestreamCategories.map((cat: any) => (
            <span
              key={cat.id}
              class='bg-black/40 backdrop-blur-md text-xs px-2 py-1 rounded-md border border-white/10 font-medium'
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TikTok-style spring feed ────────────────────────────────────────────────

const DISTANCE_THRESHOLD_RATIO = 0.4 // 25% of viewport height
const VELOCITY_THRESHOLD = 0.1 // px/ms — fast flick threshold
const DEAD_ZONE = 5 // px — ignore micro-movements
const EDGE_RESISTANCE = 0.3 // elastic pull at boundaries
const VELOCITY_SMOOTHING = 0.2 // lerp factor for velocity

const Feed = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const currentIndex = useSignal(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const container = containerRef.current
    if (!wrapper || !container) return

    // ── state ──
    let isDragging = false
    let isAnimating = false
    let startY = 0
    let startTime = 0
    let previousY = 0
    let previousTime = 0
    let velocity = 0
    let currentTranslateY = 0 // current pixel offset of the container
    let baseTranslateY = 0 // offset when drag started

    const total = mockLivestreams.length

    const getViewportHeight = () => wrapper.clientHeight

    /** Apply translateY via gsap.set — keeps GSAP's internal y cache in sync */
    const setTranslateY = (y: number) => {
      currentTranslateY = y
      gsap.set(container, { y })
    }

    /** Snap to a specific index with spring physics */
    const snapTo = (index: number, releaseVelocity = 0) => {
      isAnimating = true
      currentIndex.value = index
      const targetY = -index * getViewportHeight()

      // Scale duration by how far we need to travel — feels more natural
      const distance = Math.abs(targetY - currentTranslateY)
      const vH = getViewportHeight()

      // Always animate even for tiny snap-backs (min 0.3s)
      const baseDuration = distance < 1
        ? 0
        : Math.max(0.3, Math.min(0.55, distance / vH * 0.55))

      // If already at target, skip
      if (baseDuration === 0) {
        currentTranslateY = targetY
        gsap.set(container, { y: targetY })
        isAnimating = false
        return
      }

      // Use velocity to pick between snappy and springy ease
      const absVel = Math.abs(releaseVelocity)
      const ease = absVel > VELOCITY_THRESHOLD
        ? 'power3.out' // fast flick → snappy decel
        : 'back.out(0.8)' // slow drag → slight overshoot spring

      gsap.to(container, {
        y: targetY,
        duration: baseDuration,
        ease,
        overwrite: true, // kill any stale tweens on this element
        onUpdate: () => {
          currentTranslateY = gsap.getProperty(container, 'y') as number
        },
        onComplete: () => {
          currentTranslateY = targetY
          isAnimating = false
        },
      })
    }

    // ── Pointer Events (using setPointerCapture for reliable tracking) ──

    const onPointerDown = (e: PointerEvent) => {
      if (isAnimating) {
        // Cancel in-flight animation and start dragging from where we are
        gsap.killTweensOf(container)
        isAnimating = false
      }

      wrapper.setPointerCapture(e.pointerId)
      isDragging = true

      startY = e.clientY
      startTime = e.timeStamp
      previousY = e.clientY
      previousTime = e.timeStamp
      velocity = 0
      baseTranslateY = currentTranslateY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !wrapper.hasPointerCapture(e.pointerId)) return

      const deltaY = e.clientY - startY

      // Dead zone — ignore micro jitter
      if (Math.abs(deltaY) < DEAD_ZONE) return

      // ── Velocity smoothing (lerp) ──
      const dt = e.timeStamp - previousTime
      if (dt > 0) {
        const instantVelocity = (e.clientY - previousY) / dt // px/ms
        velocity = velocity * (1 - VELOCITY_SMOOTHING) +
          instantVelocity * VELOCITY_SMOOTHING
      }
      previousY = e.clientY
      previousTime = e.timeStamp

      // ── Compute drag position with edge resistance ──
      let newY = baseTranslateY + deltaY
      const vH = getViewportHeight()
      const minY = -(total - 1) * vH // bottom boundary
      const maxY = 0 // top boundary

      if (newY > maxY) {
        // Pulling past top — elastic resistance
        const overscroll = newY - maxY
        newY = maxY + overscroll * EDGE_RESISTANCE
      } else if (newY < minY) {
        // Pulling past bottom — elastic resistance
        const overscroll = minY - newY
        newY = minY - overscroll * EDGE_RESISTANCE
      }

      setTranslateY(newY)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false

      if (wrapper.hasPointerCapture(e.pointerId)) {
        wrapper.releasePointerCapture(e.pointerId)
      }

      const totalDelta = e.clientY - startY
      const vH = getViewportHeight()
      const distanceThreshold = vH * DISTANCE_THRESHOLD_RATIO

      let targetIndex = currentIndex.value

      // ── Decision: distance OR velocity ──
      if (Math.abs(totalDelta) > distanceThreshold) {
        // Dragged far enough
        targetIndex += totalDelta < 0 ? 1 : -1
      } else if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        // Fast flick even if short distance
        targetIndex += velocity < 0 ? 1 : -1
      }
      // else → snap back to current

      // Clamp to valid range
      targetIndex = Math.max(0, Math.min(total - 1, targetIndex))

      snapTo(targetIndex, velocity)
    }

    const onPointerCancel = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      if (wrapper.hasPointerCapture(e.pointerId)) {
        wrapper.releasePointerCapture(e.pointerId)
      }
      // Snap back to current on cancel
      snapTo(currentIndex.value)
    }

    // ── Mouse wheel support (for desktop) ──
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimating) return

      // Debounce wheel events to act as discrete page flips
      if (wheelTimeout) return
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null
      }, 500)

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = Math.max(
        0,
        Math.min(total - 1, currentIndex.value + direction),
      )
      if (nextIndex !== currentIndex.value) {
        snapTo(nextIndex, direction * 0.8)
      }
    }

    // ── Bind events ──
    wrapper.addEventListener('pointerdown', onPointerDown)
    wrapper.addEventListener('pointermove', onPointerMove)
    wrapper.addEventListener('pointerup', onPointerUp)
    wrapper.addEventListener('pointercancel', onPointerCancel)
    wrapper.addEventListener('wheel', onWheel, { passive: false })

    // Prevent context menu on long press
    wrapper.addEventListener('contextmenu', (e) => e.preventDefault())

    return () => {
      wrapper.removeEventListener('pointerdown', onPointerDown)
      wrapper.removeEventListener('pointermove', onPointerMove)
      wrapper.removeEventListener('pointerup', onPointerUp)
      wrapper.removeEventListener('pointercancel', onPointerCancel)
      wrapper.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      class='h-full w-full overflow-hidden relative bg-black touch-none select-none'
      style={{ overscrollBehavior: 'none' }}
    >
      <div
        ref={containerRef}
        class='h-full w-full will-change-transform'
      >
        {mockLivestreams.map((stream, idx) => (
          <FeedItem
            key={stream.id}
            stream={stream}
            isActive={idx === currentIndex.value}
          />
        ))}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div class='h-full w-full flex flex-col'>
      <div class='flex-1 relative'>
        <Feed />
        <div class='absolute top-0 left-0 right-0 z-10'>
          <TopBar />
        </div>
      </div>
      <BotomNavBAr />
    </div>
  )
}

const root = document.getElementById('app')
if (!root) throw Error('unable to find root element #app')
render(<App />, root)
