
import Starfield from "../three/Starfield"
import TopNav from "../components/TopNav"
import BootSequence from "../components/BootSequence"
import PrivacyNotice from "../components/PrivacyNotice"
import NewsletterSignup from "../components/NewsletterSignup"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent
} from "react"

type ExperienceItem = {
  emoji: string
  label: string
}

type ExperienceStage = {
  id: "services" | "industries" | "hire"
  title: string
  subtitle: string
  description: string
  accent: "cyan" | "magenta" | "emerald"
  items: ExperienceItem[]
  primaryAction?: { label: string; targetStage?: number; href?: string }
  secondaryAction?: { label: string; targetStage?: number }
}

const SERVICE_ITEMS: ExperienceItem[] = [
  { emoji: "🖥️", label: "ICT Services" },
  { emoji: "💻", label: "Software Development" },
  { emoji: "📱", label: "Mobile App Development" },
  { emoji: "📡", label: "IoT Development" },
  { emoji: "🧠", label: "IT Consulting" },
  { emoji: "🛠️", label: "Managed IT Services" },
  { emoji: "⛓️", label: "Blockchain Services" },
  { emoji: "☁️", label: "Cloud Computing Services" },
  { emoji: "🔄", label: "DevOps" },
  { emoji: "🥽", label: "AR/VR Development" },
  { emoji: "🛡️", label: "Cybersecurity Services" },
  { emoji: "📊", label: "Data Analytics" },
  { emoji: "⚙️", label: "Digital Transformation" },
  { emoji: "🤖", label: "Artificial Intelligence" },
  { emoji: "🧾", label: "ERP Software Development" },
  { emoji: "🎮", label: "2D/3D Game Development" },
  { emoji: "🕸️", label: "Web Dev & Design" }
]

const INDUSTRY_ITEMS: ExperienceItem[] = [
  { emoji: "🚕", label: "Taxi" },
  { emoji: "📦", label: "On Demand" },
  { emoji: "🛒", label: "Ecommerce" },
  { emoji: "💳", label: "Fintech" },
  { emoji: "💞", label: "Dating & Chatting" },
  { emoji: "👥", label: "Social Networking" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "🌾", label: "Agriculture" },
  { emoji: "🚚", label: "Logistics" },
  // { emoji: "🛢️", label: "Oil and Gas" },
  { emoji: "📡", label: "Telecom" },
  { emoji: "🏗️", label: "Construction" },
  { emoji: "🛡️", label: "Insurance" },
  { emoji: "✈️", label: "Aviation" },
  { emoji: "🏭", label: "Manufacturing" },
  { emoji: "🏛️", label: "NGO" },
  { emoji: "📚", label: "eLearning" },
  { emoji: "🍽️", label: "Restaurant" },
  { emoji: "🎬", label: "Entertainment" },
  { emoji: "🧳", label: "Travel" },
  { emoji: "🛴", label: "E-scooter" },
  { emoji: "🎪", label: "Events" },
  { emoji: "🚗", label: "Automotive" },
  { emoji: "🏥", label: "Health Care" },
  { emoji: "🖥️", label: "SaaS" },
  { emoji: "🕹️", label: "Games" },
  { emoji: "🧘", label: "Wellness" },
  // { emoji: "🗳️", label: "Politics" },
  { emoji: "⚡️", label: "EV" },
  { emoji: "🏦", label: "Banking" },
  { emoji: "🏢", label: "Real Estate" },
  { emoji: "📰", label: "News" }
]

const HIRE_ITEMS: ExperienceItem[] = [
  { emoji: "⛓️", label: "Blockchain Developers" },
  { emoji: "🔁", label: "Cross Platform Developers" },
  { emoji: "🔧", label: "DevOps Developers" },
  { emoji: "🌀", label: "Drupal Developers" },
  { emoji: "🦋", label: "Flutter Developers" },
  { emoji: "🔘", label: "Ionic App Developers" },
  { emoji: "📲", label: "iPad Developers" },
  { emoji: "📱", label: "iPhone App Developers" },
  { emoji: "📳", label: "Mobile App Developers" },
  { emoji: "🐘", label: "PHP Developers" },
  { emoji: "⚛️", label: "React Native Developers" },
  { emoji: "📝", label: "WordPress Developers" },
  { emoji: "🧩", label: "Xamarin Developers" },
  { emoji: "🧵", label: "Joomla Developers" },
  { emoji: "🛍️", label: "Magento Developers" },
  { emoji: "🤖", label: "Android App Developers" }
]

const EXPERIENCE_STAGES: ExperienceStage[] = [
  {
    id: "services",
    title: "Our Services",
    subtitle: "Full-spectrum digital execution",
    description:
      "From core ICT modernisation to immersive experiences, CaveBeat delivers end-to-end product, platform, and infrastructure innovation.",
    accent: "cyan",
    items: SERVICE_ITEMS,
    primaryAction: { label: "Explore Industries", targetStage: 1 },
    secondaryAction: { label: "Return to Landing", targetStage: -1 }
  },
  {
    id: "industries",
    title: "Industries",
    subtitle: "",
    description:
      "We engineer solutions for movers, makers, dreamers, and disruptors across the globe. Scroll through the ecosystems we already power.",
    accent: "magenta",
    items: INDUSTRY_ITEMS,
    primaryAction: { label: "Explore Hiring Options", targetStage: 2 },
    secondaryAction: { label: "Back to Services", targetStage: 0 }
  },
  {
    id: "hire",
    title: "Hire Us",
    subtitle: "Craft your dream team",
    description:
      "Plug specialised CaveBeat squads directly into your roadmap. Mix, match, and mobilise elite engineers without slowing delivery.",
    accent: "emerald",
    items: HIRE_ITEMS,
    primaryAction: { label: "Hire Team", href: "mailto:hello@cavebeat.com?subject=Hire%20the%20CaveBeat%20team" },
    secondaryAction: { label: "Back to Industries", targetStage: 1 }
  }
]

const ACCENT_STYLES: Record<
  ExperienceStage["accent"],
  {
    primaryBase: string
    primaryOverlay: string
    headerGradient: string
    focusRing: string
    highlightBorder: string
  }
> = {
  cyan: {
    primaryBase:
      "group relative inline-flex items-center justify-center rounded-full border border-cyan-200/60 bg-gradient-to-r from-[#0d1f2b]/85 via-[#113144]/85 to-[#0d1f2b]/85 px-10 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-all duration-300 hover:from-[#123548]/90 hover:via-[#17445a]/90 hover:to-[#123548]/90 hover:text-white focus:outline-none",
    primaryOverlay:
      "pointer-events-none absolute inset-px rounded-full bg-gradient-to-r from-cyan-200/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
    headerGradient: "bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200",
    focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/70",
    highlightBorder: "border-cyan-200/40"
  },
  magenta: {
    primaryBase:
      "group relative inline-flex items-center justify-center rounded-full border border-fuchsia-200/60 bg-gradient-to-r from-[#24102e]/85 via-[#2f1442]/85 to-[#24102e]/85 px-10 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100 transition-all duration-300 hover:from-[#2d1642]/90 hover:via-[#3a1a59]/90 hover:to-[#2d1642]/90 hover:text-white focus:outline-none",
    primaryOverlay:
      "pointer-events-none absolute inset-px rounded-full bg-gradient-to-r from-fuchsia-200/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
    headerGradient: "bg-gradient-to-r from-fuchsia-200 via-pink-200 to-purple-200",
    focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-200/70",
    highlightBorder: "border-fuchsia-200/40"
  },
  emerald: {
    primaryBase:
      "group relative inline-flex items-center justify-center rounded-full border border-emerald-200/60 bg-gradient-to-r from-[#102c24]/85 via-[#154034]/85 to-[#102c24]/85 px-10 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition-all duration-300 hover:from-[#134033]/90 hover:via-[#1a5545]/90 hover:to-[#134033]/90 hover:text-white focus:outline-none",
    primaryOverlay:
      "pointer-events-none absolute inset-px rounded-full bg-gradient-to-r from-emerald-200/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
    headerGradient: "bg-gradient-to-r from-emerald-200 via-teal-200 to-lime-200",
    focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200/70",
    highlightBorder: "border-emerald-200/40"
  }
}

const SECONDARY_BUTTON_BASE =
  "group relative inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-10 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:bg-white/[0.12] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"

type LandingProps = {
  contactMode?: boolean
}

export default function Landing({ contactMode = false }: LandingProps){
  const initialBoot = useMemo(()=>{
    const hasBooted = typeof sessionStorage !== "undefined" && sessionStorage.getItem("cavebeat_booted") === "1"
    return !contactMode && !hasBooted
  },[contactMode])

  const [booting, setBooting] = useState(initialBoot)
  const [privacyNoticeOpen, setPrivacyNoticeOpen] = useState(false)
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  useEffect(()=>{
    if(contactMode){
      setBooting(false)
    }
  },[contactMode])

  const handleBootComplete = useCallback(()=>{
    try { sessionStorage.setItem("cavebeat_booted", "1") } catch(_){}
    setBooting(false)
  },[])

  const SECTION_COUNT = EXPERIENCE_STAGES.length
  const [experienceProgress, setExperienceProgress] = useState(0)
  const pointerState = useRef<{ pointerId: number | null; startY: number; startProgress: number }>({
    pointerId: null,
    startY: 0,
    startProgress: 0
  })

  const clampProgress = useCallback((value: number) => {
    if (value < 0) return 0
    if (value > SECTION_COUNT) return SECTION_COUNT
    return value
  }, [])

  const interactionsLocked = booting || contactMode

  useEffect(() => {
    if (contactMode) {
      setExperienceProgress(0)
      pointerState.current = { pointerId: null, startY: 0, startProgress: 0 }
    }
  }, [contactMode])

  const settleProgress = useCallback((value: number) => {
    if (value <= 0) return 0
    if (value >= SECTION_COUNT - 0.05) return SECTION_COUNT
    const snapped = Math.round(value)
    return Math.max(0, Math.min(SECTION_COUNT, snapped))
  }, [SECTION_COUNT])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (interactionsLocked) {
      return
    }
    if (event.target instanceof HTMLElement && event.target.closest('a,button,[data-skip-swipe]')) {
      pointerState.current = { pointerId: null, startY: 0, startProgress: experienceProgress }
      return
    }
    if (event.pointerType === "mouse" && event.buttons !== 1) {
      return
    }
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1
    const startFraction = event.clientY / viewportHeight
    const canEngageFromPosition = experienceProgress > 0.1 || startFraction <= 0.55
    if (!canEngageFromPosition) {
      pointerState.current = { pointerId: null, startY: 0, startProgress: experienceProgress }
      return
    }
    pointerState.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startProgress: experienceProgress
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch (_error) {
      // ignore pointer capture errors
    }
  }, [experienceProgress, interactionsLocked])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = pointerState.current
    if (interactionsLocked || state.pointerId !== event.pointerId) {
      return
    }
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1
    const delta = (event.clientY - state.startY) / (viewportHeight * 1.2)
    let next = state.startProgress
    if (delta > 0) {
      // downward motion reveals additional sections
      next = clampProgress(state.startProgress + delta)
    } else if (state.startProgress > 0) {
      // upward motion only closes when a layer is already visible
      next = clampProgress(state.startProgress + delta)
    }
    setExperienceProgress(next)
    event.preventDefault()
  }, [clampProgress, interactionsLocked])

  const finishPointerInteraction = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = pointerState.current
    if (state.pointerId !== event.pointerId) {
      return
    }
    const settled = settleProgress(experienceProgress)
    setExperienceProgress(settled)
    pointerState.current = { pointerId: null, startY: 0, startProgress: settled }
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch (_error) {
      // ignore release errors
    }
  }, [experienceProgress, settleProgress])

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    if (interactionsLocked) {
      return
    }
    if (Math.abs(event.deltaY) < 2) {
      return
    }
    event.preventDefault()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1
    const delta = event.deltaY / (viewportHeight * 1.6)
    setExperienceProgress(prev => {
      if (prev <= 0 && delta <= 0) {
        return 0
      }
      return clampProgress(prev + delta)
    })
  }, [clampProgress, interactionsLocked])

  useEffect(() => {
    if (interactionsLocked) {
      pointerState.current = { pointerId: null, startY: 0, startProgress: 0 }
    }
  }, [interactionsLocked])

  const openServices = useCallback((stageIndex = 0) => {
    if (!interactionsLocked) {
      const target = Math.max(0, Math.min(SECTION_COUNT, stageIndex + 1))
      pointerState.current = { pointerId: null, startY: 0, startProgress: target }
      setExperienceProgress(target)
    }
  }, [SECTION_COUNT, interactionsLocked])

  const closeServices = useCallback(() => {
    pointerState.current = { pointerId: null, startY: 0, startProgress: 0 }
    setExperienceProgress(0)
  }, [])

  const navigateToStage = useCallback((stageIndex: number) => {
    if (stageIndex < 0) {
      closeServices()
      return
    }
    const target = Math.max(0, Math.min(SECTION_COUNT, stageIndex + 1))
    pointerState.current = { pointerId: null, startY: 0, startProgress: target }
    setExperienceProgress(target)
  }, [SECTION_COUNT, closeServices])

  const pointerActive = pointerState.current.pointerId !== null
  const effectiveProgress = contactMode ? 0 : Math.min(experienceProgress, 1)

  const heroEffectStyle = useMemo<CSSProperties>(() => {
    const blur = (effectiveProgress * 18).toFixed(2)
    const scale = (1 - effectiveProgress * 0.05).toFixed(3)
    return {
      filter: `blur(${blur}px)`,
      transform: `scale(${scale})`,
      transition: pointerActive ? "none" : "filter 220ms ease, transform 220ms ease",
      willChange: "filter, transform"
    }
  }, [effectiveProgress, pointerActive])

  const touchActionValue = useMemo(() => {
    if (contactMode || interactionsLocked) {
      return "auto"
    }
    if (experienceProgress > 0.05) {
      return "pan-y"
    }
    return "none"
  }, [contactMode, experienceProgress, interactionsLocked])

  // Mobile-specific touch handling
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (interactionsLocked || !isMobile) return
    
    const touch = event.touches[0]
    if (touch) {
      const syntheticEvent = {
        ...event,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: 'touch' as const,
        buttons: 1,
        pressure: 0.5,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        width: 0,
        height: 0,
        isPrimary: true,
        getCoalescedEvents: () => [],
        getPredictedEvents: () => []
      } as unknown as ReactPointerEvent<HTMLDivElement>
      
      handlePointerDown(syntheticEvent)
    }
  }, [interactionsLocked, isMobile, handlePointerDown])

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (interactionsLocked || !isMobile) return
    
    const touch = event.touches[0]
    if (touch) {
      const syntheticEvent = {
        ...event,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: 'touch' as const,
        buttons: 1,
        pressure: 0.5,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        width: 0,
        height: 0,
        isPrimary: true,
        getCoalescedEvents: () => [],
        getPredictedEvents: () => []
      } as unknown as ReactPointerEvent<HTMLDivElement>
      
      handlePointerMove(syntheticEvent)
    }
  }, [interactionsLocked, isMobile, handlePointerMove])

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (interactionsLocked || !isMobile) return
    
    const touch = event.changedTouches[0]
    if (touch) {
      const syntheticEvent = {
        ...event,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: 'touch' as const,
        buttons: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        width: 0,
        height: 0,
        isPrimary: true,
        getCoalescedEvents: () => [],
        getPredictedEvents: () => []
      } as unknown as ReactPointerEvent<HTMLDivElement>
      
      finishPointerInteraction(syntheticEvent)
    }
  }, [interactionsLocked, isMobile, finishPointerInteraction])

  return (
    <>
      {booting && !contactMode && <BootSequence onComplete={handleBootComplete}/>}
      <div
        className="relative min-h-screen overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerInteraction}
        onPointerCancel={finishPointerInteraction}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ touchAction: touchActionValue }}
      >
        <div
          className={`relative min-h-screen overflow-hidden transition-opacity duration-700 ${booting && !contactMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{
            ...heroEffectStyle,
            ...(contactMode ? { pointerEvents: "auto" } : {})
          }}
        >
          <Starfield/>
          <TopNav contactActive={contactMode}/>
          <CornerTagline/>
          <CenterMedallion dimmed={contactMode}/>
          {!contactMode && <ScrollArrow onOpenServices={openServices} interactionsLocked={interactionsLocked}/>}
          {contactMode && <ContactOverlay onOpenPrivacy={() => setPrivacyNoticeOpen(true)} onOpenNewsletter={() => setNewsletterOpen(true)}/>}
          <PrivacyNotice isOpen={privacyNoticeOpen} onClose={() => setPrivacyNoticeOpen(false)}/>
          <NewsletterSignup isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)}/>
        </div>

        <OurServicesSection
          progress={experienceProgress}
          onRequestClose={closeServices}
          onRequestOpen={openServices}
          onNavigateToStage={navigateToStage}
          stageCount={SECTION_COUNT}
        />
      </div>
    </>
  )
}

function CenterMedallion({ dimmed = false }: { dimmed?: boolean }){
  return (
    <div className="absolute inset-0 flex items-center justify-center select-none px-4">
      <div className={`relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px] max-sm:w-[60vw] max-sm:h-[60vw] transition-all duration-700 ${dimmed ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
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
    <div className="hidden sm:flex fixed top-4 left-4 z-20 max-w-xs sm:max-w-sm xl:max-w-md">
      <div className="relative overflow-hidden px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_0_25px_rgba(126,227,255,0.2)]">
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

function ContactOverlay({ onOpenPrivacy, onOpenNewsletter }: { onOpenPrivacy: () => void; onOpenNewsletter: () => void }){
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
    <div className="absolute inset-0 z-30 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 text-white safe-area-top safe-area-bottom">
      <div className="absolute inset-0 bg-[#030b14]/80 backdrop-blur-2xl" />
      <GlobeAura/>
      <div className="relative w-full max-w-5xl flex flex-col gap-8 sm:gap-12 text-center items-center overflow-y-auto max-h-[90vh]">
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
              <button onClick={onOpenPrivacy} className="hover:text-white text-left">Privacy Notice</button>
              <button onClick={onOpenNewsletter} className="hover:text-white text-left">Newsletter Signup</button>
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

function ScrollArrow({ onOpenServices, interactionsLocked }: { onOpenServices?: (stageIndex?: number) => void; interactionsLocked?: boolean }) {
  const handleScrollClick = useCallback(() => {
    if (interactionsLocked) {
      return
    }
    
    // Use the proper function to open the services section
    onOpenServices?.(0)
  }, [onOpenServices, interactionsLocked])

  return (
    <button
      onClick={handleScrollClick}
      className="group fixed bottom-6 sm:bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-200/70 transition-all duration-300 hover:text-cyan-100 hover:scale-105 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/70 touch-manipulation"
      aria-label="Click to explore our services"
    >
      <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-200/20 blur-sm group-hover:bg-cyan-200/30 transition-colors duration-300" />
        
        {/* Main arrow container - properly centered */}
        <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-cyan-200/30 bg-black/20 backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-200/50 group-hover:bg-black/30">
          {/* Animated arrow - properly centered */}
          <svg 
            className="h-5 w-5 text-current transition-transform duration-300 group-hover:translate-y-0.5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
        
        {/* Pulsing animation ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-200/20 animate-pulse" />
      </div>
      
      {/* Click indicator text */}
      <span className="text-xs tracking-[0.15em] uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300" style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}>
        Click Here
      </span>
    </button>
  )
}

function OurServicesSection({
  progress,
  onRequestClose,
  onRequestOpen,
  onNavigateToStage,
  stageCount
}: {
  progress: number
  onRequestClose?: () => void
  onRequestOpen?: (stageIndex?: number) => void
  onNavigateToStage?: (stageIndex: number) => void
  stageCount: number
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  useEffect(() => {
    if (progress < 0.05 && hoveredItem !== null) {
      setHoveredItem(null)
    }
  }, [hoveredItem, progress])

  const starField = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const base = index + 1
        return {
          key: `star-${index}`,
          left: `${(base * 29) % 100}%`,
          top: `${(base * 17) % 100}%`,
          delay: (base % 9) * 0.2,
          duration: 2.2 + (base % 6) * 0.45,
          depth: 30 + (base % 8) * 10
        }
      }),
    []
  )

  if (progress <= 0.001) {
    return null
  }

  const normalized = Math.max(progress - 1e-6, 0)
  const stageIndex = Math.min(
    EXPERIENCE_STAGES.length - 1,
    Math.floor(Math.min(normalized, EXPERIENCE_STAGES.length - 1 + 0.999))
  )
  const stageProgress = Math.min(1, normalized - stageIndex)
  const stage = EXPERIENCE_STAGES[stageIndex]
  const accent = ACCENT_STYLES[stage.accent]
  const overlayPresence = Math.min(1, Math.pow(progress / Math.max(stageCount, 1), 0.8))
  const animate = !prefersReducedMotion && overlayPresence > 0.04
  const stageEase = prefersReducedMotion ? 1 : Math.pow(Math.max(stageProgress, 0), 0.85)

  const gridTemplate =
    stage.items.length > 24
      ? "repeat(auto-fit,minmax(150px,1fr))"
      : "repeat(auto-fit,minmax(160px,1fr))"

  const handlePrimary = () => {
    if (stage.primaryAction?.targetStage !== undefined) {
      onNavigateToStage?.(stage.primaryAction.targetStage)
      return
    }
    if (stage.primaryAction?.href) {
      if (typeof window !== "undefined") {
        window.open(stage.primaryAction.href, "_blank", "noopener,noreferrer")
      }
      return
    }
    onRequestOpen?.()
  }

  const handleSecondary = () => {
    if (!stage.secondaryAction) {
      onRequestClose?.()
      return
    }
    if (stage.secondaryAction.targetStage !== undefined) {
      if (stage.secondaryAction.targetStage < 0) {
        onRequestClose?.()
      } else {
        onNavigateToStage?.(stage.secondaryAction.targetStage)
      }
      return
    }
    onRequestClose?.()
  }

  return (
    <section
      aria-hidden={progress <= 0.001}
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ pointerEvents: progress > 0.02 ? "auto" : "none" }}
    >
      <div
        className="absolute inset-0 bg-[#030b14]"
        style={{ opacity: Math.min(1, 0.35 + overlayPresence * 0.65), transition: "opacity 220ms ease" }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {starField.map(star => (
          <div
            key={star.key}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              opacity: 0.15 + overlayPresence * 0.75,
              transform: `translate3d(0, ${(1 - overlayPresence) * star.depth}px, 0)`,
              transition: "opacity 200ms ease, transform 200ms ease",
              animation: animate ? `starTwinkle ${star.duration}s ease-in-out infinite` : "none",
              animationDelay: animate ? `${star.delay}s` : undefined
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 w-[min(94vw,1080px)] max-w-6xl rounded-3xl border border-white/10 bg-black/40 px-4 py-7 text-white shadow-[0_0_60px_rgba(126,227,255,0.25)] backdrop-blur-2xl transition-[opacity,transform] sm:px-8 sm:py-10"
        style={{
          opacity: Math.min(1, 0.4 + stageEase * 0.7),
          transform: `translateY(${(1 - stageEase) * 80}px) scale(${0.92 + stageEase * 0.08})`,
          transitionDuration: animate ? "240ms" : "120ms",
          transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)"
        }}
      >
        <div className="flex h-full flex-col gap-6 sm:gap-8">
          <div className="flex flex-col items-center gap-4 px-1 text-center sm:px-2">
            <h2 className="font-display text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl md:text-6xl">
              <span className={`${accent.headerGradient} bg-clip-text text-transparent`}>{stage.title}</span>
            </h2>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-28" />
            <p className="mx-auto max-w-3xl font-body text-sm text-white/70 sm:text-base md:text-lg">
              {stage.subtitle}
            </p>
            <p className="mx-auto max-w-4xl font-body text-xs text-white/55 sm:text-sm md:text-base">
              {stage.description}
            </p>
          </div>

          <div
            className="relative flex-1 overflow-y-auto pb-2 pr-1 sm:pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              opacity: Math.min(1, stageEase * 1.15),
              transform: `translateY(${(1 - stageEase) * 24}px)`,
              transition: "opacity 200ms ease, transform 220ms ease"
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/35 to-transparent" />
            <div className="grid gap-2 sm:gap-3 md:gap-4" style={{ gridTemplateColumns: gridTemplate }}>
              {stage.items.map((item, index) => (
                <div
                  key={`${stage.id}-${item.label}`}
                  className={`group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition-all duration-300 hover:bg-white/[0.08] sm:px-4 sm:py-3 ${
                    hoveredItem === index ? `${accent.highlightBorder} bg-white/[0.1]` : ""
                  }`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onFocus={() => setHoveredItem(index)}
                  onBlur={() => setHoveredItem(null)}
                  tabIndex={0}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/45 text-lg sm:h-10 sm:w-10">
                    {item.emoji}
                  </span>
                  <span className="font-heading text-xs uppercase tracking-[0.08em] text-white/80 transition-colors duration-300 group-hover:text-white sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-2 flex flex-col items-center justify-center gap-3 sm:mt-4 sm:flex-row sm:gap-4"
            style={{
              opacity: Math.min(1, Math.max(0, stageEase - 0.25) * 1.4),
              transform: `translateY(${(1 - stageEase) * 20}px)`,
              transition: "opacity 220ms ease, transform 220ms ease"
            }}
          >
            {stage.primaryAction && (
              <button
                type="button"
                onClick={handlePrimary}
                className={`${accent.primaryBase} ${accent.focusRing} w-full sm:w-auto`}
              >
                <span className="relative z-10">{stage.primaryAction.label}</span>
                <span className={accent.primaryOverlay} />
              </button>
            )}
            <button
              type="button"
              onClick={handleSecondary}
              className={`${SECONDARY_BUTTON_BASE} w-full sm:w-auto`}
            >
              <span className="relative z-10">
                {stage.secondaryAction ? stage.secondaryAction.label : "Return to Landing"}
              </span>
              <span className="pointer-events-none absolute inset-px rounded-full bg-white/[0.08] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
