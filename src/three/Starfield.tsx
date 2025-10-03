import { useEffect, useRef } from "react"
import * as THREE from "three"

type PlanetSpec = {
  radius: number
  size: number
  speed: number
  colorStops: [number, string][]
  glowColor: number
  ring?: {
    inner: number
    outer: number
    color: number
    opacity: number
  }
}

function createStarTexture(){
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const radial = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  radial.addColorStop(0, "rgba(255,255,255,0.9)")
  radial.addColorStop(0.35, "rgba(255,255,255,0.4)")
  radial.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

function createPlanetTexture(stops: [number, string][], noise = 4){
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  stops.forEach(([pos, color])=>gradient.addColorStop(pos, color))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const idx = (y*size+x)*4
      const n = (Math.sin(x/noise) + Math.cos(y/noise*1.3)) * 6
      data[idx] = Math.min(255, data[idx] + n)
      data[idx+1] = Math.min(255, data[idx+1] + n*0.6)
      data[idx+2] = Math.min(255, data[idx+2] + n*0.3)
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

export default function Starfield(){
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const canvas = canvasRef.current
    if(!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, window.innerWidth/window.innerHeight, 0.1, 100)
    camera.up.set(0, 0, 1)

    const root = new THREE.Group()
    scene.add(root)

    const cameraTarget = new THREE.Vector3(0, 0, 0)
    let baseYOffset = 0
    let allowParallax = true

    const disposableResources: Array<{ dispose: () => void }> = []

    // Star field backdrop
    const starTexture = createStarTexture()
    disposableResources.push(starTexture)
    const starGeometry = new THREE.BufferGeometry()
    const POINTS = 1900
    const positions = new Float32Array(POINTS * 3)
    const colors = new Float32Array(POINTS * 3)

    for(let i=0;i<POINTS;i++){
      const r = 6 + Math.random()*10
      const theta = Math.random()*Math.PI*2
      const z = (Math.random()-0.5)*6
      positions[i*3] = Math.cos(theta)*r
      positions[i*3+1] = Math.sin(theta)*r
      positions[i*3+2] = z

      const hue = 0.55 + (Math.random()-0.5)*0.1
      const sat = 0.5 + Math.random()*0.4
      const light = 0.6 + Math.random()*0.3
      const color = new THREE.Color().setHSL(hue, sat, light)
      colors[i*3] = color.r
      colors[i*3+1] = color.g
      colors[i*3+2] = color.b
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      size: 0.18,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    root.add(stars)
    disposableResources.push(starGeometry, starMaterial)

    // Lighting
    const ambient = new THREE.AmbientLight(0x9dd6ff, 0.6)
    scene.add(ambient)
    const key = new THREE.PointLight(0xfef2bf, 1.2, 50)
    key.position.set(6, 9, 6)
    scene.add(key)
    const rim = new THREE.PointLight(0x7bd8ff, 0.8, 50)
    rim.position.set(-6, 8, -6)
    scene.add(rim)

    const solarGroup = new THREE.Group()
    solarGroup.rotation.x = -Math.PI/2 + THREE.MathUtils.degToRad(18)
    root.add(solarGroup)

    // central pulse aura to cradle the logo
    const coreGlowTexture = createStarTexture()
    disposableResources.push(coreGlowTexture)
    const coreGlowMaterial = new THREE.SpriteMaterial({
      map: coreGlowTexture,
      color: new THREE.Color(0x7ee3ff),
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.35,
      depthWrite: false
    })
    const coreGlow = new THREE.Sprite(coreGlowMaterial)
    coreGlow.scale.setScalar(2.2)
    solarGroup.add(coreGlow)
    disposableResources.push(coreGlowMaterial)

    const orbitSpecs: PlanetSpec[] = [
      { radius:0.6, size:0.08, speed:1.1, colorStops:[[0,"#b5b5b5"],[1,"#7d7d7d"]], glowColor:0xb6b6b6 },
      { radius:0.86, size:0.12, speed:0.85, colorStops:[[0,"#f6d298"],[1,"#d2a86e"]], glowColor:0xf5d18c },
      { radius:1.16, size:0.13, speed:0.66, colorStops:[[0,"#3478f6"],[0.55,"#5bd1ff"],[1,"#1c5fb3"]], glowColor:0x66d0ff },
      { radius:1.46, size:0.11, speed:0.54, colorStops:[[0,"#d7744b"],[1,"#9b4024"]], glowColor:0xf08b63 },
      { radius:1.92, size:0.23, speed:0.41, colorStops:[[0,"#c8b29a"],[0.5,"#a57b5f"],[1,"#c8b29a"]], glowColor:0xd8bca4 },
      { radius:2.36, size:0.2, speed:0.34, colorStops:[[0,"#d7c49a"],[1,"#b69367"]], glowColor:0xf3e0b2, ring:{ inner:0.28, outer:0.48, color:0xf0e0b0, opacity:0.65 } },
      { radius:2.82, size:0.16, speed:0.29, colorStops:[[0,"#8ee5ff"],[1,"#4fb0df"]], glowColor:0x8be5ff },
      { radius:3.18, size:0.16, speed:0.23, colorStops:[[0,"#6c8bff"],[1,"#3155c7"]], glowColor:0x7ea3ff }
    ]

    const orbitMaterials: any[] = []
    const planetPivots: Array<{
      pivot: any
      mesh: any
      speed: number
      radius: number
      glow: any
      ring?: any
    }> = []

    orbitSpecs.forEach((spec, idx)=>{
      const ellipse = new THREE.EllipseCurve(0, 0, spec.radius, spec.radius)
      const points = ellipse.getPoints(256).map((p: any)=>new THREE.Vector3(p.x, p.y, 0))
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const orbitMaterial = new THREE.LineDashedMaterial({ color:0x7ee3ff, transparent:true, opacity:0.18, dashSize:0.12, gapSize:0.08 })
      const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial)
      orbit.computeLineDistances()
      solarGroup.add(orbit)
      disposableResources.push(orbitGeometry, orbitMaterial)
      orbitMaterials.push(orbitMaterial)

      const texture = createPlanetTexture(spec.colorStops, 6 - idx)
      disposableResources.push(texture)

      const planetGeometry = new THREE.SphereGeometry(spec.size, 48, 48)
      const planetMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color(spec.glowColor).multiplyScalar(0.35)
      })
      const mesh = new THREE.Mesh(planetGeometry, planetMaterial)
      mesh.castShadow = false
      mesh.receiveShadow = false
      disposableResources.push(planetGeometry, planetMaterial)

      const pivot = new THREE.Object3D()
      pivot.rotation.z = THREE.MathUtils.degToRad(idx % 2 === 0 ? 3 : -3)
      pivot.position.z = Math.sin(idx*0.18) * 0.04
      pivot.add(mesh)
      solarGroup.add(pivot)

      mesh.position.x = spec.radius

      const glowMaterial = new THREE.SpriteMaterial({
        map: (()=>{
          const tex = createStarTexture()
          disposableResources.push(tex)
          return tex
        })(),
        color: new THREE.Color(spec.glowColor),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.55,
        depthWrite: false
      })
      const glow = new THREE.Sprite(glowMaterial)
      glow.scale.setScalar(spec.size * 6.5)
      mesh.add(glow)
      disposableResources.push(glowMaterial)

      let ringMesh: any
      if(spec.ring){
        const ringGeometry = new THREE.RingGeometry(spec.ring.inner, spec.ring.outer, 96)
        const ringMaterial = new THREE.MeshBasicMaterial({ color: spec.ring.color, transparent:true, opacity: spec.ring.opacity, side: THREE.DoubleSide })
        ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = Math.PI/2
        mesh.add(ringMesh)
        disposableResources.push(ringGeometry, ringMaterial)
      }

      planetPivots.push({ pivot, mesh, speed: spec.speed, radius: spec.radius, glow, ring: ringMesh })
    })

    const pointerTarget = new THREE.Vector2(0, 0)
    const pointer = new THREE.Vector2(0, 0)

    const applyResponsiveLayout = ()=>{
      const { innerWidth, innerHeight } = window
      const portrait = innerHeight > innerWidth
      if(portrait){
        const viewport = window.visualViewport
        const viewportCenter = viewport ? viewport.offsetTop + viewport.height / 2 : innerHeight / 2
        const normalizedShift = (innerHeight / 2 - viewportCenter) / innerHeight
        const shift = THREE.MathUtils.clamp(normalizedShift * 4.5, -0.25, 0.12)
        camera.position.set(0, 6.8 + shift * 0.45, 1.15 + shift * 0.25)
        cameraTarget.set(0, -0.35 + shift * 0.55, 0)
        baseYOffset = -0.22 + shift
        solarGroup.position.set(0, -0.2 + shift * 0.85, 0)
        allowParallax = false
        pointerTarget.set(0, 0)
        pointer.set(0, 0)
      }else{
        camera.position.set(0, 6.5, 0.6)
        cameraTarget.set(0, 0, 0)
        baseYOffset = 0
        solarGroup.position.set(0, 0, 0)
        allowParallax = true
      }
      camera.lookAt(cameraTarget)
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }

    applyResponsiveLayout()
    window.addEventListener("resize", applyResponsiveLayout)
    const handlePointerMove = (event: PointerEvent)=>{
      if(!allowParallax){
        pointerTarget.set(0, 0)
        return
      }
      pointerTarget.set((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1)
    }
    const handlePointerExit = ()=>{
      pointerTarget.set(0, 0)
    }
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerExit)
    window.addEventListener("pointerleave", handlePointerExit)

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = ()=>{
      const elapsed = clock.getElapsedTime()

      pointer.lerp(pointerTarget, 0.08)
      if(allowParallax){
        root.rotation.z = pointer.x * 0.12
        root.position.x = pointer.x * 0.25
        root.position.y = pointer.y * 0.18 + baseYOffset
      }else{
        root.rotation.z = 0
        root.position.x = 0
        root.position.y = baseYOffset
      }

      stars.rotation.z += 0.0006

      orbitMaterials.forEach((material, idx)=>{
        material.dashOffset = -elapsed * (0.12 + idx * 0.015)
      })

      planetPivots.forEach((item, index)=>{
        const angle = elapsed * item.speed + index * 0.45
        item.pivot.rotation.z = angle
        item.mesh.rotation.y += 0.0025
        const x = Math.cos(angle) * item.radius
        const y = Math.sin(angle) * item.radius
        item.mesh.position.set(x, y, Math.sin(elapsed * 0.3 + index) * 0.03)

        ;(item.glow.material as any).opacity = 0.45 + Math.sin(elapsed * (1.1 + index * 0.17)) * 0.18
        if(item.ring){
          item.ring.rotation.z = Math.sin(elapsed * 0.4 + index) * 0.12
        }
      })

      const glowMat = coreGlow.material as any
      glowMat.opacity = 0.3 + Math.sin(elapsed*1.4)*0.1

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return ()=>{
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", applyResponsiveLayout)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerExit)
      window.removeEventListener("pointerleave", handlePointerExit)
      renderer.dispose()
      disposableResources.forEach(resource=>resource.dispose())
    }
  },[])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
}
