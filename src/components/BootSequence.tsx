import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

type BootSequenceProps = {
  onComplete: () => void
}

const STREAM_LINES = [
  "// initializing optic relays",
  "# calibrating graviton anchors",
  "@ parsing quantum mesh",
  ":: routing holo-grid → READY",
  ".. injecting synthwave shaders",
  "~/ bootloader ACK"
]

export default function BootSequence({ onComplete }: BootSequenceProps){
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'enter'|'exit'>('enter')
  const rafRef = useRef<number>()

  useEffect(()=>{
    const duration = 4200
    const start = performance.now()

    const tick = (now:number)=>{
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.floor(eased * 100))
      if(t < 1){
        rafRef.current = requestAnimationFrame(tick)
      }else{
        setPhase('exit')
        setTimeout(()=>onComplete(), 2600)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current) }
  },[onComplete])

  const currentStream = useMemo(()=>{
    const index = Math.min(STREAM_LINES.length - 1, Math.floor(progress / (100 / STREAM_LINES.length)))
    return STREAM_LINES[index]
  },[progress])

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#010308] text-cyan-100 transition-opacity duration-500 ${phase==='exit'?'opacity-0 pointer-events-none':'opacity-100'}`}>
      <FuturisticCore progress={progress} streamText={currentStream} phase={phase}/>
    </div>
  )
}

function FuturisticCore({ progress, streamText, phase }:{ progress:number; streamText:string; phase:'enter'|'exit' }){
  const fadingCore = phase==='exit'
  return (
    <div className="relative flex flex-col items-center gap-10">
      <div className={`relative w-[260px] max-w-[72vw] aspect-square flex items-center justify-center text-[0.65rem] uppercase tracking-[0.6em] transition-all duration-500 ${fadingCore ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 rounded-full border border-cyan-500/40 blur-lg animate-[pulseGlow_2600ms_ease-in-out_infinite]" />
        <div className="absolute inset-[-24%] rounded-full bg-[radial-gradient(circle_at_center,rgba(20,140,180,0.25),transparent_65%)] opacity-70 animate-[scanField_18s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-cyan-300/30 blur-[2px]" />
        <div className="absolute inset-[18%] rounded-full border border-cyan-100/40" style={{boxShadow:'0 0 24px rgba(94,234,255,0.35)'}} />
        <div className="absolute inset-[35%] rounded-full bg-[radial-gradient(circle_at_center,rgba(9,133,153,0.55),rgba(3,15,23,0.9))] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-60 bg-[repeating-linear-gradient(135deg,rgba(144,224,255,0.25)_0,rgba(144,224,255,0.25)_4px,transparent_4px,transparent_10px)] animate-[matrixSlide_2600ms_linear_infinite]" />
          <span className="relative font-mono text-lg tracking-[0.35em] text-cyan-100/90">{progress.toString().padStart(3,'0')}%</span>
        </div>
        <div className="absolute inset-[10%] rounded-full animate-[ringRotate_20s_linear_infinite]" style={{background:'conic-gradient(from 0deg, transparent, rgba(126,227,255,0.35), transparent 40%)'}} />
      </div>
      <div className={`flex flex-col items-center text-xs uppercase tracking-[0.4em] text-cyan-100/70 font-mono transition-opacity duration-500 ${fadingCore ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <span className="text-cyan-200/80 mb-3">System Boot Sequence</span>
        <div className="relative w-56 h-1.5 bg-cyan-500/20 overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-cyan-200 to-transparent" style={{width:`${progress}%`}} />
        </div>
        <span className="mt-4 text-[0.65rem] tracking-[0.35em] text-cyan-200/60">{streamText}</span>
      </div>
      {phase==='exit' && <PlasmaDetonation/>}
      <style>{`
        @keyframes matrixSlide { to { transform: translateX(-30%); } }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%,100% { opacity: 0.35; transform: scale(0.98); } 50% { opacity: 0.6; transform: scale(1.02); } }
        @keyframes scanField { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function PlasmaDetonation(){
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>()

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;

        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)*u.y*(1.0-u.x) + (d - b)*u.x*u.y;
        }

        vec3 plasmaColor(float intensity, float angle){
          vec3 blue = vec3(0.3, 0.7, 1.0);
          vec3 cyan = vec3(0.6, 0.95, 1.0);
          vec3 magenta = vec3(1.0, 0.35, 0.85);
          float blend = 0.5 + 0.5*sin(angle*3.5 + uTime*6.0);
          vec3 base = mix(blue, magenta, blend);
          return base * intensity + cyan * (intensity*0.6);
        }

        void main(){
          vec2 uv = vUv;
          vec2 res = uResolution;
          vec2 centered = (uv - 0.5)*vec2(res.x/res.y, 1.0);
          float r = length(centered);
          float angle = atan(centered.y, centered.x);

          float t = clamp(uTime, 0.0, 1.0);
          float front = smoothstep(0.0, 0.2, t);

          float swirl = sin(angle*8.0 + t*12.0) * 0.05;
          float radial = r + swirl;

          float innerShock = exp(-pow((radial - (0.2 + 0.4*t)), 2.0) * 45.0);
          float outerShock = exp(-pow((radial - (0.45 + 0.55*t)), 2.0) * 18.0);
          float noiseField = noise(centered*6.0 + vec2(t*4.0, -t*3.0));

          float filaments = pow(max(0.0, cos(angle*6.0 + t*8.0) * 0.5 + 0.5), 2.0);
          filaments *= smoothstep(0.0, 0.3, t);

          float glow = exp(-radial*3.2) * (0.6 + 0.5*noiseField);
          float haze = exp(-pow(radial - (0.48 + 0.4*t), 2.0) * 6.0);

          vec3 color = vec3(0.04,0.08,0.14) * (1.0 - t*0.6);
          color += plasmaColor(innerShock*1.3, angle);
          color += plasmaColor(outerShock*0.9, angle + 1.57);
          color += plasmaColor(filaments*0.8, angle*1.5);
          color += vec3(0.4,0.8,1.0) * glow * (1.0 + noiseField*0.4);
          color += vec3(1.0,0.6,1.0) * haze * 0.5;

          float alpha = clamp(innerShock + outerShock + glow*0.8, 0.0, 1.0);
          alpha *= smoothstep(1.6, 0.8, radial + t*0.3);

          gl_FragColor = vec4(color, alpha);
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const setSize = ()=>{
      const viewport = window.visualViewport
      const w = viewport ? viewport.width : window.innerWidth
      const h = viewport ? viewport.height : window.innerHeight
      renderer.setSize(w, h, false)
      material.uniforms.uResolution.value.set(w, h)
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
    }
    setSize()

    const start = performance.now()
    const duration = 2000

    const animate = ()=>{
      const elapsed = performance.now() - start
      material.uniforms.uTime.value = Math.min(elapsed / duration, 1.0)
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = ()=>{
      setSize()
    }
    window.addEventListener('resize', handleResize)

    return ()=>{
      if(frameRef.current) cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  },[])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
