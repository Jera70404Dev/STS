import { useEffect, useRef } from 'react'

interface BeamsBackgroundProps {
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
}

interface Beam {
  x: number
  y: number
  width: number
  length: number
  angle: number
  speed: number
  opacity: number
  hue: number
  pulse: number
  pulseSpeed: number
}

const MINIMUM_BEAMS = 10
const SCALE = 4
const MAX_DPR = 1.5
const TARGET_FPS = 30
const FRAME_MS = 1000 / TARGET_FPS

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

export function BeamsBackground({
  className,
  intensity = 'subtle',
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beamsRef = useRef<Beam[]>([])
  const animationFrameRef = useRef<number>(0)

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const offCanvas = document.createElement('canvas')
    const offCtx = offCanvas.getContext('2d')
    if (!offCtx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = window.innerWidth
    let height = window.innerHeight

    const updateCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      offCanvas.width = Math.max(1, Math.round(width / SCALE))
      offCanvas.height = Math.max(1, Math.round(height / SCALE))
      offCtx.setTransform(1 / SCALE, 0, 0, 1 / SCALE, 0, 0)

      const totalBeams = Math.round(MINIMUM_BEAMS * 1.5)
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(width, height)
      )
    }

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      const column = index % 3
      const spacing = width / 3

      beam.y = height + 100
      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 100
      beam.speed = 0.5 + Math.random() * 0.4
      beam.hue = 190 + (index * 70) / totalBeams
      beam.opacity = 0.2 + Math.random() * 0.1
      return beam
    }

    function drawBeam(c: CanvasRenderingContext2D, beam: Beam) {
      c.save()
      c.translate(beam.x, beam.y)
      c.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity =
        beam.opacity *
        (0.8 + Math.sin(beam.pulse) * 0.2) *
        opacityMap[intensity]

      const gradient = c.createLinearGradient(0, 0, 0, beam.length)

      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`)
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`)
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`)

      c.fillStyle = gradient
      c.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      c.restore()
    }

    function renderFrame() {
      if (!canvas || !ctx || !offCtx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height)

      const totalBeams = beamsRef.current.length
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams)
        }

        drawBeam(offCtx, beam)
      })

      ctx.drawImage(
        offCanvas,
        0,
        0,
        offCanvas.width,
        offCanvas.height,
        0,
        0,
        width,
        height
      )
    }

    let lastRender = 0

    function tick(now: number) {
      if (document.hidden) {
        animationFrameRef.current = 0
        return
      }
      animationFrameRef.current = requestAnimationFrame(tick)
      if (now - lastRender < FRAME_MS) return
      lastRender = now
      renderFrame()
    }

    const startLoop = () => {
      if (animationFrameRef.current) return
      lastRender = 0
      animationFrameRef.current = requestAnimationFrame(tick)
    }

    const onVisibilityChange = () => {
      if (!document.hidden && !reducedMotion.matches) {
        startLoop()
      }
    }

    updateCanvasSize()

    if (reducedMotion.matches) {
      renderFrame()
    } else {
      startLoop()
      window.addEventListener('visibilitychange', onVisibilityChange)
    }

    const onResize = () => {
      updateCanvasSize()
      if (reducedMotion.matches) {
        renderFrame()
      } else {
        startLoop()
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('visibilitychange', onVisibilityChange)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = 0
      }
    }
  }, [intensity])

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden bg-ink-950 ${className ?? ''}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ filter: 'blur(6px)' }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,rgba(11,11,15,0.45)_100%)]" />
    </div>
  )
}
