'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Pos = { x: number; y: number }
type Stage = 'question' | 'quiz' | 'result'

type Particle = {
  id: number
  x: string
  size: string
  dur: string
  delay: string
  opacity: string
  drift: string
}

type Bokeh = {
  id: number
  x: string
  y: string
  size: string
  dur: string
  delay: string
  opacity: string
}

type QuizQ = {
  id: number
  label: string
  prompt: string
  answers: { label: string; correct: boolean }[]
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length]
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}
function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: `${Math.floor(Math.random() * 100)}%`,
    size: `${Math.floor(rand(12, 34))}px`,
    dur: `${rand(7, 14).toFixed(2)}s`,
    delay: `${rand(0, 7).toFixed(2)}s`,
    opacity: `${rand(0.12, 0.42).toFixed(2)}`,
    drift: `${Math.floor(rand(-16, 16))}px`,
  }))
}
function makeBokeh(count: number): Bokeh[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: `${Math.floor(Math.random() * 100)}%`,
    y: `${Math.floor(Math.random() * 100)}%`,
    size: `${Math.floor(rand(60, 220))}px`,
    dur: `${rand(10, 22).toFixed(2)}s`,
    delay: `${rand(0, 6).toFixed(2)}s`,
    opacity: `${rand(0.06, 0.18).toFixed(2)}`,
  }))
}
function isReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Page() {
  const themeClass = 'themeNight'
  const hearts = ['❤️', '💕', '💖', '💗', '💓']
  const heartEmoji = (i: number) => pick(hearts, i)

  const [noPos, setNoPos] = useState<Pos>({ x: 0, y: 0 })
  const [msgIndex, setMsgIndex] = useState(0)

  const [stage, setStage] = useState<Stage>('question')
  const [celebrate, setCelebrate] = useState(false)
  const [burstKey, setBurstKey] = useState(0)

  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [sealOff, setSealOff] = useState(false)

  const quiz = useMemo<QuizQ[]>(
    () => [
      {
        id: 1,
        label: 'test 1',
        prompt: "Quand est-ce qu'on a commencé a parler?",
        answers: [
          { label: '21 Avril 2021', correct: true },
          { label: '21 Janvier 2021', correct: false },
          { label: '23 Avril 2021', correct: false },
        ],
      },
      {
        id: 2,
        label: 'test 2',
        prompt: "Ou est-ce qu'on a eu notre premier date ?",
        answers: [
          { label: 'Jardin Japonais', correct: false },
          { label: 'Jardin des Plantes', correct: true },
          { label: 'Sur Mars', correct: false },
        ],
      },
      {
        id: 3,
        label: 'test 3',
        prompt: 'Qui a envoyé le premier message ?',
        answers: [
          { label: 'Moi', correct: false },
          { label: 'Toi', correct: true },
          { label: 'On sait plus (mais je dirais toi)', correct: false },
        ],
      },
      {
        id: 4,
        label: 'test 4',
        prompt: 'Où a eu lieu notre premier bisou ?',
        answers: [
          { label: 'Neptune', correct: false },
          { label: 'Capitole', correct: false },
          { label: 'Jardin Des Plantes', correct: true },
        ],
      },
      {
        id: 5,
        label: 'test 5',
        prompt: 'Quel a était notre tout premier voyage ensemble ?',
        answers: [
          { label: 'Espagne', correct: false },
          { label: 'Camping avec Parents', correct: false },
          { label: 'Camping avec Amis', correct: true },
        ],
      },
      {
        id: 6,
        label: 'test 6',
        prompt: 'Qui est le plus intelligent de nous deux ?',
        answers: [
          { label: 'Toi', correct: false },
          { label: 'Moi', correct: true },
          { label: 'Moustache', correct: false },
        ],
      },
    ],
    []
  )

  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const timers = useRef<number[]>([])
  const particles = useMemo(() => makeParticles(46), [])
  const bokeh = useMemo(() => makeBokeh(26), [])
  const stars = useMemo(() => makeParticles(46), [])

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
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [])

  function setTimer(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  function moveNo() {
    const x = Math.floor(Math.random() * 260) - 130
    const y = Math.floor(Math.random() * 170) - 85
    setNoPos({ x, y })
    setMsgIndex((i) => (i + 1) % messages.length)
  }

  function startQuiz() {
    setStage('quiz')
    setQIndex(0)
    setScore(0)
    setPicked(null)
    setLocked(false)
    setEnvelopeOpen(false)
    setSealOff(false)
  }

  function onYes() {
    if (!isReducedMotion()) {
      setCelebrate(true)
      setBurstKey((k) => k + 1)
      setTimer(() => setCelebrate(false), 1400)
    }
    startQuiz()
  }

  function selectAnswer(ansIndex: number) {
    if (locked) return
    setPicked(ansIndex)
    setLocked(true)

    const q = quiz[qIndex]
    const isCorrect = q.answers[ansIndex]?.correct === true
    if (isCorrect) setScore((s) => s + 1)

    setTimer(() => {
      const isLast = qIndex === quiz.length - 1
      if (isLast) {
        setStage('result')
        return
      }
      setQIndex((i) => i + 1)
      setPicked(null)
      setLocked(false)
    }, isReducedMotion() ? 150 : 650)
  }

  function resultText(s: number) {
    if (s == 6) return 'Tu as gagné un joker pour une sortie au resto et un bouquet de fleurs.'
    if (s >= 4) return 'Tu as gagné un joker pour une sortie au resto et un bouquet de fleurs.'
    if (s >= 2) return 'Pas mal… je sens qu’on peut encore s’améliorer (avec un date).'
    return 'Ouch… on recommence ? (promis je triche pas).'
  }

  const safeDx = `${clamp(noPos.x, -160, 160)}px`
  const safeDy = `${clamp(noPos.y, -110, 110)}px`
  const q = quiz[qIndex]
  const showEnvelope = stage === 'result' && score >= 3

  return (
    <main className={`bg ${themeClass}`}>
      <div className="grain" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      {bokeh.map((b) => (
        <div
          key={b.id}
          className="bokeh"
          style={
            {
              '--bx': b.x,
              '--by': b.y,
              '--bs': b.size,
              '--bt': b.dur,
              '--bd': b.delay,
              '--bo': b.opacity,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={
            {
              '--x': s.x,
              '--s': '2px',
              '--t': s.dur,
              '--d': s.delay,
              '--o': s.opacity,
              '--sx': s.drift,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      ))}

      {particles.map((p) => (
        <div
          key={p.id}
          className="floater heart"
          style={
            {
              '--x': p.x,
              '--s': p.size,
              '--t': p.dur,
              '--d': p.delay,
              '--o': p.opacity,
              '--sx': p.drift,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {heartEmoji(p.id)}
        </div>
      ))}

      {celebrate &&
        Array.from({ length: 74 }).map((_, i) => {
          const bx = `${Math.floor(Math.random() * 100)}%`
          const bs = `${Math.floor(rand(14, 28))}px`
          const bt = `${rand(2.0, 3.0).toFixed(2)}s`
          const bd = `${rand(0, 1.6).toFixed(2)}s`
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
              {heartEmoji(i)}
            </div>
          )
        })}

      <div className={`card ${stage !== 'question' ? 'cardYes' : ''}`}>
        <h1 className="title fancy">Madame Léa Gonzalez,</h1>

        {stage === 'question' && (
          <>
            <p className="subtitle">{messages[msgIndex]}</p>

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

        {stage === 'quiz' && (
          <div className="quiz">
            <div className="quizTop">
              <div className="quizTag">{q.label}</div>
              <div className="quizProgress">
                Question {qIndex + 1} / {quiz.length}
              </div>
            </div>

            <div className="quizPrompt">{q.prompt}</div>

            <div className="quizAnswers">
              {q.answers.map((a, i) => {
                const isPicked = picked === i
                const showState = locked && picked !== null
                const good = showState && a.correct
                const bad = showState && isPicked && !a.correct
                return (
                  <button
                    key={i}
                    type="button"
                    className={`quizBtn ${good ? 'good' : ''} ${bad ? 'bad' : ''}`}
                    onClick={() => selectAnswer(i)}
                    disabled={locked}
                    aria-disabled={locked ? 'true' : 'false'}
                  >
                    {a.label}
                  </button>
                )
              })}
            </div>

            <div className="quizFoot" aria-live="polite">
              Score: {score} / {quiz.length}
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="result">
            <div className="resultScore">
              Score final: <span className="resultN">{score}</span> / {quiz.length}
            </div>

            <div className="resultText">{resultText(score)}</div>

            {showEnvelope && (
              <div className="envelopeSection">
                <button
                  className={`envelope2 ${envelopeOpen ? 'open' : ''} ${sealOff ? 'sealOff' : ''}`}
                  onClick={() => {
                    if (isReducedMotion()) {
                      setEnvelopeOpen((v) => !v)
                      return
                    }
                    setSealOff(true)
                    setTimer(() => setEnvelopeOpen((v) => !v), 220)
                  }}
                  type="button"
                  aria-label="Ouvrir la lettre"
                >
                  <span className="envBase" aria-hidden="true" />
                  <span className="envMask" aria-hidden="true" />

                  <span className="letterClip2" aria-hidden="true">
                    <span className="letter2">
                      <span className="letterInner">
                       <span className="lTitle">Une petite lettre…</span>
<span className="lText">Si tu lis ça, c’est que t’es importante pour moi.</span>
<span className="lText">Depuis le début, je me surprends à aimer encore plus nos instants, même les plus simples.</span>
<span className="lText">Je te choisis aujourdhui, et j’aimerais être ton Valentin, aujourd’hui et pour nos prochains chapitres.</span>
<span className="lText">Tu me rends très heureux Léa.</span>
  <span className="lSign">— Ton Valentin</span>
</span>
                    </span>
                  </span>

                  <span className="envSeal" aria-hidden="true">💗</span>
                  <span className="envFlap2" aria-hidden="true" />
                </button>

                <div className="envelopeHint">Score ≥ 3 : tu as débloqué la lettre.</div>
              </div>
            )}

            {!showEnvelope && <div className="envelopeHint">Score &lt; 3 : pas de lettre… retente !</div>}

            <div className="resultActions">
              <button className="btn yes" onClick={startQuiz} type="button">
                Refaire le quiz
              </button>
              <button className="btn soft" onClick={() => setStage('question')} type="button">
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
