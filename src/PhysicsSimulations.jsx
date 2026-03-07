import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

/* ═════════════════════════════════════════════
   PHYSICS SIMULATIONS — One per Unit
   Retro-styled interactive Three.js canvases
   ═════════════════════════════════════════════ */

/* ── Shared helpers ── */
function useSimCanvas(mountRef, buildScene) {
    useEffect(() => {
        const container = mountRef.current
        if (!container) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a0a18)

        const w = container.clientWidth
        const h = container.clientHeight
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(w, h)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        container.appendChild(renderer.domElement)

        // Retro grid floor
        const gridHelper = new THREE.GridHelper(60, 30, 0xe63946, 0x3d3d5c)
        gridHelper.material.opacity = 0.25
        gridHelper.material.transparent = true
        scene.add(gridHelper)

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.8))
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
        dirLight.position.set(10, 20, 10)
        scene.add(dirLight)

        const clock = new THREE.Clock()
        const cleanup = buildScene(scene, camera, renderer, clock)

        let animId
        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()
            if (cleanup && cleanup.update) cleanup.update(t)
            renderer.render(scene, camera)
        }
        animate()

        const onResize = () => {
            const w2 = container.clientWidth
            const h2 = container.clientHeight
            camera.aspect = w2 / h2
            camera.updateProjectionMatrix()
            renderer.setSize(w2, h2)
        }
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', onResize)
            if (cleanup && cleanup.dispose) cleanup.dispose()
            renderer.dispose()
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [mountRef, buildScene])
}

/* ══════════════════════════════════════════════
   UNIT 1: Push/Pull Force Playground
   ══════════════════════════════════════════════ */
function Sim1_ForcePushPull() {
    const mountRef = useRef(null)
    const [forceStrength, setForceStrength] = useState(5)
    const [hudData, setHudData] = useState({ velocity: 0, pushing: false })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 8, 18)
        camera.lookAt(0, 0, 0)

        // Objects to push
        const objects = []
        const colors = [0xe63946, 0x00d4ff, 0xfbbf24, 0xa855f7]
        const positions = [[-4, 0.7, 0], [-1.3, 0.7, 0], [1.3, 0.7, 0], [4, 0.7, 0]]

        positions.forEach((pos, i) => {
            const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2)
            const mat = new THREE.MeshStandardMaterial({
                color: colors[i],
                wireframe: false,
                metalness: 0.3,
                roughness: 0.4
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(...pos)
            mesh.userData = { startX: pos[0], velocity: 0 }
            scene.add(mesh)
            objects.push(mesh)

            // Wireframe overlay for retro feel
            const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 }))
            wire.position.copy(mesh.position)
            mesh.userData.wireframe = wire
            scene.add(wire)
        })

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 10),
            new THREE.MeshStandardMaterial({ color: 0x16213e, metalness: 0.5 })
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = 0.01
        scene.add(floor)

        // Force arrow indicators
        const arrowGroup = new THREE.Group()
        objects.forEach((obj, i) => {
            const arrow = new THREE.Mesh(
                new THREE.ConeGeometry(0.2, 0.8, 4),
                new THREE.MeshBasicMaterial({ color: 0x2dce89 })
            )
            arrow.rotation.z = -Math.PI / 2
            arrow.position.set(obj.position.x - 1.5, 1.5, 0)
            arrow.visible = false
            arrow.userData.objIndex = i
            arrowGroup.add(arrow)
        })
        scene.add(arrowGroup)

        let pushing = false
        let pushTime = 0

        return {
            update: (t) => {
                objects.forEach((obj, i) => {
                    const wire = obj.userData.wireframe
                    obj.rotation.y = t * 0.3 + i * 0.5
                    wire.position.copy(obj.position)
                    wire.rotation.copy(obj.rotation)

                    if (pushing) {
                        obj.userData.velocity = forceStrength * 0.015
                    }
                    obj.position.x += obj.userData.velocity
                    wire.position.x = obj.position.x
                    obj.userData.velocity *= 0.97

                    // Bounce back
                    if (obj.position.x > 8 || obj.position.x < -8) {
                        obj.userData.velocity *= -0.6
                    }
                })

                arrowGroup.children.forEach((arrow, i) => {
                    arrow.visible = pushing
                    if (pushing) {
                        arrow.position.x = objects[i].position.x - 1.5
                        arrow.scale.x = forceStrength / 5
                    }
                })

                if (pushing) {
                    pushTime += 0.016
                    if (pushTime > 0.5) {
                        pushing = false
                        pushTime = 0
                    }
                }

                // Update HUD (using first object as reference)
                setHudData({
                    velocity: Math.abs(objects[0].userData.velocity * 60).toFixed(1), // approx m/s
                    pushing: pushing
                })
            },
            push: () => { pushing = true; pushTime = 0 },
            reset: () => {
                objects.forEach((obj, i) => {
                    obj.position.x = positions[i][0]
                    obj.userData.velocity = 0
                    obj.userData.wireframe.position.x = positions[i][0]
                })
            }
        }
    }, [forceStrength])

    const controls = useRef({})
    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controls.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">⚡ FORCE PLAYGROUND</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Telemetry</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Status:</span>
                        <span className={`sim-data-value ${hudData.pushing ? 'warning' : 'neutral'}`}>
                            {hudData.pushing ? 'PUSHING' : 'IDLE'}
                        </span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Force App.:</span>
                        <span className="sim-data-value">{hudData.pushing ? forceStrength : 0} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Velocity:</span>
                        <span className="sim-data-value">{hudData.velocity} m/s</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                        <span className="sim-data-label" style={{ fontSize: '0.8rem' }}>Mass:</span>
                        <span className="sim-data-value neutral" style={{ fontSize: '0.8rem' }}>1.0 kg</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controls.current?.push?.()}>
                    ► PUSH
                </button>
                <button className="sim-btn" onClick={() => controls.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">FORCE:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="15" value={forceStrength}
                        onChange={(e) => setForceStrength(Number(e.target.value))}
                    />
                    <span className="sim-value">{forceStrength}N</span>
                </div>
            </div>
            <div className="sim-info">Click PUSH to apply force to the objects. Adjust the force slider to change the strength!</div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 2: Balanced/Unbalanced Forces — Seesaw
   ══════════════════════════════════════════════ */
function Sim2_Seesaw() {
    const mountRef = useRef(null)
    const [leftWeight, setLeftWeight] = useState(5)
    const [rightWeight, setRightWeight] = useState(5)
    const [hudData, setHudData] = useState({ leftTorque: 0, rightTorque: 0, netTorque: 0 })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 6, 16)
        camera.lookAt(0, 0, 0)

        // Fulcrum
        const fulcrum = new THREE.Mesh(
            new THREE.ConeGeometry(1.2, 2.5, 4),
            new THREE.MeshStandardMaterial({ color: 0xe63946, metalness: 0.4 })
        )
        fulcrum.position.y = -1
        scene.add(fulcrum)

        // Plank group
        const plankGroup = new THREE.Group()
        plankGroup.position.y = 0.3

        const plank = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.3, 2),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.3 })
        )
        plankGroup.add(plank)

        // Wireframe plank overlay
        const plankWire = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.3, 2),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })
        )
        plankGroup.add(plankWire)

        // Left weight
        const leftBox = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.3 })
        )
        leftBox.position.set(-5, 1, 0)
        plankGroup.add(leftBox)

        // Right weight
        const rightBox = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.5),
            new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.3 })
        )
        rightBox.position.set(5, 1, 0)
        plankGroup.add(rightBox)

        scene.add(plankGroup)

        // Balance indicator text (using a small marker)
        const markerGeo = new THREE.SphereGeometry(0.3, 8, 8)
        const markerMat = new THREE.MeshBasicMaterial({ color: 0x2dce89 })
        const marker = new THREE.Mesh(markerGeo, markerMat)
        marker.position.y = 3
        scene.add(marker)

        return {
            update: (t) => {
                const diff = leftWeight - rightWeight
                const targetTilt = diff * 0.03
                plankGroup.rotation.z += (targetTilt - plankGroup.rotation.z) * 0.05

                leftBox.scale.setScalar(0.5 + leftWeight * 0.12)
                rightBox.scale.setScalar(0.5 + rightWeight * 0.12)

                // Balanced indicator
                if (Math.abs(diff) < 0.5) {
                    marker.material.color.setHex(0x2dce89)
                } else {
                    marker.material.color.setHex(0xe63946)
                }
                marker.position.y = 3 + Math.sin(t * 3) * 0.2

                // Update HUD
                const distance = 5 // Distance from fulcrum
                const leftTq = leftWeight * distance
                const rightTq = rightWeight * distance
                setHudData({
                    leftTorque: leftTq.toFixed(1),
                    rightTorque: rightTq.toFixed(1),
                    netTorque: Math.abs(leftTq - rightTq).toFixed(1)
                })
            }
        }
    }, [leftWeight, rightWeight])

    useSimCanvas(mountRef, buildScene)

    const balanced = Math.abs(leftWeight - rightWeight) < 0.5

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">⚖️ BALANCE LAB</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Torque (F × d)</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Left Side:</span>
                        <span className="sim-data-value">{hudData.leftTorque} N·m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Right Side:</span>
                        <span className="sim-data-value">{hudData.rightTorque} N·m</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                        <span className="sim-data-label">Net Torque:</span>
                        <span className={`sim-data-value ${balanced ? 'neutral' : 'warning'}`}>{hudData.netTorque} N·m</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <div className="sim-slider-group">
                    <span className="sim-slider-label">LEFT:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="10" value={leftWeight}
                        onChange={(e) => setLeftWeight(Number(e.target.value))}
                    />
                    <span className="sim-value">{leftWeight}kg</span>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">RIGHT:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="10" value={rightWeight}
                        onChange={(e) => setRightWeight(Number(e.target.value))}
                    />
                    <span className="sim-value">{rightWeight}kg</span>
                </div>
            </div>
            <div className="sim-info">
                {balanced ? '✅ BALANCED! Net Force = 0' : `⚠️ UNBALANCED! Net Force = ${Math.abs(leftWeight - rightWeight)}N ${leftWeight > rightWeight ? '← LEFT' : '→ RIGHT'}`}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 3: Inertia Lab — Coin & Card Experiment
   ══════════════════════════════════════════════ */
function Sim3_InertiaLab() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})
    const [hudData, setHudData] = useState({ state: "STATE 1/3: REST", detail: "Coin & Card are at rest (1st Law)" })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 8, 12)
        camera.lookAt(0, 1, 0)

        // Glass/tumbler
        const glassGeo = new THREE.CylinderGeometry(1.2, 1, 3, 16, 1, true)
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.2,
            metalness: 0.1,
            roughness: 0.1
        })
        const glass = new THREE.Mesh(glassGeo, glassMat)
        glass.position.y = 1.5
        scene.add(glass)

        // Glass wireframe
        const glassWire = new THREE.Mesh(glassGeo, new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.4 }))
        glassWire.position.copy(glass.position)
        scene.add(glassWire)

        // Card on top
        const card = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.08, 2),
            new THREE.MeshStandardMaterial({ color: 0xe63946 })
        )
        card.position.set(0, 3.1, 0)
        scene.add(card)

        // Coin on card
        const coin = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 })
        )
        coin.position.set(0, 3.3, 0)
        scene.add(coin)

        // Table surface
        const table = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.3, 5),
            new THREE.MeshStandardMaterial({ color: 0x16213e, metalness: 0.3 })
        )
        table.position.y = -0.15
        scene.add(table)

        let flicked = false
        let cardVel = 0
        let coinFalling = false
        let coinVelY = 0

        const resetState = () => {
            flicked = false
            coinFalling = false
            cardVel = 0
            coinVelY = 0
            card.position.set(0, 3.1, 0)
            coin.position.set(0, 3.3, 0)
            card.material.color.setHex(0xe63946)
        }

        return {
            update: (t) => {
                if (flicked) {
                    card.position.x += cardVel
                    cardVel *= 0.98

                    // Coin drops after card moves away
                    if (Math.abs(card.position.x) > 1.5 && !coinFalling) {
                        coinFalling = true
                    }

                    if (coinFalling) {
                        coinVelY -= 0.008
                        coin.position.y += coinVelY

                        // Land inside glass
                        if (coin.position.y < 1.2) {
                            coin.position.y = 1.2
                            coinVelY = 0
                            coin.rotation.x += 0.01 // Settle
                            setHudData({ state: "STATE 3/3: GRAVITY WIN", detail: "Inertia kept it horizontal; Gravity pulled it down." })
                        } else {
                            // Falling
                            setHudData({ state: "STATE 2/3: INERTIA", detail: "Card moves fast. Coin stays put (Inertia)." })
                        }
                    }
                } else {
                    // Idle wobble
                    coin.rotation.y = t * 0.5
                }
            },
            flick: () => {
                if (!flicked) {
                    flicked = true
                    cardVel = 0.35
                    card.material.color.setHex(0x3d3d5c)
                    setHudData({ state: "STATE 2/3: INERTIA", detail: "Card is pushed. Coin resists horizontal motion." })
                }
            },
            reset: () => {
                resetState()
                setHudData({ state: "STATE 1/3: REST", detail: "Coin & Card are at rest (1st Law)" })
            }
        }
    }, [])

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">📐 INERTIA LAB</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel bottom-center" style={{ textAlign: 'center' }}>
                    <h4 className="sim-overlay-title" style={{ color: 'var(--accent-purple)' }}>{hudData.state}</h4>
                    <div className="sim-data-value" style={{ fontSize: '0.9rem', color: 'var(--text-main)', textShadow: 'none' }}>
                        {hudData.detail}
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controlsRef.current?.flick?.()}>
                    ► FLICK CARD
                </button>
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
            </div>
            <div className="sim-info">Flick the card! The coin stays due to INERTIA and falls into the glass. 🎯</div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 4: Mass Comparison — Same Force, Different Masses
   ══════════════════════════════════════════════ */
function Sim4_MassCompare() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 6, 16)
        camera.lookAt(0, 0, 0)

        // Light object (small)
        const lightObj = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.3 })
        )
        lightObj.position.set(-4, 0.5, -1)
        scene.add(lightObj)

        const lightWire = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })
        )
        lightWire.position.copy(lightObj.position)
        scene.add(lightWire)

        // Heavy object (big)
        const heavyObj = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 2.2, 2.2),
            new THREE.MeshStandardMaterial({ color: 0xe63946, metalness: 0.3 })
        )
        heavyObj.position.set(-4, 1.1, 2)
        scene.add(heavyObj)

        const heavyWire = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 2.2, 2.2),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })
        )
        heavyWire.position.copy(heavyObj.position)
        scene.add(heavyWire)

        // Labels (3D text placeholders — use small markers)
        const lightLabel = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        )
        lightLabel.position.set(-4, 1.6, -1)
        scene.add(lightLabel)

        const heavyLabel = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xe63946 })
        )
        heavyLabel.position.set(-4, 2.8, 2)
        scene.add(heavyLabel)

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 10),
            new THREE.MeshStandardMaterial({ color: 0x16213e })
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = 0.01
        scene.add(floor)

        let lightVel = 0
        let heavyVel = 0
        const FORCE = 10 // Same force applied to both
        const lightMass = 1
        const heavyMass = 5

        const resetState = () => {
            lightVel = 0
            heavyVel = 0
            lightObj.position.x = -4
            heavyObj.position.x = -4
            lightWire.position.x = -4
            heavyWire.position.x = -4
            setHudData({ lightAcc: "0.0", heavyAcc: "0.0", force: 0 })
        }

        return {
            update: () => {
                lightObj.position.x += lightVel
                heavyObj.position.x += heavyVel
                lightWire.position.x = lightObj.position.x
                heavyWire.position.x = heavyObj.position.x
                lightLabel.position.x = lightObj.position.x
                heavyLabel.position.x = heavyObj.position.x

                lightVel *= 0.99
                heavyVel *= 0.99

                // Bounce
                if (lightObj.position.x > 8) { lightVel *= -0.5; lightObj.position.x = 8 }
                if (heavyObj.position.x > 8) { heavyVel *= -0.5; heavyObj.position.x = 8 }
            },
            applyForce: () => {
                // F = ma → a = F/m
                const lAcc = FORCE / lightMass
                const hAcc = FORCE / heavyMass
                lightVel = lAcc * 0.01
                heavyVel = hAcc * 0.01
                setHudData({ lightAcc: lAcc.toFixed(1), heavyAcc: hAcc.toFixed(1), force: FORCE })
            },
            reset: resetState
        }
    }, [])

    const [hudData, setHudData] = useState({ lightAcc: "0.0", heavyAcc: "0.0", force: 0 })

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">⚡ MASS vs INERTIA</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel right-side">
                    <h4 className="sim-overlay-title">F = m × a</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Applied Force:</span>
                        <span className="sim-data-value neutral">{hudData.force} N</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                        <span className="sim-data-label" style={{ color: '#00d4ff' }}>Light Obj (1kg):</span>
                        <span className="sim-data-value" style={{ color: '#00d4ff' }}>{hudData.lightAcc} m/s²</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#e63946' }}>Heavy Obj (5kg):</span>
                        <span className="sim-data-value" style={{ color: '#e63946' }}>{hudData.heavyAcc} m/s²</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controlsRef.current?.applyForce?.()}>
                    ► APPLY SAME FORCE
                </button>
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
            </div>
            <div className="sim-info">🔵 Light (1kg) vs 🔴 Heavy (5kg) — Same 10N force. Watch the lighter object accelerate faster! (a = F/m)</div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 5: F=ma Visual Calculator
   ══════════════════════════════════════════════ */
function Sim5_FmaCalculator() {
    const mountRef = useRef(null)
    const [mass, setMass] = useState(3)
    const [acceleration, setAcceleration] = useState(4)

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 6, 18)
        camera.lookAt(0, 0, 0)

        // Main object that accelerates
        const obj = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x2dce89, metalness: 0.3 })
        )
        obj.position.set(-6, 0.75, 0)
        scene.add(obj)

        const objWire = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.5),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2 })
        )
        objWire.position.copy(obj.position)
        scene.add(objWire)

        // Force arrow
        const arrowBody = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: 0xe63946 })
        )
        const arrowHead = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.6, 4),
            new THREE.MeshBasicMaterial({ color: 0xe63946 })
        )
        arrowHead.rotation.z = -Math.PI / 2

        const arrowGroup = new THREE.Group()
        arrowGroup.add(arrowBody)
        arrowGroup.add(arrowHead)
        arrowGroup.position.set(-6, 2.5, 0)
        scene.add(arrowGroup)

        // Track
        const track = new THREE.Mesh(
            new THREE.BoxGeometry(16, 0.05, 2),
            new THREE.MeshStandardMaterial({ color: 0x3d3d5c })
        )
        track.position.y = 0.02
        scene.add(track)

        // Track markers
        for (let i = -7; i <= 7; i += 2) {
            const marker = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.1, 2),
                new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.3 })
            )
            marker.position.set(i, 0.05, 0)
            scene.add(marker)
        }

        return {
            update: (t) => {
                const force = mass * acceleration
                const scale = Math.min(force / 5, 4)

                obj.scale.setScalar(0.5 + mass * 0.15)
                objWire.scale.copy(obj.scale)

                // Animate moving back and forth based on acceleration
                const speed = acceleration * 0.3
                obj.position.x = Math.sin(t * speed) * 5
                objWire.position.x = obj.position.x

                // Arrow scales with force
                arrowBody.scale.x = scale
                arrowHead.position.x = scale * 0.5 + 0.3
                arrowGroup.position.x = obj.position.x

                // Color intensity based on force
                const intensity = Math.min(force / 30, 1)
                obj.material.emissive = new THREE.Color(0x2dce89)
                obj.material.emissiveIntensity = intensity * 0.5
            }
        }
    }, [mass, acceleration])

    useSimCanvas(mountRef, buildScene)

    const force = mass * acceleration

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">📊 F = ma CALCULATOR</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* Floating Math Overlay */}
                <div className="sim-math-overlay">
                    <span style={{ color: 'var(--text-muted)' }}>F =</span> {mass}kg <span style={{ color: 'var(--text-muted)' }}>×</span> {acceleration}m/s²
                </div>
            </div>
            <div className="simulation-controls">
                <div className="sim-slider-group">
                    <span className="sim-slider-label">MASS:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="10" value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                    />
                    <span className="sim-value">{mass}kg</span>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">ACCEL:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="10" value={acceleration}
                        onChange={(e) => setAcceleration(Number(e.target.value))}
                    />
                    <span className="sim-value">{acceleration}m/s²</span>
                </div>
            </div>
            <div className="sim-info">
                F = {mass}kg × {acceleration}m/s² = <strong>{force}N</strong> — Watch the object move!
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 6: Rocket Launch — Action & Reaction
   ══════════════════════════════════════════════ */
function Sim6_RocketLaunch() {
    const mountRef = useRef(null)
    const [thrust, setThrust] = useState(5)
    const controlsRef = useRef({})
    const [hudData, setHudData] = useState({ alt: 0, vel: 0, thrustNet: 0, weight: 1.0 })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 8, 20)
        camera.lookAt(0, 4, 0)

        // Rocket body
        const rocketGroup = new THREE.Group()

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 1.2, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0xe63946, metalness: 0.4 })
        )
        rocketGroup.add(body)

        // Nose cone
        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 1.5, 8),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
        )
        nose.position.y = 2.75
        rocketGroup.add(nose)

        // Fins
        const finGeo = new THREE.BoxGeometry(0.15, 1.5, 1)
        const finMat = new THREE.MeshStandardMaterial({ color: 0x00d4ff })
        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(finGeo, finMat)
            fin.position.y = -1.5
            fin.rotation.y = (Math.PI / 2) * i
            fin.position.x = Math.cos((Math.PI / 2) * i) * 1
            fin.position.z = Math.sin((Math.PI / 2) * i) * 1
            rocketGroup.add(fin)
        }

        // Wireframe overlay
        const bodyWire = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 1.2, 4, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 })
        )
        rocketGroup.add(bodyWire)

        rocketGroup.position.set(0, 2, 0)
        scene.add(rocketGroup)

        // Exhaust particles
        const particles = []
        const pGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3) // Pixel-style squares
        const pColors = [0xe63946, 0xfbbf24, 0xf97316]

        for (let i = 0; i < 40; i++) {
            const mat = new THREE.MeshBasicMaterial({
                color: pColors[Math.floor(Math.random() * pColors.length)],
                transparent: true
            })
            const p = new THREE.Mesh(pGeo, mat)
            p.visible = false
            p.userData = {
                velX: (Math.random() - 0.5) * 0.1,
                velY: -(0.15 + Math.random() * 0.2),
                life: 0,
                maxLife: 20 + Math.random() * 30
            }
            scene.add(p)
            particles.push(p)
        }

        // Launch pad
        const pad = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.3, 4),
            new THREE.MeshStandardMaterial({ color: 0x3d3d5c })
        )
        pad.position.y = -0.15
        scene.add(pad)

        let launched = false
        let rocketVel = 0

        const launchRocket = () => {
            if (!launched) {
                launched = true
                rocketVel = 0
                rocketGroup.position.y = 2
            }
        }

        const resetRocket = () => {
            launched = false
            rocketVel = 0
            rocketGroup.position.y = 2
            particles.forEach(p => { p.visible = false })
        }

        return {
            update: (t) => {
                let currentAlt = 0
                let currentVel = 0
                let netF = 0

                if (launched) {
                    // Action: exhaust goes down, Reaction: rocket goes up
                    netF = thrust - 1.0 // 1.0 acts as gravity/weight threshold

                    if (netF > 0) {
                        rocketVel += netF * 0.0005
                    } else {
                        rocketVel -= 0.005 // Fall back down if thrust < weight
                    }

                    rocketGroup.position.y += rocketVel

                    // Reset position if too high
                    if (rocketGroup.position.y > 30) {
                        resetRocket()
                        return
                    }

                    // Crash back down
                    if (rocketGroup.position.y < 2) {
                        rocketGroup.position.y = 2
                        rocketVel = 0
                        if (thrust < 1.0) launched = false
                    }

                    // Exhaust particles (ACTION - going downward)
                    if (netF > 0) {
                        particles.forEach(p => {
                            if (p.visible) {
                                p.userData.life++
                                p.position.x += p.userData.velX
                                p.position.y += p.userData.velY
                                p.material.opacity = 1 - (p.userData.life / p.userData.maxLife)
                                p.scale.setScalar(1 - (p.userData.life / p.userData.maxLife) * 0.5)

                                if (p.userData.life > p.userData.maxLife) {
                                    p.visible = false
                                }
                            } else if (Math.random() < 0.3) {
                                p.visible = true
                                p.userData.life = 0
                                p.position.set(
                                    rocketGroup.position.x + (Math.random() - 0.5) * 0.8,
                                    rocketGroup.position.y - 2.5,
                                    (Math.random() - 0.5) * 0.8
                                )
                                p.userData.velX = (Math.random() - 0.5) * 0.08
                                p.userData.velY = -(0.1 + Math.random() * thrust * 0.03)
                                p.material.opacity = 1
                                p.scale.setScalar(1)
                            }
                        })

                        // Rocket wobble
                        rocketGroup.rotation.z = Math.sin(t * 10) * 0.02
                    } else {
                        // Idle
                        rocketGroup.position.y = 2 + Math.sin(t * 2) * 0.1
                    }
                }

                // Keep HUD synced
                currentAlt = Math.max(0, rocketGroup.position.y - 2)
                currentVel = rocketVel * 60 // scale for viewing
                setHudData({
                    alt: currentAlt.toFixed(1),
                    vel: currentVel.toFixed(1),
                    thrustNet: launched ? thrust.toFixed(1) : "0.0",
                    weight: "1.0"
                })
            },
            launch: launchRocket,
            reset: resetRocket
        }
    }, [thrust])

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">🔄 ROCKET LAUNCH</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Mission Control</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Altitude:</span>
                        <span className="sim-data-value">{hudData.alt} m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Velocity:</span>
                        <span className="sim-data-value">{hudData.vel} m/s</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                        <span className="sim-data-label" style={{ fontSize: '0.8rem', color: '#00d4ff' }}>↑ Thrust (Action):</span>
                        <span className="sim-data-value" style={{ fontSize: '0.8rem', color: '#00d4ff' }}>{hudData.thrustNet} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ fontSize: '0.8rem', color: '#e63946' }}>↓ Weight (Gravity):</span>
                        <span className="sim-data-value" style={{ fontSize: '0.8rem', color: '#e63946' }}>{hudData.weight} N</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controlsRef.current?.launch?.()}>
                    🚀 LAUNCH!
                </button>
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">THRUST:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="15" value={thrust}
                        onChange={(e) => setThrust(Number(e.target.value))}
                    />
                    <span className="sim-value">{thrust}</span>
                </div>
            </div>
            <div className="sim-info">
                ACTION: Exhaust fires DOWN ↓ | REACTION: Rocket goes UP ↑ — Equal & opposite forces!
            </div>
        </div>
    )
}

/* ── Export map ── */
const SimulationMap = {
    1: Sim1_ForcePushPull,
    2: Sim2_Seesaw,
    3: Sim3_InertiaLab,
    4: Sim4_MassCompare,
    5: Sim5_FmaCalculator,
    6: Sim6_RocketLaunch
}

export default function PhysicsSimulation({ unitNumber }) {
    const SimComponent = SimulationMap[unitNumber]
    if (!SimComponent) return null
    return <SimComponent />
}
