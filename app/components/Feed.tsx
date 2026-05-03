import { useSignal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import gsap from 'gsap'
import { mockLivestreams, Livestream } from '../data.ts'
import { FeedItem } from './FeedItem.tsx'

const DISTANCE_THRESHOLD_RATIO = 0.4 // 25% of viewport height
const VELOCITY_THRESHOLD = 0.1 // px/ms — fast flick threshold
const DEAD_ZONE = 5 // px — ignore micro-movements
const EDGE_RESISTANCE = 0.3 // elastic pull at boundaries
const VELOCITY_SMOOTHING = 0.2 // lerp factor for velocity

export const Feed = ({ onStreamClick }: { onStreamClick: (stream: Livestream) => void }) => {
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
      const timeDelta = e.timeStamp - startTime
      if (Math.abs(totalDelta) > distanceThreshold) {
        // Dragged far enough
        targetIndex += totalDelta < 0 ? 1 : -1
      } else if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
        // Fast flick even if short distance
        targetIndex += velocity < 0 ? 1 : -1
      } else if (Math.abs(totalDelta) < DEAD_ZONE && timeDelta < 300) {
        // It's a tap!
        onStreamClick(mockLivestreams[currentIndex.value])
        return // skip snapTo
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
