
import Starfield from "../three/Starfield"
import TopNav from "../components/TopNav"
import BootSequence from "../components/BootSequence"
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

type LandingProps = {
  contactMode?: boolean
}

export default function Landing({ contactMode = false }: LandingProps){
  const initialBoot = useMemo(()=>{
    const hasBooted = typeof sessionStorage !== "undefined" && sessionStorage.getItem("cavebeat_booted") === "1"
    return !contactMode && !hasBooted
  },[contactMode])

  const [booting, setBooting] = useState(initialBoot)

  useEffect(()=>{
    if(contactMode){
      setBooting(false)
    }
  },[contactMode])

  const handleBootComplete = useCallback(()=>{
    try { sessionStorage.setItem("cavebeat_booted", "1") } catch(_){}
    setBooting(false)
  },[])

  // Simple swipe detection
  useEffect(() => {
    let startY = 0
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      const deltaY = startY - endY
      
      if (deltaY > 100) {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
      } else if (deltaY < -100) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <>
      {booting && !contactMode && <BootSequence onComplete={handleBootComplete}/>}
      <div className={`relative min-h-screen overflow-hidden transition-opacity duration-700 ${booting && !contactMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Starfield/>
        <TopNav contactActive={contactMode}/>
        <CornerTagline/>
        <CenterMedallion dimmed={contactMode}/>
        {!contactMode && <ScrollCue/>}
        {contactMode && <ContactOverlay/>}
      </div>
      
      {/* Our Services Section - Swipe Access Only */}
      <OurServicesSection />
    </>
  )
}

function CenterMedallion({ dimmed = false }: { dimmed?: boolean }){
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none">
      <div className={`relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] max-md:w-[65vw] max-md:h-[65vw] transition-all duration-700 ${dimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 rounded-full"
             style={{boxShadow:'inset 0 0 40px rgba(126,227,255,0.3), 0 0 80px rgba(126,227,255,0.25)'}}/>
        <div className="absolute inset-2 rounded-full border border-white/20"
             style={{background:'conic-gradient(from 0deg, rgba(126,227,255,0.0), rgba(126,227,255,0.4), rgba(126,227,255,0.0) 30%)', filter:'blur(0.2px)',
                     animation:'spin 16s linear infinite'}}/>
        <div className="absolute inset-10 rounded-full border border-white/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/assets/img/logo.png" alt="CaveBeat logo" className="w-[55%] h-[55%] object-contain rounded-full"/>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )
}

function CornerTagline(){
  const acronym = "Connected AI Verticals Edge Bridging Ecosystems Across Territories"
  const prefersReducedMotion = usePrefersReducedMotion()
  const { output, complete } = useTypewriter(acronym, {
    startDelay: 520,
    minSpeed: 22,
    maxSpeed: 64,
    enabled: !prefersReducedMotion
  })
  const rendered = prefersReducedMotion ? acronym : (complete ? acronym : output)
  const caretShouldPulse = !prefersReducedMotion && complete

  return (
    <div className="hidden md:flex fixed top-6 left-6 z-20 max-w-sm xl:max-w-md">
      <div className="relative overflow-hidden px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_0_25px_rgba(126,227,255,0.2)]">
        <span className="pointer-events-none absolute -inset-px rounded-xl opacity-60 blur-lg bg-[radial-gradient(circle_at_top_left,rgba(126,227,255,0.38),rgba(126,227,255,0))]" aria-hidden="true"/>
        <span className="pointer-events-none absolute inset-0 rounded-xl border border-cyan-200/20" aria-hidden="true"/>
        <span className="pointer-events-none absolute inset-x-3 top-[1.5rem] h-px bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent" aria-hidden="true"/>
        <span className="pointer-events-none absolute left-3 bottom-3 w-2 h-2 rounded-full bg-cyan-200/60 shadow-[0_0_18px_rgba(126,227,255,0.6)]" aria-hidden="true"/>
        <div className="relative flex flex-col gap-1.5 text-white" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
          <span className="text-[0.58rem] tracking-[0.78em] text-cyan-200/80">C.A.V.E.B.E.A.T</span>
          <div className="relative text-[0.78rem] leading-5 tracking-[0.18em] text-white/80">
            <span className="corner-typewriter block pr-5" data-complete={caretShouldPulse}>{rendered}</span>
          </div>
        </div>
        <style>{`
          @keyframes caretPulse{0%,45%{opacity:1;}50%,100%{opacity:0.08;}}
          .corner-typewriter{position:relative; display:inline-block; min-height:1.1rem;}
          .corner-typewriter::after{content:''; position:absolute; right:0.2rem; top:0.12rem; width:0.18rem; height:1.05rem; background:rgba(184,242,255,0.9); box-shadow:0 0 14px rgba(126,227,255,0.65); border-radius:0.08rem; opacity:0.9;}
          .corner-typewriter[data-complete="true"]::after{animation:caretPulse 1.15s steps(1) infinite;}
        `}</style>
      </div>
    </div>
  )
}

function useTypewriter(text: string, options?: { startDelay?: number; minSpeed?: number; maxSpeed?: number; enabled?: boolean }){
  const { startDelay = 400, minSpeed = 30, maxSpeed = 60, enabled = true } = options ?? {}
  const [index, setIndex] = useState(enabled ? 0 : text.length)

  useEffect(()=>{
    if(!enabled){
      setIndex(text.length)
      return
    }
    setIndex(0)
  },[text, enabled])

  useEffect(()=>{
    if(!enabled){
      return
    }
    if(index >= text.length){
      return
    }
    const jitter = Math.random() * Math.max(1, maxSpeed - minSpeed)
    const delay = (index === 0 ? startDelay : minSpeed) + jitter
    const timer = window.setTimeout(()=>{
      setIndex(prev => Math.min(text.length, prev + 1))
    }, delay)
    return ()=>window.clearTimeout(timer)
  },[index, text.length, startDelay, minSpeed, maxSpeed, enabled])

  const output = text.slice(0, index)
  const complete = index >= text.length
  return { output, complete }
}

function usePrefersReducedMotion(){
  const [prefers, setPrefers] = useState(false)

  useEffect(()=>{
    if(typeof window === 'undefined' || !window.matchMedia){
      return
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = (matches: boolean) => setPrefers(matches)
    update(media.matches)
    const listener = (event: MediaQueryListEvent)=>update(event.matches)

    if(typeof media.addEventListener === 'function'){
      media.addEventListener('change', listener)
      return ()=>media.removeEventListener('change', listener)
    }

    if(typeof media.addListener === 'function'){
      media.addListener(listener)
      return ()=>media.removeListener(listener)
    }
  },[])

  return prefers
}

type SocialIcon = {
  name: string
  href: string
  viewBox: string
  path: string[]
  accent?: string
}

import { Link } from "react-router-dom"

function ContactOverlay(){
  const socials: SocialIcon[] = [
    {
      name:'Instagram',
      href:'https://instagram.com',
      viewBox:'0 0 24 24',
      path:[
        'M7 2c-2.8 0-5 2.2-5 5v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10z',
        'M12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z',
        'M17.25 6.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z'
      ],
      accent:'#db2777'
    },
    {
      name:'LinkedIn',
      href:'https://linkedin.com',
      viewBox:'0 0 24 24',
      path:[
        'M4.5 3a2.1 2.1 0 1 1-2.1 2.1A2.1 2.1 0 0 1 4.5 3z',
        'M3 8h3v13H3z',
        'M9 8h3v2.2h.06c.42-.8 1.6-1.64 3.3-1.64 3.53 0 4.2 2.23 4.2 5.14V21h-3v-6.2c0-1.48-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.3V21H9z'
      ],
      accent:'#0a66c2'
    },
    {
      name:'X',
      href:'https://x.com',
      viewBox:'0 0 24 24',
      path:[
        'M4 3h3.3l4.37 6.2L16.9 3H20l-6.4 8.5L20 21h-3.3l-4.6-6.55L7.1 21H4l6.7-8.9z'
      ],
      accent:'#e5e7eb'
    },
    {
      name:'WhatsApp',
      href:'https://wa.me/15555555555',
      viewBox:'0 0 24 24',
      path:[
        'M20.52 3.48A11.76 11.76 0 0 0 12.04 0h-.14A11.76 11.76 0 0 0 0.08 11.76a11.55 11.55 0 0 0 1.53 5.81L0 24l6.61-1.73a11.83 11.83 0 0 0 5.33 1.3h.13A11.76 11.76 0 0 0 23.76 12a11.69 11.69 0 0 0-3.24-8.52zM12 21.4h-.1a9.87 9.87 0 0 1-4.76-1.27l-.34-.2-3.93 1 1-3.83-.22-.35a9.66 9.66 0 0 1-1.54-5 9.79 9.79 0 0 1 9.82-9.8h.1a9.7 9.7 0 0 1 6.92 2.86A9.56 9.56 0 0 1 21.6 12 9.79 9.79 0 0 1 12 21.4zm5.42-7.56c-.3-.15-1.76-.86-2-.96s-.46-.15-.65.15-.75.94-.92 1.14-.34.22-.63.07a8.06 8.06 0 0 1-2.37-1.45 8.94 8.94 0 0 1-1.65-2c-.17-.29 0-.45.13-.6s.29-.34.44-.52.2-.29.3-.48a.52.52 0 0 0 0-.52c-.07-.15-.65-1.56-.9-2.13s-.48-.49-.65-.5-.37 0-.57 0a1.09 1.09 0 0 0-.79.37 3.34 3.34 0 0 0-1 2.49 5.83 5.83 0 0 0 1.21 3.08c.15.2 2.11 3.23 5.16 4.52a17.6 17.6 0 0 0 1.75.64 4.21 4.21 0 0 0 1.93.12 3.1 3.1 0 0 0 2-.95 2.49 2.49 0 0 0 .17-2.42c-.23-.34-.84-.52-1.13-.67z'
      ],
      accent:'#25d366'
    }
  ]

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-6 py-16 max-md:px-4 max-md:pt-24 max-md:pb-20 text-white">
      <div className="absolute inset-0 bg-[#030b14]/80 backdrop-blur-2xl" />
      <GlobeAura/>
      <div className="relative w-full max-w-5xl flex flex-col gap-12 text-center max-md:gap-8 max-md:items-center overflow-y-auto">
        <div className="flex justify-center max-md:w-full">
          <Link to="/" replace className="inline-flex items-center gap-2 px-5 py-2 border border-emerald-300/40 bg-black/20 rounded-full text-xs tracking-[0.35em] uppercase text-emerald-200/80 hover:text-emerald-200 hover:border-emerald-200 transition max-md:px-4" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
            <span>Close</span>
            <span>✕</span>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4 text-[0.65rem] tracking-[0.6em] uppercase text-cyan-100/70 max-md:text-[0.55rem]" style={{fontFamily:'"Rajdhani", "Orbitron", "Share Tech Mono", sans-serif'}}>
          <span className="text-cyan-300 text-base">✶</span>
          <span>Contact Us</span>
          <span className="text-cyan-300 text-base">✶</span>
        </div>
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-[clamp(0.6rem,1.4vw,1.4rem)] text-[clamp(1.35rem,2.4vw,2.6rem)] tracking-[0.14em] font-light text-white/90 whitespace-nowrap" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
            <span>WORLD</span>
            <span className="text-cyan-200/80 text-[clamp(0.8rem,1.8vw,1.8rem)]">➜</span>
            <span>WIDE</span>
            <span className="text-cyan-200/80 text-[clamp(0.8rem,1.8vw,1.8rem)]">➜</span>
            <span>WIRED</span>
          </div>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-white/40 to-transparent"/>
          <a href="mailto:hello@cavebeat.com" className="inline-flex items-center gap-3 text-sm tracking-[0.45em] uppercase text-cyan-100/80 hover:text-white transition max-md:text-xs max-md:tracking-[0.35em]" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
            <span className="h-px w-8 bg-cyan-200/70" />
            hello@cavebeat.com
            <span className="h-px w-8 bg-cyan-200/70" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-xs uppercase tracking-[0.35em] text-white/70 max-md:w-full max-md:gap-8" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/60">Social</span>
            <div className="flex items-center gap-4 text-white/80">
              {socials.map(({name, href, viewBox, path, accent})=>{
                const style: CSSProperties | undefined = accent ? {
                  color: accent,
                  borderColor: `${accent}77`,
                  backgroundColor: `${accent}1F`,
                  '--accent-glow': `${accent}40`,
                  '--accent-glow-strong': `${accent}90`
                } as CSSProperties : undefined
                return (
                  <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}
                     className="group inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 transition duration-300 ease-out hover:scale-105 [box-shadow:0_0_14px_var(--accent-glow,rgba(126,227,255,0.24))] hover:[box-shadow:0_0_28px_var(--accent-glow-strong,rgba(126,227,255,0.45))]"
                     style={style}>
                    <svg viewBox={viewBox} className="w-5 h-5 text-current fill-current" aria-hidden="true">
                      {path.map((d,idx)=>(<path key={idx} d={d}/>))}
                    </svg>
                  </a>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/60">Access</span>
            <div className="flex flex-col gap-2 text-[0.65rem] text-white/70 max-md:text-[0.62rem]">
              <a href="#privacy" className="hover:text-white">Privacy Notice</a>
              <a href="#newsletter" className="hover:text-white">Newsletter Signup</a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/60">Mobile Sync</span>
            <div className="relative flex items-center justify-center w-24 h-24 rounded-lg border border-white/20 bg-black/40 shadow-[0_0_20px_rgba(126,227,255,0.15)] max-md:w-20 max-md:h-20">
              <span className="text-[0.5rem] tracking-[0.35em] text-white/50">QR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GlobeAura(){
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[75vw] max-w-4xl aspect-square opacity-30 max-md:w-[110vw] max-md:opacity-25">
        <div className="absolute inset-0 rounded-full border border-cyan-200/20" />
        <div className="absolute inset-6 rounded-full border border-cyan-100/10" />
        <div className="absolute inset-12 rounded-full border border-cyan-50/10" />
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="globe-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(160,234,255,0.6)"/>
                <stop offset="100%" stopColor="rgba(160,234,255,0.05)"/>
              </linearGradient>
            </defs>
            {[...Array(8)].map((_,i)=>{
              return (
                <ellipse
                  key={`lat-${i}`}
                  cx="200"
                  cy="200"
                  rx={180}
                  ry={180 - i*16}
                  stroke="url(#globe-line)"
                  fill="none"
                  strokeWidth="0.6"
                  opacity={Math.max(0.15, 0.5 - i*0.05)}
                  className="animate-[globeSpin_18s_linear_infinite]"
                  style={{animationDelay:`-${i*1.2}s`}}
                />
              )
            })}
            {[...Array(6)].map((_,i)=>{
              const angle = (i+1)*Math.PI/7
              const x = Math.cos(angle)*180
              return (
                <line
                  key={`lon-${i}`}
                  x1={200-x}
                  y1="20"
                  x2={200+x}
                  y2="380"
                  stroke="url(#globe-line)"
                  strokeWidth="0.5"
                  opacity="0.35"
                  className="animate-[globeSpin_18s_linear_infinite]"
                  style={{animationDelay:`-${i*1.5}s`}}
                />
              )
            })}
          </svg>
        </div>
      </div>
      <style>{`@keyframes globeSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function ScrollCue(){
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  // Reset click count after 2 seconds
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [clickCount])

  const handleScroll = () => {
    const now = Date.now()
    
    // Double-click detection (within 500ms)
    if (now - lastClickTime < 500) {
      console.log('Double-click detected - opening services!')
      // Trigger services section
      const event = new CustomEvent('openServices')
      document.dispatchEvent(event)
      setClickCount(0)
      return
    }
    
    setLastClickTime(now)
    setClickCount(prev => prev + 1)
    
    // Single click - normal scroll
    console.log('Single click - scrolling down')
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
  }

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-cyan-100/80 max-md:bottom-10">
      <button
        type="button"
        onClick={handleScroll}
        className="flex flex-col items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/60 text-[0.7rem] tracking-[0.45em] uppercase font-semibold max-md:text-[0.55rem] max-md:tracking-[0.3em] group"
        style={{fontFamily:'"Rajdhani", "Orbitron", "Bank Gothic", "Segoe UI", sans-serif'}}
      >
        <span className="text-cyan-100/70 group-hover:text-cyan-100 transition-colors duration-300">
          {clickCount > 0 ? 'Double-click for Services' : 'Scroll Down'}
        </span>
        <div className="relative w-16 h-16 max-md:w-14 max-md:h-14 group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 rounded-full border border-cyan-200/35 group-hover:border-cyan-200/60 transition-colors duration-300" style={{boxShadow:'0 0 18px rgba(126,227,255,0.35)'}}/>
          <div className="absolute inset-[6px] rounded-full border border-cyan-100/20 bg-[#0b1a23]/60 max-md:inset-[5px] group-hover:bg-[#0b1a23]/80 transition-colors duration-300" style={{boxShadow:'inset 0 0 14px rgba(126,227,255,0.18)'}}/>
          <svg
            className="absolute inset-0 m-auto h-6 w-6 text-cyan-100/80 group-hover:text-cyan-100 transition-colors duration-300"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
            style={{animation:'arrowFloat 2.4s ease-in-out infinite'}}
          >
            <defs>
              <linearGradient id="scroll-arrow" x1="0" y1="0" x2="0" y2="24">
                <stop offset="0%" stopColor="#7ee3ff" />
                <stop offset="100%" stopColor="#99f6e4" />
              </linearGradient>
            </defs>
            <path d="M12 3v12.6" stroke="url(#scroll-arrow)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 12.6L12 18l5-5.4" fill="none" stroke="url(#scroll-arrow)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      
      {/* Hint text */}
      <div className="text-xs text-cyan-100/40 tracking-[0.2em] uppercase font-mono animate-pulse">
        Double-click for Services
      </div>
    </div>
  )
}



// Our Services Solar System Component - Swipe Access Only
function OurServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isActive, setIsActive] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [hoveredService, setHoveredService] = useState<number | null>(null)
  const [swipeStartY, setSwipeStartY] = useState(0)
  const [swipeStartX, setSwipeStartX] = useState(0)
  const DEBUG_MODE = false
  const shouldAnimate = !prefersReducedMotion && (isActive || DEBUG_MODE)

  // Enhanced interaction detection for services section
  useEffect(() => {
    if (DEBUG_MODE) {
      setIsActive(true)
      setHasEntered(true)
      return
    }

    // Listen for custom event from ScrollCue double-click
    const handleOpenServices = () => {
      console.log('Custom event received - opening services')
      setIsActive(true)
      setHasEntered(true)
    }

    // Touch events for mobile swipe
    const handleTouchStart = (e: TouchEvent) => {
      setSwipeStartY(e.touches[0].clientY)
      setSwipeStartX(e.touches[0].clientX)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      const endX = e.changedTouches[0].clientX
      const deltaY = swipeStartY - endY
      const deltaX = swipeStartX - endX
      
      // Swipe left to open services
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 80) {
        console.log('Swipe left detected - opening services')
        setIsActive(true)
        setHasEntered(true)
      }
      // Swipe right to close services
      else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -80) {
        console.log('Swipe right detected - closing services')
        setIsActive(false)
      }
    }

    // Mouse events for Mac trackpad gestures
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        setSwipeStartY(e.clientY)
        setSwipeStartX(e.clientX)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        const deltaY = swipeStartY - e.clientY
        const deltaX = swipeStartX - e.clientX
        
        // Trackpad swipe left to open services
        if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 100) {
          console.log('Trackpad swipe left detected - opening services')
          setIsActive(true)
          setHasEntered(true)
        }
        // Trackpad swipe right to close services
        else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -100) {
          console.log('Trackpad swipe right detected - closing services')
          setIsActive(false)
        }
      }
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault()
        setIsActive(!isActive)
        if (!hasEntered) setHasEntered(true)
      }
      // Escape key to close
      if (e.key === 'Escape' && isActive) {
        setIsActive(false)
      }
    }

    // Add all event listeners
    document.addEventListener('openServices', handleOpenServices)
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('openServices', handleOpenServices)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [swipeStartY, swipeStartX, isActive, hasEntered, DEBUG_MODE])

  const services = [
    {
      name: 'AI Development',
      description: 'Advanced artificial intelligence solutions',
      color: 'from-purple-400 to-purple-600',
      icon: '🤖',
      orbit: 'animate-planet-orbit',
      size: 'w-4 h-4',
      offset: 120,
      angle: 0
    },
    {
      name: 'Cloud Solutions',
      description: 'Scalable cloud infrastructure',
      color: 'from-blue-400 to-blue-600',
      icon: '☁️',
      orbit: 'animate-planet-orbit-2',
      size: 'w-5 h-5',
      offset: 180,
      angle: 60
    },
    {
      name: 'Data Analytics',
      description: 'Insights from your data universe',
      color: 'from-green-400 to-green-600',
      icon: '📊',
      orbit: 'animate-planet-orbit-3',
      size: 'w-6 h-6',
      offset: 240,
      angle: 120
    },
    {
      name: 'Cybersecurity',
      description: 'Protecting your digital galaxy',
      color: 'from-red-400 to-red-600',
      icon: '🛡️',
      orbit: 'animate-planet-orbit-4',
      size: 'w-5 h-5',
      offset: 300,
      angle: 180
    },
    {
      name: 'IoT Solutions',
      description: 'Connected device ecosystems',
      color: 'from-orange-400 to-orange-600',
      icon: '🌐',
      orbit: 'animate-planet-orbit-5',
      size: 'w-7 h-7',
      offset: 360,
      angle: 240
    },
    {
      name: 'Blockchain',
      description: 'Decentralized technology solutions',
      color: 'from-yellow-400 to-yellow-600',
      icon: '⛓️',
      orbit: 'animate-planet-orbit-6',
      size: 'w-6 h-6',
      offset: 420,
      angle: 300
    }
  ]
  const starField = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => {
        const base = index + 1
        const left = (base * 37) % 100
        const top = (base * 23) % 100
        const delay = (base % 12) * 0.25
        const duration = 2 + (base % 6) * 0.45
        return {
          key: `star-${index}`,
          left: `${left}%`,
          top: `${top}%`,
          delay: `${delay}s`,
          duration: `${duration}s`
        }
      }),
    []
  )

  // Don't render if not active
  if (!isActive && !DEBUG_MODE) {
    return null
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`fixed inset-0 z-40 transition-all duration-700 ease-out ${
        isActive || DEBUG_MODE ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Transparent blur background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
      
      {/* Animated Solar System Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[1000px] h-[1000px] max-md:w-[95vw] max-md:h-[95vw]">
          {/* Enhanced Background Stars */}
          <div className="absolute inset-0">
            {starField.map(star => (
              <div
                key={star.key}
                className="absolute h-1 w-1 rounded-full bg-white animate-star-twinkle"
                style={{
                  left: star.left,
                  top: star.top,
                  animationDelay: star.delay,
                  animationDuration: star.duration
                }}
              />
            ))}
          </div>

          {/* Multiple Shooting Stars */}
          <div className="absolute left-0 top-1/4 h-2 w-2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-200 to-transparent animate-comet" />
          <div className="absolute right-0 top-3/4 h-1 w-1 translate-x-1/2 rounded-full bg-gradient-to-l from-purple-200 to-transparent animate-comet" style={{ animationDelay: "2s" }} />
          <div className="absolute left-1/4 top-0 h-1 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-green-200 to-transparent animate-comet" style={{ animationDelay: "4s" }} />
          <div className="absolute right-1/4 bottom-0 h-1 w-1 translate-y-1/2 rounded-full bg-gradient-to-t from-orange-200 to-transparent animate-comet" style={{ animationDelay: "6s" }} />

          {/* Orbital Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-cyan-200/10 rounded-full animate-asteroid-belt" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-cyan-200/10 rounded-full animate-asteroid-belt" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-200/10 rounded-full animate-asteroid-belt" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-200/10 rounded-full animate-asteroid-belt" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-200/10 rounded-full animate-asteroid-belt" style={{ animationDelay: "4s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-cyan-200/10 rounded-full animate-asteroid-belt" style={{ animationDelay: "5s" }} />

          {/* Service Planets */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {services.map((service, i) => (
              <div
                key={service.name}
                className={`group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  shouldAnimate ? service.orbit : ""
                } cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/60`}
                style={
                  shouldAnimate
                    ? undefined
                    : { transform: `translate(-50%, -50%) rotate(${service.angle}deg) translateX(${service.offset}px)` }
                }
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                onFocus={() => setHoveredService(i)}
                onBlur={() => setHoveredService(null)}
                role="button"
                tabIndex={0}
                aria-label={service.name}
              >
                <div
                  className={`${service.size} relative rounded-full bg-gradient-to-br ${service.color} ${
                    shouldAnimate ? "animate-planet-rotation" : ""
                  } group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}
                  style={{
                    boxShadow: hoveredService === i ? `0 0 30px ${service.color.includes('purple') ? '#a78bfa' : service.color.includes('blue') ? '#60a5fa' : service.color.includes('green') ? '#4ade80' : service.color.includes('red') ? '#f87171' : service.color.includes('orange') ? '#fb923c' : service.color.includes('yellow') ? '#facc15' : '#7ee3ff'}` : '0 0 10px rgba(126,227,255,0.3)'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={shouldAnimate ? undefined : { transform: `rotate(${-service.angle}deg)` }}
                  >
                    {service.icon}
                  </div>
                  
                  {/* Service Label */}
                  <div
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${
                      hoveredService === i ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-2"
                    }`}
                  >
                    <div className="bg-black/80 backdrop-blur-md border border-cyan-200/30 rounded-xl px-4 py-2 shadow-lg">
                      <span className="font-heading text-sm font-semibold text-cyan-200">{service.name}</span>
                    </div>
                  </div>

                  {/* Energy Trail */}
                  <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                    hoveredService === i ? "opacity-100" : "opacity-0"
                  }`}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      service.color.includes('purple') ? 'bg-purple-400/30' :
                      service.color.includes('blue') ? 'bg-blue-400/30' :
                      service.color.includes('green') ? 'bg-green-400/30' :
                      service.color.includes('red') ? 'bg-red-400/30' :
                      service.color.includes('orange') ? 'bg-orange-400/30' :
                      service.color.includes('yellow') ? 'bg-yellow-400/30' :
                      'bg-cyan-400/30'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Services Info Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-6xl mx-auto px-6">
        <div className="relative bg-black/60 backdrop-blur-2xl border border-cyan-200/40 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(126,227,255,0.3)] animate-fade-in-scale">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
          
          {/* Title with Animation */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white/90 mb-4 font-display animate-fade-in-up">
              <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                OUR SERVICES
              </span>
            </h2>
            
            {/* Animated Divider */}
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent mb-6 animate-scan-line" />
            
            {/* Description with Typewriter Effect */}
            <p className="text-lg text-cyan-100/80 max-w-3xl mx-auto mb-8 font-body animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              Navigate through our constellation of cutting-edge services. Each service planet orbits around our core mission 
              to deliver innovative solutions that propel your business into the future.
            </p>
            
            {/* Interactive Service Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {services.map((service, i) => (
                <div
                  key={`${service.name}-card`}
                  className={`group relative cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.05] hover:scale-110 hover:rotate-1 ${
                    hoveredService === i ? "scale-110 border-cyan-200/40 bg-cyan-200/5 shadow-lg shadow-cyan-200/20" : ""
                  } animate-fade-in-up`}
                  style={{animationDelay: `${0.8 + i * 0.1}s`}}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Card Glow Effect */}
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${
                    hoveredService === i ? "opacity-100" : "opacity-0"
                  }`}>
                    <div className={`absolute inset-0 rounded-xl ${
                      service.color.includes('purple') ? 'bg-purple-500/10' :
                      service.color.includes('blue') ? 'bg-blue-500/10' :
                      service.color.includes('green') ? 'bg-green-500/10' :
                      service.color.includes('red') ? 'bg-red-500/10' :
                      service.color.includes('orange') ? 'bg-orange-500/10' :
                      service.color.includes('yellow') ? 'bg-yellow-500/10' :
                      'bg-cyan-500/10'
                    }`} />
                  </div>
                  
                  <div className="relative z-10">
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${service.color} ${
                        shouldAnimate ? "animate-planet-rotation" : ""
                      } group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}
                      style={{ 
                        animationDelay: `${i * 0.5}s`,
                        boxShadow: hoveredService === i ? `0 0 20px ${service.color.includes('purple') ? '#a78bfa' : service.color.includes('blue') ? '#60a5fa' : service.color.includes('green') ? '#4ade80' : service.color.includes('red') ? '#f87171' : service.color.includes('orange') ? '#fb923c' : service.color.includes('yellow') ? '#facc15' : '#7ee3ff'}` : '0 0 10px rgba(126,227,255,0.3)'
                      }}
                    >
                      <span className="text-lg">{service.icon}</span>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-cyan-200 transition-colors duration-300 group-hover:text-white">{service.name}</h3>
                    <p className="font-body text-xs text-cyan-100/60 transition-colors duration-300 group-hover:text-cyan-100/80">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
              <button
                type="button"
                onClick={() => {
                  console.log('Return to Home clicked - closing services')
                  setIsActive(false)
                  setHasEntered(false)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="group flex items-center gap-3 px-8 py-4 border border-cyan-200/40 bg-gradient-to-r from-cyan-200/10 to-transparent hover:from-cyan-200/20 hover:to-cyan-200/10 transition-all duration-300 text-cyan-200 font-semibold tracking-[0.1em] uppercase font-heading rounded-full hover:scale-105 hover:shadow-lg hover:shadow-cyan-200/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="absolute top-8 right-8 z-50">
        <button
          type="button"
          onClick={() => {
            console.log('Close button clicked - closing services')
            setIsActive(false)
            setHasEntered(false)
          }}
          className="group flex items-center justify-center w-12 h-12 rounded-full border border-cyan-200/40 bg-black/20 backdrop-blur-sm hover:bg-cyan-200/10 transition-all duration-300 text-cyan-200 hover:text-white"
          aria-label="Close Services"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Section Indicator */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-200/60">
        <div className="w-2 h-2 rounded-full bg-cyan-200/40 animate-pulse" />
        <span className="text-sm tracking-[0.2em] uppercase font-mono">Services Active</span>
        <div className="w-2 h-2 rounded-full bg-cyan-200/40 animate-pulse" />
      </div>
    </section>
  )
}
