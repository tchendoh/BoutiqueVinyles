import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, addToCart } from '../services/api'

function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const imgRef = useRef(null)
  const animRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const canvasRef = useRef(null)
  const grainRef = useRef(null)

  async function handleAddToCart() {
    await addToCart({ id: product.id, title: product.title, price: product.price, image_url: product.image_url })
    setMessage('Ajouté au panier !')
    setTimeout(() => setMessage(''), 2000)
  }

  useEffect(() => {
    getProduct(id).then(data => setProduct(data))
  }, [id])

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause()
      cancelAnimationFrame(animRef.current)
      clearTimeout(grainRef.current)
      document.body.classList.remove('playing')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('playing', playing)
  }, [playing])

  function setupAudioContext() {
    if (analyserRef.current) return

    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256

    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(ctx.destination)

    audioCtxRef.current = ctx
    analyserRef.current = analyser
  }

  function startAnimation() {
    const analyser = analyserRef.current
    const img = imgRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    function frame() {
      analyser.getByteFrequencyData(dataArray)

      let sumAll = 0
      for (let i = 0; i < dataArray.length; i++) sumAll += dataArray[i]
      const full = sumAll / dataArray.length / 255

      const bassEnd = Math.floor(dataArray.length / 4)
      let sumBass = 0
      for (let i = 0; i < bassEnd; i++) sumBass += dataArray[i]
      const bass = sumBass / bassEnd / 255

      const scale = 1 + full * 0.06
      const rotate = (bass - 0.5) * 1.5

      img.style.transform = `scale(${scale}) rotate(${rotate}deg)`

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)
  }

  function stopAnimation() {
    cancelAnimationFrame(animRef.current)
    if (imgRef.current) {
      imgRef.current.style.transform = ''
    }
  }

  function startGrain() {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.opacity = '1'

    const ctx = canvas.getContext('2d')

    const cx = -canvas.width * 0.4
    const cy = canvas.height / 2
    const minR = canvas.width * 0.4
    const maxR = canvas.width * 1.4

    const grains = Array.from({ length: 1200 }, () => {
      return {
        r:      minR + Math.random() * (maxR - minR),
        angle:  Math.random() * Math.PI * 2,
        arcLen: 0.005 + Math.pow(Math.random(), 2) * 0.4,
        width:  0.4 + Math.random() * 1.2,
        isGray: Math.random() > 0.65,
      }
    })

    // Rotation lente — grand vinyle, arcs quasi verticaux
    const speed = 0.03

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const g of grains) {
        g.angle += speed

        const l = g.isGray
          ? Math.floor(Math.random() * 80 + 140)
          : Math.floor(Math.random() * 40)
        const a = Math.random() * 0.10 + 0.03

        ctx.beginPath()
        ctx.arc(cx, cy, g.r, g.angle - g.arcLen / 2, g.angle + g.arcLen / 2)
        ctx.strokeStyle = `rgba(${l}, ${l}, ${l}, ${a})`
        ctx.lineWidth = g.width
        ctx.stroke()
      }

      grainRef.current = setTimeout(() => requestAnimationFrame(draw), 1000 / 12)
    }

    draw()
  }

  function stopGrain() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.style.opacity = '0'
    setTimeout(() => {
      clearTimeout(grainRef.current)
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 1800)
  }

  function handlePlay() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      stopAnimation()
      stopGrain()
    } else {
      setupAudioContext()
      audio.play()
      startAnimation()
      startGrain()
    }
    setPlaying(p => !p)
  }

  function handleEnded() {
    stopAnimation()
    stopGrain()
    setPlaying(false)
  }

  if (!product) return <div className="product-page__loading">Chargement…</div>

  const {
    title, artist, genre, price, description,
    image_url, label, format, release_date, original_release_date
  } = product

  const year = original_release_date
    ? new Date(original_release_date).getFullYear()
    : new Date(release_date).getFullYear()

  const audio_url = image_url
    ? image_url.replace('/images/', '/songs/').replace('.webp', '.mp3')
    : null

  return (
    <div className={`product-page${playing ? ' product-page--playing' : ''}`}>
      <canvas ref={canvasRef} className="grain-canvas" />

      <div className="product-page__back">
        <Link to="/">← Retour</Link>
      </div>

      <div className="product-page__layout">
        <div className="product-page__image-col">
          <img
            ref={imgRef}
            src={image_url || '/placeholder.jpg'}
            alt={`${title} — ${artist}`}
            className="product-page__image"
          />
          {audio_url && (
            <>
              <audio ref={audioRef} src={audio_url} onEnded={handleEnded} />
              <button className="btn-play" onClick={handlePlay}>
                {playing ? '◼ Stop' : '▶ Play'}
              </button>
            </>
          )}
        </div>

        <div className="product-page__info-col">
          <div className="product-page__meta-top">
            <span className="product-page__genre">{genre}</span>
            <span className="product-page__year">{year}</span>
          </div>

          <h1 className="product-page__title">{title}</h1>
          <p className="product-page__artist">{artist}</p>

          <div className="product-page__divider" />

          <p className="product-page__description">{description}</p>

          <div className="product-page__divider" />

          <div className="product-page__details">
            <div className="product-page__detail">
              <span className="product-page__detail-label">Format</span>
              <span className="product-page__detail-value">{format}</span>
            </div>
            {label && (
              <div className="product-page__detail">
                <span className="product-page__detail-label">Label</span>
                <span className="product-page__detail-value">{label}</span>
              </div>
            )}
          </div>

          <div className="product-page__price-row">
            <span className="product-page__price">{price} $</span>
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
          </div>

          {message && (
            <div className="overlay">
              <div className="overlay-message">{message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
