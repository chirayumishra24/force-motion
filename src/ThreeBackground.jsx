import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * RETRO VINTAGE THREE.JS BACKGROUNDS
 * Wireframe models with neon glow on dark backgrounds
 * Tron-style grid floors, pixel particles
 */
export default function ThreeBackground({ activeUnit = 1 }) {
    const mountRef = useRef(null)
    const cleanupRef = useRef(null)

    useEffect(() => {
        const container = mountRef.current
        if (!container) return

        // Clean up previous instance
        if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
        }

        let animationId
        let disposed = false

        try {
            // ─── Shared Scene Setup ─────────────────────────────
            const scene = new THREE.Scene()
            scene.background = new THREE.Color(0x1a1a2e)
            scene.fog = new THREE.FogExp2(0x1a1a2e, 0.008)

            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
            camera.position.set(0, 15, 45)

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.setClearColor(0x1a1a2e, 0)
            container.appendChild(renderer.domElement)

            // Lights with retro feel
            const ambLight = new THREE.AmbientLight(0x1a1a2e, 2.0)
            scene.add(ambLight)

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
            dirLight.position.set(20, 40, 20)
            scene.add(dirLight)

            const neonRed = new THREE.PointLight(0xe63946, 3, 50)
            neonRed.position.set(-10, 10, 10)
            scene.add(neonRed)

            const neonCyan = new THREE.PointLight(0x00d4ff, 3, 50)
            neonCyan.position.set(10, 10, -10)
            scene.add(neonCyan)

            const pointLight = new THREE.PointLight(0x00ffcc, 4, 50)
            scene.add(pointLight)

            // Interactive Variables
            const mouse = new THREE.Vector2(-999, -999)
            const targetMouse = new THREE.Vector2(-999, -999)
            const clock = new THREE.Clock()
            const updatables = []

            // ─── RETRO GRID FLOOR ───────────────────
            const addRetroGrid = () => {
                // Build grid with LineSegments instead of GridHelper (avoids material.opacity issue)
                const size = 100
                const divisions = 40
                const half = size / 2
                const step = size / divisions
                const vertices1 = []
                const vertices2 = []

                for (let i = 0; i <= divisions; i++) {
                    const pos = -half + i * step
                    vertices1.push(pos, 0, -half, pos, 0, half)
                    vertices1.push(-half, 0, pos, half, 0, pos)
                }

                for (let i = 0; i <= 20; i++) {
                    const pos = -half + i * (size / 20)
                    vertices2.push(pos, 0, -half, pos, 0, half)
                    vertices2.push(-half, 0, pos, half, 0, pos)
                }

                const geo1 = new THREE.BufferGeometry()
                geo1.setAttribute('position', new THREE.Float32BufferAttribute(vertices1, 3))
                const grid1 = new THREE.LineSegments(geo1, new THREE.LineBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.12 }))
                grid1.position.y = -8
                scene.add(grid1)

                const geo2 = new THREE.BufferGeometry()
                geo2.setAttribute('position', new THREE.Float32BufferAttribute(vertices2, 3))
                const grid2 = new THREE.LineSegments(geo2, new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.06 }))
                grid2.position.y = -8.1
                scene.add(grid2)

                updatables.push(() => {
                    grid1.rotation.y += 0.0005
                    grid2.rotation.y -= 0.0003
                })
            }

            // ─── Wireframe material helper ───
            const wireframeMat = (color, opacity = 0.6) =>
                new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })

            const neonMat = (color) =>
                new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.2 })

            // ─── Unit-Specific Models ───────────────────────────

            const unit = typeof activeUnit === 'number' ? activeUnit : 1

            if (unit === 2) {
                camera.position.set(0, 0, 40)
                addRetroGrid()

                const fulcrum = new THREE.Mesh(
                    new THREE.ConeGeometry(2, 4, 4),
                    neonMat(0xe63946)
                )
                fulcrum.position.y = -6
                scene.add(fulcrum)
                scene.add(new THREE.Mesh(new THREE.ConeGeometry(2, 4, 4), wireframeMat(0xff6b7a)))
                    .position.copy(fulcrum.position)

                const plankGroup = new THREE.Group()
                plankGroup.position.y = -4
                plankGroup.add(new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 3), neonMat(0xfbbf24)))
                plankGroup.add(new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 3), wireframeMat(0xfbbf24)))

                const boxLeft = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), wireframeMat(0x00d4ff))
                boxLeft.position.set(-8, 1.5, 0)
                plankGroup.add(boxLeft)

                const boxRight = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), wireframeMat(0xa855f7))
                boxRight.position.set(8, 1.5, 0)
                plankGroup.add(boxRight)
                scene.add(plankGroup)

                updatables.push(() => {
                    let targetTilt = 0
                    if (mouse.x !== -999) targetTilt = mouse.x * 0.2
                    plankGroup.rotation.z += (targetTilt - plankGroup.rotation.z) * 0.05
                })

            } else if (unit === 3) {
                camera.position.set(0, 5, 45)
                addRetroGrid()

                const pivot = new THREE.Group()
                pivot.position.y = 15
                scene.add(pivot)

                pivot.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 20), wireframeMat(0x3d3d5c)))
                    .position.y = -10

                const bob = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), neonMat(0x00d4ff))
                bob.position.y = -20
                pivot.add(bob)
                pivot.add(new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), wireframeMat(0x00d4ff)))
                    .position.y = -20

                updatables.push((t) => {
                    let targetSwing = Math.sin(t) * 0.5
                    if (mouse.x !== -999) targetSwing = mouse.x * 1.5
                    pivot.rotation.z += (targetSwing - pivot.rotation.z) * 0.02
                })

            } else if (unit === 4) {
                camera.position.set(0, 5, 40)
                camera.lookAt(0, 0, 0)
                addRetroGrid()

                scene.add(new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), neonMat(0xe63946)))
                scene.add(new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), wireframeMat(0xe63946)))

                const heavyGroup = new THREE.Group()
                const heavy = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), wireframeMat(0xa855f7, 0.7))
                heavy.position.x = 10
                heavyGroup.add(heavy)
                scene.add(heavyGroup)

                const lightGroup = new THREE.Group()
                const lightMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wireframeMat(0x00d4ff, 0.8))
                lightMesh.position.x = 4
                lightGroup.add(lightMesh)
                scene.add(lightGroup)

                updatables.push((t) => {
                    heavyGroup.rotation.y = t * 0.2
                    lightGroup.rotation.y = t * 2.0
                })

            } else if (unit === 5) {
                camera.position.set(0, 10, 45)
                addRetroGrid()

                const track = new THREE.Mesh(
                    new THREE.TorusGeometry(15, 0.15, 8, 50),
                    wireframeMat(0x2dce89, 0.4)
                )
                track.rotation.x = Math.PI / 2
                scene.add(track)

                const particle = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 1.5, 1.5),
                    neonMat(0x2dce89)
                )
                scene.add(particle)

                const arrow = new THREE.Mesh(
                    new THREE.ConeGeometry(0.5, 2, 4),
                    new THREE.MeshBasicMaterial({ color: 0xe63946 })
                )
                scene.add(arrow)

                let angle = 0
                updatables.push((t) => {
                    let speed = 0.05
                    if (mouse.y !== -999) speed = 0.05 + Math.max(0, mouse.y * 0.1)
                    angle += speed
                    particle.position.set(Math.cos(angle) * 15, 0, Math.sin(angle) * 15)
                    particle.rotation.x += 0.03
                    particle.rotation.y += 0.05
                    arrow.position.set(Math.cos(angle) * 13.5, 0, Math.sin(angle) * 13.5)
                    arrow.lookAt(0, 0, 0)
                    arrow.rotateX(-Math.PI / 2)
                    arrow.scale.set(1, speed * 20, 1)
                })

            } else if (unit === 6) {
                camera.position.set(0, 0, 40)
                addRetroGrid()

                const ship = new THREE.Group()
                scene.add(ship)
                ship.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 3, 8, 6), neonMat(0xe63946)))
                ship.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 3, 8, 6), wireframeMat(0xff6b7a, 0.4)))

                const exhaust = new THREE.Group()
                const exGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
                const exColors = [0xe63946, 0xfbbf24, 0xf97316]

                for (let i = 0; i < 25; i++) {
                    const color = exColors[Math.floor(Math.random() * 3)]
                    const p = new THREE.Mesh(exGeo, new THREE.MeshBasicMaterial({ color }))
                    p.userData = { speed: 0.2 + Math.random() * 0.3 }
                    exhaust.add(p)
                }
                exhaust.position.y = -5
                ship.add(exhaust)

                updatables.push((t) => {
                    ship.position.y = Math.sin(t * 3) * 2
                    exhaust.children.forEach(p => {
                        p.position.y -= p.userData.speed
                        p.scale.setScalar(Math.max(0.1, 1 - Math.abs(p.position.y) / 5))
                        if (p.position.y < -5) {
                            p.position.y = 0
                            p.position.x = (Math.random() - 0.5) * 2
                            p.position.z = (Math.random() - 0.5) * 2
                        }
                    })
                })

            } else {
                // Unit 1 (default)
                camera.position.set(0, 35, 45)
                camera.lookAt(0, -5, 0)
                addRetroGrid()

                const particles = new THREE.Group()
                const geo = new THREE.IcosahedronGeometry(1.5, 0)
                const colors = [0xe63946, 0x00d4ff, 0xfbbf24, 0x2dce89, 0xa855f7]

                for (let i = 0; i < 10; i++) {
                    const mesh = new THREE.Mesh(geo, wireframeMat(colors[i % 5], 0.5))
                    mesh.position.set((Math.random() - 0.5) * 40, Math.random() * 20, (Math.random() - 0.5) * 40)
                    particles.add(mesh)
                    updatables.push((t) => {
                        mesh.position.y += Math.sin(t * 2 + i) * 0.03
                        mesh.rotation.x += 0.008
                        mesh.rotation.y += 0.012
                    })
                }
                scene.add(particles)
            }

            // ─── Interaction & Animation ─────────────────────

            const onPointerMove = (e) => {
                let clientX = e.clientX, clientY = e.clientY
                if (e.touches) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY }
                targetMouse.x = (clientX / window.innerWidth) * 2 - 1
                targetMouse.y = -(clientY / window.innerHeight) * 2 + 1
            }
            const onLeave = () => targetMouse.set(-999, -999)

            window.addEventListener('mousemove', onPointerMove)
            window.addEventListener('mouseleave', onLeave)
            window.addEventListener('touchmove', onPointerMove, { passive: true })

            const animate = () => {
                if (disposed) return
                animationId = requestAnimationFrame(animate)
                const t = clock.getElapsedTime()

                mouse.lerp(targetMouse, 0.1)
                camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05
                updatables.forEach(fn => fn(t))

                if (mouse.x !== -999) {
                    pointLight.position.x = mouse.x * 20
                    pointLight.position.y = mouse.y * 20
                }

                neonRed.intensity = 2 + Math.sin(t * 2) * 1
                neonCyan.intensity = 2 + Math.cos(t * 2) * 1

                renderer.render(scene, camera)
            }
            animate()

            // ─── Resize ──────────────────────────────────────
            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
            }
            window.addEventListener('resize', handleResize)

            // ─── Cleanup ──────────────────────────────────────
            const cleanup = () => {
                disposed = true
                cancelAnimationFrame(animationId)
                window.removeEventListener('resize', handleResize)
                window.removeEventListener('mousemove', onPointerMove)
                window.removeEventListener('mouseleave', onLeave)
                window.removeEventListener('touchmove', onPointerMove)
                if (container && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement)
                }
                renderer.dispose()
            }

            cleanupRef.current = cleanup
            return cleanup

        } catch (err) {
            console.warn('ThreeBackground init error:', err)
        }
    }, [activeUnit])

    return (
        <div
            ref={mountRef}
            style={{ position: 'absolute', inset: 0, zIndex: 0 }}
            title={`Interactive Physics Model for Unit ${activeUnit}`}
        />
    )
}
