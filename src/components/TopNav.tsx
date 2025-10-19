
import { Link, useLocation } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const ANIMATION_STEPS = 28

function useDecryptedText(label:string, active:boolean){
  const [phase, setPhase] = useState(0)
  const target = useMemo(()=>label.toUpperCase(), [label])

  useEffect(()=>{
    if(!active){
      setPhase(0)
      return
    }

    let frame = 0
    const interval = window.setInterval(()=>{
      frame+=1
      setPhase(Math.min(frame, ANIMATION_STEPS))
      if(frame>=ANIMATION_STEPS){
        window.clearInterval(interval)
      }
    }, 22)

    return ()=>window.clearInterval(interval)
  },[active])

  const rendered = useMemo(()=>{
    if(phase>=ANIMATION_STEPS){
      return target
    }
    const progress = phase / ANIMATION_STEPS
    const revealCount = Math.floor(target.length * progress)
    let result = ''
    for(let i=0;i<target.length;i++){
      if(i<revealCount){
        result += target[i]
      }else{
        const randomIdx = Math.floor(Math.random()*SCRAMBLE_CHARS.length)
        result += SCRAMBLE_CHARS[randomIdx]
      }
    }
    return result
  },[phase, target])

  return rendered
}

type TopNavProps = {
  contactActive?: boolean
}

export default function TopNav({ contactActive = false }: TopNavProps){
  const location = useLocation()
  const isWorkPage = location.pathname === '/work'
  
  return (
    <div className="fixed top-4 right-4 z-20 max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto max-md:w-[88vw] max-md:flex max-md:justify-center">
      {isWorkPage ? (
        <CloseButton />
      ) : (
        <WorkContactPill contactActive={contactActive}/>
      )}
    </div>
  )
}

function WorkContactPill({ contactActive }: { contactActive: boolean }){
  const [hovered, setHovered] = useState<'none'|'work'|'contact'>('none')
  const amp = useSpring(0, { stiffness: 180, damping: 16 })

  useEffect(()=>{
    amp.set(hovered==='none'?0:7)
  },[hovered, amp])

  const pathD = (a:number)=>{
    const sway = Math.max(0, Math.min(8, a))
    return `M 4 12 L 16 ${12 - sway} L 24 ${12 + sway} L 33 ${12 - sway} L 42 ${12 + sway} L 52 ${12 - sway} L 62 12`
  }

  const path = useTransform(amp, value => pathD(value))
  const pulse = useTransform(amp, [0, 7], [0.35, 1])
  const glow = useTransform(pulse, v => 0.25 + (v - 0.35) * 0.6)

  const workText = useDecryptedText('WORK', hovered==='work')
  const contactLabel = contactActive ? 'CLOSE' : 'CONTACT'
  const contactHref = contactActive ? '/' : '/contact'
  const contactText = useDecryptedText(contactLabel, hovered==='contact')

  return (
    <div onMouseLeave={()=>setHovered('none')} className="glass pill shadow-glow px-3 py-2 max-md:w-full max-md:px-2 max-md:py-[0.35rem]">
      <div className="flex items-center gap-3 max-md:w-full max-md:gap-0.5">
        <Link
          onMouseEnter={()=>setHovered('work')}
          to="/work"
          className="flex-1 inline-flex justify-center items-center px-3 py-1 text-sm tracking-wider uppercase text-white/90 hover:text-white font-[550] max-md:text-[0.82rem] max-md:px-3 max-md:py-[0.45rem]"
          aria-label="Work"
        >
          <span style={{fontFamily:'"Share Tech Mono", "Rajdhani", "Orbitron", monospace'}}>{hovered==='work'?workText:'WORK'}</span>
        </Link>
        <motion.svg width="66" height="24" viewBox="0 0 66 24" className="max-md:hidden">
          <motion.path
            d={path}
            stroke="url(#g)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 10"
            style={{ opacity: pulse }}
            animate={hovered==='none'
              ? { strokeDashoffset: 24 }
              : { strokeDashoffset: [24, 4, 24] }}
            transition={hovered==='none'
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 1.3, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.path
            d={path}
            stroke="rgba(126,227,255,0.4)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            style={{ opacity: glow }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="66" y2="0">
              <stop offset="0%" stopColor="#7ee3ff"/>
              <stop offset="100%" stopColor="#99f6e4"/>
            </linearGradient>
          </defs>
        </motion.svg>
        <Link
          onMouseEnter={()=>setHovered('contact')}
          to={contactHref}
          className={`flex-1 inline-flex justify-center items-center px-3 py-1 text-sm tracking-wider uppercase text-white/90 hover:text-white font-[550] max-md:text-[0.82rem] max-md:px-3 max-md:py-[0.45rem] ${contactActive?'text-emerald-300/90 hover:text-emerald-200':'text-white/90 hover:text-white'}`}
          aria-label={contactActive?'Close overlay':'Contact'}
        >
          <span style={{fontFamily:'"Share Tech Mono", "Rajdhani", "Orbitron", monospace'}}>{hovered==='contact'?contactText:contactLabel}</span>
        </Link>
      </div>
      <motion.svg width="60" height="18" viewBox="0 0 66 24" className="hidden max-md:block mx-auto mt-2">
        <motion.path
          d={path}
          stroke="url(#gMobile)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 10"
          style={{ opacity: pulse }}
          animate={hovered==='none'
            ? { strokeDashoffset: 24 }
            : { strokeDashoffset: [24, 4, 24] }}
          transition={hovered==='none'
            ? { duration: 0.6, ease: 'easeOut' }
            : { duration: 1.3, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.path
          d={path}
          stroke="rgba(126,227,255,0.4)"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          style={{ opacity: glow }}
        />
        <defs>
          <linearGradient id="gMobile" x1="0" y1="0" x2="66" y2="0">
            <stop offset="0%" stopColor="#7ee3ff"/>
            <stop offset="100%" stopColor="#99f6e4"/>
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  )
}

function CloseButton() {
  const [hovered, setHovered] = useState(false)
  const amp = useSpring(0, { stiffness: 180, damping: 16 })

  useEffect(() => {
    amp.set(hovered ? 7 : 0)
  }, [hovered, amp])

  const pulse = useTransform(amp, [0, 7], [0.35, 1])
  const glow = useTransform(pulse, v => 0.25 + (v - 0.35) * 0.6)

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass pill shadow-glow px-4 py-2 max-md:w-full max-md:px-3 max-md:py-[0.5rem]"
    >
      <Link
        to="/"
        className="flex items-center justify-center gap-2 text-sm tracking-wider uppercase text-white/90 hover:text-white font-[550] max-md:text-[0.82rem]"
        aria-label="Close and return to landing page"
      >
        <motion.div
          animate={hovered ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center w-5 h-5 rounded-full border border-white/30 hover:border-white/60 transition-colors duration-200"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white/80"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.div>
        <span style={{fontFamily:'"Share Tech Mono", "Rajdhani", "Orbitron", monospace'}}>
          CLOSE
        </span>
      </Link>
    </div>
  )
}
