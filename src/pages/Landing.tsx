
import Starfield from "../three/Starfield"
import TopNav from "../components/TopNav"
import { useCallback } from "react"

export default function Landing(){
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Starfield/>
      <TopNav/>
      <CenterMedallion/>
      <ScrollCue/>
    </div>
  )
}

function CenterMedallion(){
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none">
      <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px]">
        {/* outer glow ring */}
        <div className="absolute inset-0 rounded-full"
             style={{boxShadow:'inset 0 0 40px rgba(126,227,255,0.3), 0 0 80px rgba(126,227,255,0.25)'}}/>
        {/* animated sheen ring */}
        <div className="absolute inset-2 rounded-full border border-white/20"
             style={{background:'conic-gradient(from 0deg, rgba(126,227,255,0.0), rgba(126,227,255,0.4), rgba(126,227,255,0.0) 30%)', filter:'blur(0.2px)',
                     animation:'spin 16s linear infinite'}}/>
        {/* inner ring */}
        <div className="absolute inset-10 rounded-full border border-white/30" />
        {/* logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/assets/img/logo.png" alt="CaveBeat logo" className="w-[55%] h-[55%] object-contain rounded-full"/>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
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
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-cyan-100/80">
      <style>{`
        @keyframes arrowFloat{0%,100%{transform:translateY(-2px);}50%{transform:translateY(4px);}}
        @keyframes tailPulse{0%,100%{opacity:0.25;}50%{opacity:0.85;}}
      `}</style>
      <button
        type="button"
        onClick={handleScroll}
        className="flex flex-col items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/60 text-[0.7rem] tracking-[0.45em] uppercase font-semibold"
        style={{fontFamily:'"Rajdhani", "Orbitron", "Bank Gothic", "Segoe UI", sans-serif'}}
      >
        <span className="text-cyan-100/70">Scroll Down</span>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border border-cyan-200/35" style={{boxShadow:'0 0 18px rgba(126,227,255,0.35)'}}/>
          <div className="absolute inset-[6px] rounded-full border border-cyan-100/20 bg-[#0b1a23]/60" style={{boxShadow:'inset 0 0 14px rgba(126,227,255,0.18)'}}/>
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
          <div className="absolute -bottom-10 left-1/2 h-12 w-[2px] -translate-x-1/2 bg-gradient-to-b from-cyan-200/80 via-cyan-200/0 to-transparent" style={{animation:'tailPulse 2.8s ease-in-out infinite'}}/>
        </div>
      </button>
    </div>
  )
}
