
import Starfield from "../three/Starfield"
import TopNav from "../components/TopNav"
import BootSequence from "../components/BootSequence"
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"

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

  return (
    <>
      {booting && !contactMode && <BootSequence onComplete={handleBootComplete}/>}
      <div className={`relative min-h-screen overflow-hidden transition-opacity duration-700 ${booting && !contactMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Starfield/>
        <TopNav contactActive={contactMode}/>
        <CenterMedallion dimmed={contactMode}/>
        {!contactMode && <ScrollCue/>}
        {contactMode && <ContactOverlay/>}
      </div>
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
  const handleScroll = useCallback(()=>{
    if(typeof window === 'undefined') return
    const target = window.innerHeight * 0.9
    window.scrollBy({ top: target, behavior: 'smooth' })
  },[])

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-cyan-100/80 max-md:bottom-10">
      <style>{`
        @keyframes arrowFloat{0%,100%{transform:translateY(-2px);}50%{transform:translateY(4px);}}
        @keyframes tailPulse{0%,100%{opacity:0.25;}50%{opacity:0.85;}}
      `}</style>
      <button
        type="button"
        onClick={handleScroll}
        className="flex flex-col items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/60 text-[0.7rem] tracking-[0.45em] uppercase font-semibold max-md:text-[0.55rem] max-md:tracking-[0.3em]"
        style={{fontFamily:'"Rajdhani", "Orbitron", "Bank Gothic", "Segoe UI", sans-serif'}}
      >
        <span className="text-cyan-100/70">Scroll Down</span>
        <div className="relative w-16 h-16 max-md:w-14 max-md:h-14">
          <div className="absolute inset-0 rounded-full border border-cyan-200/35" style={{boxShadow:'0 0 18px rgba(126,227,255,0.35)'}}/>
          <div className="absolute inset-[6px] rounded-full border border-cyan-100/20 bg-[#0b1a23]/60 max-md:inset-[5px]" style={{boxShadow:'inset 0 0 14px rgba(126,227,255,0.18)'}}/>
          <svg
            className="absolute inset-0 m-auto h-6 w-6 text-cyan-100/80"
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
          <div className="absolute -bottom-10 left-1/2 h-12 w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-200/80 via-cyan-200/0 to-transparent max-md:h-10" style={{animation:'tailPulse 2.8s ease-in-out infinite'}}/>
        </div>
      </button>
    </div>
  )
}
