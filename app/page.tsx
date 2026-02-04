'use client'

import { useEffect, useMemo, useState } from 'react'

type Pos = { x: number; y: number }
type Mode = 'hearts' | 'petals'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length]
}

export default function Page() {
  const [noPos, setNoPos] = useState<Pos>({ x: 0, y: 0 })
  const [msgIndex, setMsgIndex] = useState(0)
  const [saidYes, setSaidYes] = useState(false)

  const [mode, setMode] = useState<Mode>('hearts')
  const [celebrate, setCelebrate] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)

  const [floaters] = useState(() =>
    Array.from({ length: 44 }).map((_, i) => ({
      id: i,
      x: `${Math.floor(Math.random() * 100)}%`,
      s: `${Math.floor(Math.random() * 22) + 12}px`,
      t: `${Math.random() * 7 + 7}s`,
      d: `${Math.random() * 7}s`,
      o: `${Math.random() * 0.35 + 0.14}`,
      sway: `${Math.floor(Math.random() * 26) - 13}px`,
    }))
  )

  const messages = useMemo(
    () => [
      'Veux tu être ma valentine',
      'Promis je partage les frites.',
      'On se fait une soirée douce ?',
      'Je crois que mon cœur a déjà choisi…',
      'Dernière chance… (je rougis là)',
    ],
    []
  )

  useEffect(() => {
    setNoPos({ x: 140, y: 26 })
  }, [])

  function moveNo() {
    const x = Math.floor(Math.random() * 260) - 130
    const y = Math.floor(Math.random() * 170) - 85
    setNoPos({ x, y })
    setMsgIndex((i) => (i + 1) % messages.length)
  }

  function onYes() {
    setSaidYes(true)
    setEnvelopeOpen(false)
    setCelebrate(true)
    setBurstKey((k) => k + 1)
    window.setTimeout(() => setCelebrate(false), 5200)
  }

  const safeDx = `${clamp(noPos.x, -160, 160)}px`
  const safeDy = `${clamp(noPos.y, -110, 110)}px`

  const hearts = ['❤️', '💕', '💖', '💗', '💓']
  const petals = ['🌸', '🌷', '🍃']
  const emoji = (i: number) => (mode === 'hearts' ? pick(hearts, i) : pick(petals, i))

  return (
    <main className="bg">
      <div className="glow" />

      <div className="topBar">
        <div className="pill">
          <span className="pillLabel">Ambiance</span>
          <button
            className={`pillBtn ${mode === 'hearts' ? 'active' : ''}`}
            onClick={() => setMode('hearts')}
            type="button"
          >
            Cœurs
          </button>
          <button
            className={`pillBtn ${mode === 'petals' ? 'active' : ''}`}
            onClick={() => setMode('petals')}
            type="button"
          >
            Pétales
          </button>
        </div>
      </div>

      {floaters.map((h) => (
        <div
          key={h.id}
          className={`floater ${mode === 'petals' ? 'petal' : 'heart'}`}
          style={
            {
              '--x': h.x,
              '--s': h.s,
              '--t': h.t,
              '--d': h.d,
              '--o': h.o,
              '--sx': h.sway,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {emoji(h.id)}
        </div>
      ))}

      {celebrate &&
        Array.from({ length: 70 }).map((_, i) => {
          const bx = `${Math.floor(Math.random() * 100)}%`
          const bs = `${Math.floor(Math.random() * 18) + 14}px`
          const bt = `${Math.random() * 2.2 + 2.0}s`
          const bd = `${Math.random() * 1.5}s`
          return (
            <div
              key={`${burstKey}-${i}`}
              className="burst"
              style={
                {
                  '--bx': bx,
                  '--bs': bs,
                  '--bt': bt,
                  '--bd': bd,
                } as React.CSSProperties
              }
              aria-hidden="true"
            >
              {emoji(i)}
            </div>
          )
        })}

      <div className="card">
        <h1 className="title fancy">Madame Léa Gonzalez,</h1>

        {!saidYes && <p className="subtitle">{messages[msgIndex]}</p>}

        {saidYes && (
          <div className="yesView">
            <div className="bouquetWrap">
              <div className="sparkle s1" aria-hidden="true">✨</div>
              <div className="sparkle s2" aria-hidden="true">✨</div>
              <div className="sparkle s3" aria-hidden="true">✨</div>
              <div className="bouquet" aria-label="Bouquet de fleurs">💐</div>
            </div>

            <div className="romanticLine">Je savais que tu dirais oui.</div>

            <div className="envelopeSection">
              <button
                className={`envelope2 ${envelopeOpen ? 'open' : ''}`}
                onClick={() => setEnvelopeOpen((v) => !v)}
                type="button"
                aria-label="Ouvrir la lettre"
              >
                <span className="envBase" aria-hidden="true" />
                <span className="envMask" aria-hidden="true" />

                <span className="letterClip2" aria-hidden="true">
                  <span className="letter2">
                    <span className="letterInner">
                      <span className="lTitle">Une petite lettre…</span>
                      <span className="lText">Je voulais juste te dire que tu es incroyable.</span>
                      <span className="lText">Et j’aimerais passer la Saint Valentin avec toi.</span>
                      <span className="lSign">— Ton Valentin</span>
                    </span>
                  </span>
                </span>

                <span className="envFlap2" aria-hidden="true" />
              </button>

              <div className="envelopeHint">Clique sur l’enveloppe pour ouvrir la lettre.</div>
            </div>
          </div>
        )}

        {!saidYes && (
          <>
            <div className="actionsWrap">
              <button className="btn yes" onClick={onYes} type="button">
                Oui ❤️
              </button>

              <button
                className="btn no"
                onMouseEnter={moveNo}
                onClick={moveNo}
                type="button"
                style={
                  {
                    '--dx': safeDx,
                    '--dy': safeDy,
                  } as React.CSSProperties
                }
                aria-label="Non"
              >
                Non
              </button>
            </div>

            <p className="hint">Astuce : le bouton “Non” est timide…</p>
          </>
        )}
      </div>
    </main>
  )
}
