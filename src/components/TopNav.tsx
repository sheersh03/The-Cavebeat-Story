
import { Link } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function TopNav(){
  return (
    <div className="fixed top-4 right-4 z-20">
      <WorkContactPill/>
    </div>
  )
}

function WorkContactPill(){
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

  return (
    <div onMouseLeave={()=>setHovered('none')} className="glass pill shadow-glow px-3 py-2">
      <div className="flex items-center gap-3">
        <Link onMouseEnter={()=>setHovered('work')} to="/work" className="px-3 py-1 text-sm tracking-wider uppercase text-white/90 hover:text-white">Work</Link>
        <motion.svg width="66" height="24" viewBox="0 0 66 24">
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
        <Link onMouseEnter={()=>setHovered('contact')} to="/contact" className="px-3 py-1 text-sm tracking-wider uppercase text-white/90 hover:text-white">Contact</Link>
      </div>
    </div>
  )
}
