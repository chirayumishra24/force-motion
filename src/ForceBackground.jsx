import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * An elegant "Space-Time Gravity Well" 3D background reflecting "Force & Motion".
 * Light Theme Version: Integrates with the beige background of the retro lab.
 */
export default function ForceBackground() {
    const mountRef = useRef(null)
    const cleanupRef = useRef(null)

    useEffect(() => {
        const container = mountRef.current
        if (!container) return

        if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
        }

        let disposed = false
        let animationId

        // ─── SCENE SETUP ─────────────────────────────────────────
        const scene = new THREE.Scene()
        
        // Transparency enabled to show the underlying beige CSS background
        scene.background = null 
        
        // Light fog to blend grid edges smoothly
        scene.fog = new THREE.FogExp2('#f4ecd8', 0.008)
        
        const fov = 45
        const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 200)
        camera.position.set(0, 35, 45)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0) // Fully transparent
        
        container.appendChild(renderer.domElement)

        // ─── SPACE-TIME FABRIC (WIREFRAME GRID) ───────────────────
        const gridSize = 160
        const gridSegments = 80
        const planeGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridSegments, gridSegments)
        planeGeo.rotateX(-Math.PI / 2)

        const originalVertices = []
        const positions = planeGeo.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
            originalVertices.push(new THREE.Vector3(positions[i], positions[i+1], positions[i+2]))
        }

        // Use a deeper teal/blue for the grid lines to ensure visibility on light beige
        const planeMat = new THREE.LineBasicMaterial({
            color: 0x2a528a, // Matches --text-muted in styles.css
            transparent: true,
            opacity: 0.12,
            blending: THREE.NormalBlending
        })
        
        const wireframeGeo = new THREE.WireframeGeometry(planeGeo)
        const gridMesh = new THREE.LineSegments(wireframeGeo, planeMat)
        scene.add(gridMesh)


        // ─── SATELLITE PARTICLES (ORBITING BODIES) ────────────────
        const satelliteCount = 180
        const satellites = []
        const colors = [0xe63946, 0x2dce89, 0x00d4ff, 0xa855f7] // Thematic Lab Colors
        
        const satGeo = new THREE.SphereGeometry(0.3, 8, 8)
        
        // Center "Mass Point" (Replacing the Black Hole with a glowing energy core)
        const coreGeo = new THREE.SphereGeometry(1.2, 32, 32)
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
        const core = new THREE.Mesh(coreGeo, coreMat)
        
        const haloGeo = new THREE.SphereGeometry(1.8, 32, 32)
        const haloMat = new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff, 
            transparent: true, 
            opacity: 0.3, 
            side: THREE.BackSide
        })
        core.add(new THREE.Mesh(haloGeo, haloMat))
        scene.add(core)

        const satMaterialCache = colors.map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.7 }))

        for (let i = 0; i < satelliteCount; i++) {
            const colorIdx = Math.floor(Math.random() * colors.length)
            const mesh = new THREE.Mesh(satGeo, satMaterialCache[colorIdx])
            
            const angle = Math.random() * Math.PI * 2
            const radius = 10 + Math.random() * 45
            
            mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
            
            const speed = 4 + Math.random() * 6
            const vx = -Math.sin(angle) * speed
            const vz = Math.cos(angle) * speed

            satellites.push({
                mesh: mesh,
                velocity: new THREE.Vector3(vx, 0, vz),
                mass: 0.5 + Math.random() * 1.5
            })
            scene.add(mesh)
        }


        // ─── INTERACTION LOGIC (Gravity Well) ─────────────────────
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        const targetPoint = new THREE.Vector3(0, 0, 0)
        let mouseActive = false
        const mathematicalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

        const onPointerMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
            raycaster.setFromCamera(mouse, camera)
            raycaster.ray.intersectPlane(mathematicalPlane, targetPoint)
            mouseActive = true
        }

        const onMouseLeave = () => { mouseActive = false }

        window.addEventListener('mousemove', onPointerMove)
        window.addEventListener('mouseleave', onMouseLeave)
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0]
                mouse.x = (touch.clientX / window.innerWidth) * 2 - 1
                mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1
                raycaster.setFromCamera(mouse, camera)
                raycaster.ray.intersectPlane(mathematicalPlane, targetPoint)
                mouseActive = true
            }
        }, { passive: true })


        // ─── PHYSICS ANIMATION LOOP ────────────────────────────────
        const clock = new THREE.Clock()
        const G = 1200.0 // Gravitational Constant
        const maxWellDepth = -18
        const wellWidth = 16.0 

        const animate = () => {
            if (disposed) return
            animationId = requestAnimationFrame(animate)
            
            const dt = Math.min(clock.getDelta(), 0.05)
            const time = clock.getElapsedTime()

            if (mouseActive) {
                core.position.lerp(targetPoint, 0.1)
                core.scale.lerp(new THREE.Vector3(1,1,1), 0.1)
                core.visible = true
            } else {
                targetPoint.lerp(new THREE.Vector3(0, 0, 0), 0.02)
                core.position.lerp(targetPoint, 0.1)
                core.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1)
                if (core.scale.x < 0.05) core.visible = false
            }
            
            const wellCenter = core.position

            // 1. Deform Grid
            const posAttr = planeGeo.attributes.position
            for (let i = 0; i < originalVertices.length; i++) {
                const v = originalVertices[i]
                const dx = v.x - wellCenter.x
                const dz = v.z - wellCenter.z
                const distSq = dx*dx + dz*dz
                
                const dip = maxWellDepth * Math.exp(-distSq / (wellWidth * wellWidth))
                posAttr.setY(i, v.y + dip) 
            }
            posAttr.needsUpdate = true

            gridMesh.geometry.dispose()
            gridMesh.geometry = new THREE.WireframeGeometry(planeGeo)

            // 2. Satellite Physics
            satellites.forEach(sat => {
                const p = sat.mesh.position
                const rVector = new THREE.Vector3().subVectors(wellCenter, p)
                rVector.y = 0 
                const distSq = Math.max(rVector.lengthSq(), 5.0)
                const distance = Math.sqrt(distSq)
                
                rVector.normalize()
                const accelerationMag = G / distSq
                
                sat.velocity.x += rVector.x * accelerationMag * dt
                sat.velocity.z += rVector.z * accelerationMag * dt
                
                sat.velocity.multiplyScalar(0.9992) // Slight cosmic drag

                p.x += sat.velocity.x * dt
                p.z += sat.velocity.z * dt
                
                const dx = p.x - wellCenter.x
                const dz = p.z - wellCenter.z
                const dSq = dx*dx + dz*dz
                p.y = maxWellDepth * Math.exp(-dSq / (wellWidth * wellWidth)) + 0.5 

                if (distance < 2.5 || dSq > 75*75) {
                    const angle = Math.random() * Math.PI * 2
                    const r = 45 + Math.random() * 20
                    p.set(Math.cos(angle) * r, 0, Math.sin(angle) * r)
                    const s = 10 + Math.random() * 7
                    sat.velocity.set(-Math.sin(angle) * s, 0, Math.cos(angle) * s)
                }
            })

            // Camera drift
            camera.position.x = Math.sin(time * 0.15) * 4
            camera.position.z = 45 + Math.cos(time * 0.1) * 3
            camera.lookAt(0, 0, 0)

            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        const cleanup = () => {
            disposed = true
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', onPointerMove)
            window.removeEventListener('mouseleave', onMouseLeave)
            window.removeEventListener('touchmove', onPointerMove)
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
            planeGeo.dispose()
            wireframeGeo.dispose()
            planeMat.dispose()
            satGeo.dispose()
            satMaterialCache.forEach(m => m.dispose())
            coreGeo.dispose()
            coreMat.dispose()
            haloGeo.dispose()
            haloMat.dispose()
            renderer.dispose()
        }
        
        cleanupRef.current = cleanup
        return cleanup
    }, [])

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <div 
                ref={mountRef} 
                className="force-background-canvas"
                style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} 
            />
        </div>
    )
}
