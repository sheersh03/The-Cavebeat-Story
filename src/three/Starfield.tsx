
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Starfield(){
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const canvas = ref.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000)
    camera.position.z = 3

    // create a sprite texture for soft particles
    const spriteSize = 64
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = spriteCanvas.height = spriteSize
    const ctx = spriteCanvas.getContext('2d')!
    const grd = ctx.createRadialGradient(spriteSize/2, spriteSize/2, 0, spriteSize/2, spriteSize/2, spriteSize/2)
    grd.addColorStop(0, 'rgba(255,255,255,0.9)')
    grd.addColorStop(0.35, 'rgba(255,255,255,0.35)')
    grd.addColorStop(1, 'rgba(255,255,255,0.0)')
    ctx.fillStyle = grd
    ctx.fillRect(0,0,spriteSize,spriteSize)
    const texture = new THREE.CanvasTexture(spriteCanvas)

    const geometry = new THREE.BufferGeometry()
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for(let i=0;i<count;i++){
      const r = 2.2 + Math.random()*1.8
      const theta = Math.random()*Math.PI*2
      const phi = (Math.random()-0.5)*Math.PI/1.1
      positions[i*3+0] = r * Math.cos(theta) * Math.cos(phi)
      positions[i*3+1] = r * Math.sin(phi)
      positions[i*3+2] = r * Math.sin(theta) * Math.cos(phi)

      // subtle greens lower, blues higher
      const y = positions[i*3+1]
      const c = new THREE.Color().setHSL( y>0 ? 0.58 : 0.28, 0.7, 0.7 )
      colors[i*3+0] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))

    const material = new THREE.PointsMaterial({ size:0.04, map:texture, transparent:true, depthWrite:false, vertexColors:true, blending:THREE.AdditiveBlending, sizeAttenuation:true })
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    function onResize(){
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth/window.innerHeight
      camera.updateProjectionMatrix()
    }
    onResize(); window.addEventListener('resize', onResize)

    const mouse = new THREE.Vector2()
    const target = new THREE.Vector2()
    window.addEventListener('mousemove', (e)=>{
      target.set((e.clientX/window.innerWidth)*2-1, (e.clientY/window.innerHeight)*2-1)
    })

    const clock = new THREE.Clock()
    function animate(){
      const t = clock.getElapsedTime()
      points.rotation.y = t * 0.02
      mouse.lerp(target, 0.05)
      scene.position.x = mouse.x * 0.03
      scene.position.y = -mouse.y * 0.03
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return ()=>{
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    }
  },[])

  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none" />
}
