import { useEffect, useMemo, useRef } from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const DURATION_MS = 2600

// Small canvas particle engine driving all four Telegram-style "send with
// effect" animations from one requestAnimationFrame loop — see
// [[00-overview]] on avoiding external Lottie/image assets: particles are
// drawn as plain rects/circles, or emoji glyphs via fillText (same trick
// used to skip external assets for the animated-emoji feature).
const MessageEffectOverlay = ({ effect, onComplete }) => {
  const canvasRef = useRef(null)
  const theme = useTheme()

  // Read via ref rather than a hook dependency — the caller (a plain
  // container, not memoized with useCallback) creates a new onComplete
  // function every render, and depending on it directly would restart the
  // whole particle simulation on unrelated re-renders (e.g. typing).
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const palette = useMemo(
    () => [theme.palette.primary.main, theme.palette.custom.accent, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    [theme],
  )

  useEffect(() => {
    if (!effect) return undefined

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const width = () => window.innerWidth
    const height = () => window.innerHeight
    const rand = (min, max) => min + Math.random() * (max - min)
    const pickColor = () => palette[Math.floor(Math.random() * palette.length)]

    const resize = () => {
      canvas.width = width() * dpr
      canvas.height = height() * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let particles = []
    let rafId
    let startTime = null
    let lastTimestamp = null
    let lastBurstAt = -Infinity

    const spawnConfetti = (count) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          kind: 'rect',
          x: rand(0, width()),
          y: rand(-40, -10),
          vx: rand(-40, 40),
          vy: rand(90, 200),
          size: rand(6, 11),
          color: pickColor(),
          rotation: rand(0, Math.PI * 2),
          rotationSpeed: rand(-4, 4),
          alpha: 1,
        })
      }
    }

    const spawnFireworkBurst = () => {
      const cx = rand(width() * 0.2, width() * 0.8)
      const cy = rand(height() * 0.15, height() * 0.5)
      const color = pickColor()
      const count = 36
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1)
        const speed = rand(80, 220)
        particles.push({
          kind: 'circle',
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(2, 4),
          color,
          alpha: 1,
          decay: rand(0.55, 0.85),
        })
      }
    }

    const spawnFloating = (count, glyphs) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          kind: 'glyph',
          glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
          x: rand(0, width()),
          y: height() + rand(0, 60),
          vy: rand(-90, -50),
          swayPhase: rand(0, Math.PI * 2),
          swaySpeed: rand(1, 2.2),
          size: rand(22, 34),
          alpha: 1,
        })
      }
    }

    if (effect === 'confetti') spawnConfetti(140)
    if (effect === 'hearts') spawnFloating(28, ['❤️', '💜', '💖'])
    if (effect === 'fire') spawnFloating(24, ['🔥'])

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const dt = Math.min(0.032, (lastTimestamp === null ? 16 : timestamp - lastTimestamp) / 1000)
      lastTimestamp = timestamp

      if (effect === 'fireworks' && elapsed - lastBurstAt > 450 && elapsed < DURATION_MS - 600) {
        spawnFireworkBurst()
        lastBurstAt = elapsed
      }

      ctx.clearRect(0, 0, width(), height())

      particles = particles.filter((p) => {
        p.x += (p.vx ?? 0) * dt
        p.y += p.vy * dt

        if (p.kind === 'rect') {
          p.vy += 220 * dt // gravity
          p.rotation += p.rotationSpeed * dt
          p.alpha = Math.max(0, 1 - elapsed / DURATION_MS)
        } else if (p.kind === 'circle') {
          p.vx *= 0.96
          p.vy = p.vy * 0.96 + 60 * dt
          p.alpha *= p.decay ** dt
        } else if (p.kind === 'glyph') {
          p.swayPhase += p.swaySpeed * dt
          p.x += Math.sin(p.swayPhase) * 18 * dt
          p.alpha = Math.max(0, 1 - elapsed / DURATION_MS)
        }

        if (p.alpha <= 0.02 || p.y > height() + 60 || p.y < -80) return false

        ctx.save()
        ctx.globalAlpha = p.alpha
        if (p.kind === 'rect') {
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else if (p.kind === 'circle') {
          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.kind === 'glyph') {
          ctx.font = `${p.size}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.glyph, p.x, p.y)
        }
        ctx.restore()

        return true
      })

      if (elapsed < DURATION_MS) {
        rafId = requestAnimationFrame(step)
      } else {
        ctx.clearRect(0, 0, width(), height())
      }
    }

    rafId = requestAnimationFrame(step)
    const completeTimer = setTimeout(() => onCompleteRef.current?.(), DURATION_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(completeTimer)
      window.removeEventListener('resize', resize)
    }
  }, [effect, palette])

  if (!effect) return null

  return (
    <Box aria-hidden sx={{ position: 'fixed', inset: 0, zIndex: (t) => t.zIndex.tooltip + 100, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </Box>
  )
}

export default MessageEffectOverlay
