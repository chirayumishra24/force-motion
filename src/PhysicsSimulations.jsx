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
   UNIT 1: Force Effects Lab (PhET-style)
   Demonstrates: push/pull, speed change, direction
   change, and shape change with visible force arrows
   ══════════════════════════════════════════════ */
function Sim1_ForcePushPull() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})
    const [friction, setFriction] = useState(0.3)
    const [appliedForce, setAppliedForce] = useState(0)
    const [hudData, setHudData] = useState({
        velocity: '0.0', acceleration: '0.0', netForce: '0.0',
        frictionForce: '0.0', status: 'AT REST'
    })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 8, 18)
        camera.lookAt(0, 1, 0)

        // — Ground surface —
        const ground = new THREE.Mesh(
            new THREE.BoxGeometry(30, 0.3, 8),
            new THREE.MeshStandardMaterial({ color: 0x16213e, metalness: 0.5, roughness: 0.5 })
        )
        ground.position.y = -0.15
        scene.add(ground)

        // Surface texture lines
        for (let x = -14; x <= 14; x += 1) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(0.03, 0.01, 8),
                new THREE.MeshBasicMaterial({ color: 0x3d3d5c, transparent: true, opacity: 0.3 })
            )
            line.position.set(x, 0.02, 0)
            scene.add(line)
        }

        // Distance markers with numbers
        for (let x = -12; x <= 12; x += 2) {
            const tick = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.08, 0.5),
                new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.5 })
            )
            tick.position.set(x, 0.05, -3)
            scene.add(tick)
        }

        // — Crate (main object, mass = 2kg) —
        const crateGroup = new THREE.Group()
        const crate = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1.8, 1.8),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.3, roughness: 0.4 })
        )
        crateGroup.add(crate)

        // Crate wireframe
        const crateWire = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1.8, 1.8),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 })
        )
        crateGroup.add(crateWire)

        // Cross marking on crate
        const crossH = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.08, 0.08),
            new THREE.MeshBasicMaterial({ color: 0x8b6914 })
        )
        crossH.position.z = 0.91
        crateGroup.add(crossH)
        const crossV = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 1.2, 0.08),
            new THREE.MeshBasicMaterial({ color: 0x8b6914 })
        )
        crossV.position.z = 0.91
        crateGroup.add(crossV)

        crateGroup.position.set(0, 0.9, 0)
        scene.add(crateGroup)

        // — Spring (shape deformation demo) —
        const springGroup = new THREE.Group()
        const springCoils = []
        for (let i = 0; i < 8; i++) {
            const coil = new THREE.Mesh(
                new THREE.TorusGeometry(0.3, 0.06, 8, 12),
                new THREE.MeshStandardMaterial({ color: 0x2dce89, metalness: 0.6, roughness: 0.3 })
            )
            coil.position.x = i * 0.35 - 1.2
            coil.rotation.y = Math.PI / 2
            springGroup.add(coil)
            springCoils.push(coil)
        }
        // Spring end plates
        const plate1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x10B981 })
        )
        plate1.position.x = -1.6
        springGroup.add(plate1)
        const plate2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x10B981 })
        )
        plate2.position.x = 1.6
        springGroup.add(plate2)

        springGroup.position.set(0, 0.5, 3.5)
        scene.add(springGroup)

        // Spring label marker
        const springMarker = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x2dce89 })
        )
        springMarker.position.set(0, 1.3, 3.5)
        scene.add(springMarker)

        // — Force Arrows —
        function createArrow(color, yPos) {
            const group = new THREE.Group()
            const shaft = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.15, 0.15),
                new THREE.MeshBasicMaterial({ color })
            )
            group.add(shaft)
            const head = new THREE.Mesh(
                new THREE.ConeGeometry(0.2, 0.5, 4),
                new THREE.MeshBasicMaterial({ color })
            )
            head.rotation.z = -Math.PI / 2
            head.position.x = 0.75
            group.add(head)
            group.position.y = yPos
            group.visible = false
            scene.add(group)
            return { group, shaft, head }
        }

        const appliedArrow = createArrow(0x00d4ff, 2.5)    // Blue = applied
        const frictionArrow = createArrow(0xe63946, 2.0)    // Red = friction
        const netArrow = createArrow(0x2dce89, 3.0)         // Green = net

        // — Physics state —
        const mass = 2
        let velocity = 0
        let posX = 0
        let springCompression = 0

        return {
            update: (t) => {
                const fApplied = appliedForce
                const speed = Math.abs(velocity)

                // Friction force (opposes motion or applied force)
                let fFriction = 0
                if (speed > 0.001) {
                    fFriction = -Math.sign(velocity) * friction * mass * 9.8
                } else if (Math.abs(fApplied) > 0) {
                    const staticFriction = friction * mass * 9.8
                    if (Math.abs(fApplied) <= staticFriction) {
                        fFriction = -fApplied
                    } else {
                        fFriction = -Math.sign(fApplied) * friction * mass * 9.8
                    }
                }

                const fNet = fApplied + fFriction
                const acc = fNet / mass

                velocity += acc * 0.016
                // Clamp velocity to prevent runaway
                velocity = Math.max(-8, Math.min(8, velocity))

                // Stop if nearly zero and no net force
                if (Math.abs(velocity) < 0.01 && Math.abs(fNet) < 0.1) {
                    velocity = 0
                }

                posX += velocity * 0.016 * 3

                // Boundaries
                if (posX > 12) { posX = 12; velocity = -velocity * 0.3 }
                if (posX < -12) { posX = -12; velocity = -velocity * 0.3 }

                crateGroup.position.x = posX

                // Crate rotation based on velocity for visual feedback
                crate.rotation.z = -velocity * 0.02
                crateWire.rotation.z = crate.rotation.z

                // — Update force arrows —
                // Applied force arrow
                if (Math.abs(fApplied) > 0.1) {
                    appliedArrow.group.visible = true
                    appliedArrow.group.position.x = posX
                    const scale = Math.abs(fApplied) / 5
                    appliedArrow.shaft.scale.x = scale
                    appliedArrow.head.position.x = scale * 0.5 + 0.25
                    if (fApplied < 0) {
                        appliedArrow.group.rotation.y = Math.PI
                    } else {
                        appliedArrow.group.rotation.y = 0
                    }
                } else {
                    appliedArrow.group.visible = false
                }

                // Friction arrow
                if (Math.abs(fFriction) > 0.1) {
                    frictionArrow.group.visible = true
                    frictionArrow.group.position.x = posX
                    const fScale = Math.abs(fFriction) / 5
                    frictionArrow.shaft.scale.x = fScale
                    frictionArrow.head.position.x = fScale * 0.5 + 0.25
                    if (fFriction < 0) {
                        frictionArrow.group.rotation.y = Math.PI
                    } else {
                        frictionArrow.group.rotation.y = 0
                    }
                } else {
                    frictionArrow.group.visible = false
                }

                // Net force arrow
                if (Math.abs(fNet) > 0.2) {
                    netArrow.group.visible = true
                    netArrow.group.position.x = posX
                    const nScale = Math.abs(fNet) / 5
                    netArrow.shaft.scale.x = nScale
                    netArrow.head.position.x = nScale * 0.5 + 0.25
                    if (fNet < 0) {
                        netArrow.group.rotation.y = Math.PI
                    } else {
                        netArrow.group.rotation.y = 0
                    }
                } else {
                    netArrow.group.visible = false
                }

                // — Spring deformation based on applied force —
                const targetCompression = appliedForce * 0.04
                springCompression += (targetCompression - springCompression) * 0.1
                springCoils.forEach((coil, i) => {
                    const spacing = 0.35 + springCompression * 0.05
                    coil.position.x = i * spacing - (springCoils.length * spacing) / 2
                    coil.scale.y = 1 + Math.abs(springCompression) * 0.1
                })
                plate2.position.x = springCoils.length * (0.35 + springCompression * 0.05) / 2 + 0.2

                // Status
                let status = 'AT REST'
                if (Math.abs(velocity) > 0.05) {
                    status = velocity > 0 ? 'MOVING →' : '← MOVING'
                }
                if (Math.abs(fApplied) > 0 && Math.abs(velocity) < 0.05) {
                    if (Math.abs(fNet) < 0.5) status = 'BALANCED'
                }

                setHudData({
                    velocity: velocity.toFixed(2),
                    acceleration: acc.toFixed(2),
                    netForce: fNet.toFixed(1),
                    frictionForce: fFriction.toFixed(1),
                    status
                })
            },
            reset: () => {
                velocity = 0
                posX = 0
                crateGroup.position.x = 0
                crate.rotation.z = 0
                crateWire.rotation.z = 0
            }
        }
    }, [friction, appliedForce])

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">🔬 FORCE EFFECTS LAB</span>
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
                        <span className={`sim-data-value ${hudData.status === 'AT REST' ? 'neutral' : ''}`}>
                            {hudData.status}
                        </span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Velocity:</span>
                        <span className="sim-data-value">{hudData.velocity} m/s</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Accel:</span>
                        <span className="sim-data-value">{hudData.acceleration} m/s²</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                        <span className="sim-data-label" style={{ color: '#00d4ff' }}>→ Applied:</span>
                        <span className="sim-data-value" style={{ color: '#00d4ff' }}>{appliedForce.toFixed(1)} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#e63946' }}>← Friction:</span>
                        <span className="sim-data-value" style={{ color: '#e63946' }}>{hudData.frictionForce} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#2dce89' }}>Net Force:</span>
                        <span className="sim-data-value" style={{ color: '#2dce89' }}>{hudData.netForce} N</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="sim-overlay-panel right-side" style={{ minWidth: '140px' }}>
                    <h4 className="sim-overlay-title">Force Arrows</h4>
                    <div className="sim-data-row"><span style={{ color: '#00d4ff', fontSize: '0.9rem' }}>■ Applied Force</span></div>
                    <div className="sim-data-row"><span style={{ color: '#e63946', fontSize: '0.9rem' }}>■ Friction Force</span></div>
                    <div className="sim-data-row"><span style={{ color: '#2dce89', fontSize: '0.9rem' }}>■ Net Force</span></div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>Mass: 2 kg</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">FORCE:</span>
                    <input
                        type="range" className="sim-slider"
                        min="-15" max="15" step="0.5" value={appliedForce}
                        onChange={(e) => setAppliedForce(Number(e.target.value))}
                    />
                    <span className="sim-value">{appliedForce > 0 ? '+' : ''}{appliedForce.toFixed(1)}N</span>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">FRICTION (μ):</span>
                    <input
                        type="range" className="sim-slider"
                        min="0" max="0.8" step="0.05" value={friction}
                        onChange={(e) => setFriction(Number(e.target.value))}
                    />
                    <span className="sim-value">{friction.toFixed(2)}</span>
                </div>
            </div>
            <div className="sim-info">
                Drag the FORCE slider to push/pull the crate. Adjust FRICTION to see how surface resistance affects motion. Watch the spring deform! 🔬
            </div>
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
   UNIT 3: Tablecloth Trick (PhET-style)
   Demonstrates: First Law of Motion / Inertia
   Pull the cloth — objects stay due to inertia!
   ══════════════════════════════════════════════ */
function Sim3_InertiaLab() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})
    const [pullSpeed, setPullSpeed] = useState(3)
    const [selectedObject, setSelectedObject] = useState('Vase')
    const [objectWeights, setObjectWeights] = useState({
        Plate: 3,
        Vase: 5,
        Box: 7
    })
    const [hudData, setHudData] = useState({
        clothPos: '0.0', phase: 'READY',
        clothSpeed: '0.0', pullForce: '0.0', frictionLoad: '0.0',
        objectsMoved: 'NONE', explanation: 'Objects and cloth are at rest on the table.'
    })
    const pullSpeedRef = useRef(pullSpeed)
    const selectedObjectRef = useRef(selectedObject)
    const objectWeightsRef = useRef(objectWeights)

    useEffect(() => {
        pullSpeedRef.current = pullSpeed
    }, [pullSpeed])

    useEffect(() => {
        selectedObjectRef.current = selectedObject
    }, [selectedObject])

    useEffect(() => {
        objectWeightsRef.current = objectWeights
    }, [objectWeights])

    const selectedWeight = objectWeights[selectedObject]
    const totalWeight = Object.values(objectWeights).reduce((sum, weight) => sum + weight, 0)

    const updateSelectedWeight = (value) => {
        setObjectWeights((prev) => ({
            ...prev,
            [selectedObject]: value
        }))
    }

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 10, 16)
        camera.lookAt(0, 3, 0)

        // ── Thick Table ──
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.6, 6),
            new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.2, roughness: 0.6 })
        )
        tableTop.position.y = 3
        scene.add(tableTop)

        // Table wireframe
        const tableWire = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.6, 6),
            new THREE.MeshBasicMaterial({ color: 0xD2691E, wireframe: true, transparent: true, opacity: 0.15 })
        )
        tableWire.position.copy(tableTop.position)
        scene.add(tableWire)

        // Table legs
        const legGeo = new THREE.BoxGeometry(0.5, 3, 0.5)
        const legMat = new THREE.MeshStandardMaterial({ color: 0x5C3317, metalness: 0.2 })
        const legPositions = [[-6, 1.5, -2.5], [6, 1.5, -2.5], [-6, 1.5, 2.5], [6, 1.5, 2.5]]
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeo, legMat)
            leg.position.set(...pos)
            scene.add(leg)
        })

        // ── Floor ──
        const floor = new THREE.Mesh(
            new THREE.BoxGeometry(20, 0.2, 12),
            new THREE.MeshStandardMaterial({ color: 0x0d1b2a, metalness: 0.4 })
        )
        floor.position.y = -0.1
        scene.add(floor)

        // ── Tablecloth (bright red, flat on table) ──
        const cloth = new THREE.Mesh(
            new THREE.BoxGeometry(12, 0.08, 5),
            new THREE.MeshStandardMaterial({
                color: 0xe63946,
                metalness: 0.1,
                roughness: 0.8,
                emissive: new THREE.Color(0xe63946),
                emissiveIntensity: 0.3
            })
        )
        cloth.position.set(0, 3.35, 0)
        scene.add(cloth)

        // Cloth overhang on right side
        const clothHang = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 1.5, 5),
            new THREE.MeshStandardMaterial({
                color: 0xe63946,
                emissive: new THREE.Color(0xe63946),
                emissiveIntensity: 0.2
            })
        )
        clothHang.position.set(6, 2.55, 0)
        scene.add(clothHang)

        // ── Objects on the cloth — LARGE and BRIGHT ──
        const objectConfigs = [
            {
                name: 'Plate',
                color: 0xfbbf24,
                startX: -3,
                startY: 3.55,
                restY: 3.5,
                baseGlow: 0.25,
                geometry: new THREE.CylinderGeometry(1.2, 1.2, 0.4, 16)
            },
            {
                name: 'Vase',
                color: 0x00d4ff,
                startX: 0,
                startY: 4.25,
                restY: 4.2,
                baseGlow: 0.3,
                geometry: new THREE.SphereGeometry(0.9, 16, 16)
            },
            {
                name: 'Box',
                color: 0x2dce89,
                startX: 3,
                startY: 4.05,
                restY: 4.0,
                baseGlow: 0.25,
                geometry: new THREE.BoxGeometry(1.4, 1.4, 1.4)
            }
        ]

        const objects = objectConfigs.map((config) => {
            const material = new THREE.MeshStandardMaterial({
                color: config.color,
                metalness: 0.45,
                roughness: 0.25,
                emissive: new THREE.Color(config.color),
                emissiveIntensity: config.baseGlow
            })
            const mesh = new THREE.Mesh(config.geometry, material)
            mesh.position.set(config.startX, config.startY, 0)
            scene.add(mesh)

            const wire = new THREE.Mesh(
                config.geometry,
                new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 })
            )
            wire.position.copy(mesh.position)
            scene.add(wire)

            return {
                ...config,
                mesh,
                wire,
                material
            }
        })

        objects.forEach(obj => {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(1, 0.04, 8, 24),
                new THREE.MeshBasicMaterial({ color: obj.color, transparent: true, opacity: 0.3 })
            )
            ring.rotation.x = Math.PI / 2
            ring.position.set(obj.mesh.position.x, 3.32, 0)
            scene.add(ring)
            obj.ring = ring
        })

        // ── Motion particles (cloth trail) ──
        const trailParticles = []
        for (let i = 0; i < 20; i++) {
            const tp = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.2, 0.2),
                new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0 })
            )
            tp.visible = false
            scene.add(tp)
            trailParticles.push(tp)
        }
        let trailIdx = 0

        // ── State ──
        let phase = 'ready' // ready, pulling, settling, done
        let clothVelX = 0
        let clothX = 0
        let pullTimer = 0
        let objectsDropVel = [0, 0, 0]
        let objectsSettled = [false, false, false]
        let pullSuccessful = false
        let movedCount = 0

        const updateObjectHighlights = (t = 0) => {
            const activeObject = selectedObjectRef.current
            const weights = objectWeightsRef.current

            objects.forEach((obj, index) => {
                const isSelected = obj.name === activeObject
                const baseOpacity = phase === 'ready'
                    ? 0.18 + Math.max(0, Math.sin(t * 3 + index) * 0.12)
                    : 0.2

                obj.weight = weights[obj.name] ?? 5
                obj.ring.position.x = obj.mesh.position.x
                obj.ring.position.z = obj.mesh.position.z
                obj.ring.scale.setScalar(isSelected ? 1.18 : 1)
                obj.ring.material.opacity = isSelected ? 0.7 : baseOpacity
                obj.material.emissiveIntensity = isSelected ? obj.baseGlow + 0.18 : obj.baseGlow
            })
        }

        const resetAll = () => {
            phase = 'ready'
            clothVelX = 0
            clothX = 0
            pullTimer = 0
            objectsDropVel = [0, 0, 0]
            objectsSettled = [false, false, false]
            pullSuccessful = false
            movedCount = 0

            cloth.position.set(0, 3.35, 0)
            clothHang.position.set(6, 2.55, 0)
            cloth.visible = true
            clothHang.visible = true

            objects.forEach((obj, i) => {
                obj.mesh.position.y = obj.startY
                obj.mesh.position.x = obj.startX
                obj.mesh.rotation.set(0, 0, 0)
                obj.wire.position.copy(obj.mesh.position)
                obj.wire.rotation.copy(obj.mesh.rotation)
            })

            trailParticles.forEach(tp => { tp.visible = false })
            updateObjectHighlights()

            setHudData({
                clothPos: '0.0', phase: 'READY',
                clothSpeed: '0.0', pullForce: '0.0', frictionLoad: '0.0',
                objectsMoved: 'NONE',
                explanation: 'Objects and cloth are at rest on the table.'
            })
        }

        return {
            update: (t) => {
                const currentPullSpeed = pullSpeedRef.current

                if (phase === 'pulling') {
                    pullTimer += 0.016

                    const pullForce = currentPullSpeed * 6.5
                    const frictionLoad = objects.reduce((sum, obj) => sum + obj.weight * 0.24, 0)
                    const targetClothSpeed = THREE.MathUtils.clamp(
                        (pullForce - frictionLoad * 0.45) * 0.028,
                        0.04,
                        0.85
                    )

                    // Heavier objects increase the load on the cloth, so the cloth reaches a lower speed.
                    clothVelX += (targetClothSpeed - clothVelX) * 0.14
                    clothX += clothVelX
                    cloth.position.x = clothX
                    clothHang.position.x = 6 + clothX

                    // Cloth trail
                    if (Math.random() < 0.4) {
                        const tp = trailParticles[trailIdx % trailParticles.length]
                        tp.visible = true
                        tp.position.set(
                            cloth.position.x - 5 + Math.random() * 2,
                            3.35 + Math.random() * 0.2,
                            (Math.random() - 0.5) * 4
                        )
                        tp.material.opacity = 0.7
                        trailIdx++
                    }

                    // A slower cloth gives friction more time to pull the objects along,
                    // while higher weight increases inertia and reduces each object's shift.
                    const speedTransferFactor = THREE.MathUtils.clamp((5 - currentPullSpeed) / 4, 0, 1)
                    const slowClothFactor = THREE.MathUtils.clamp(1 - clothVelX / 0.75, 0.12, 0.88)
                    objects.forEach((obj) => {
                        const inertiaFactor = 1 / (1 + obj.weight * 0.26)
                        const dragRatio = currentPullSpeed >= 5
                            ? 0
                            : THREE.MathUtils.clamp(
                                speedTransferFactor * slowClothFactor * (0.48 + 0.16 / Math.max(currentPullSpeed, 1)) * inertiaFactor,
                                0,
                                0.32
                            )
                        obj.mesh.position.x += clothVelX * dragRatio
                        obj.wire.position.x = obj.mesh.position.x
                    })

                    movedCount = objects.filter((obj) => Math.abs(obj.mesh.position.x - obj.startX) > 0.75).length
                    pullSuccessful = movedCount === 0

                    // Cloth fully pulled out
                    if (clothX > 14) {
                        phase = 'settling'
                        cloth.visible = false
                        clothHang.visible = false
                    }

                    setHudData({
                        clothPos: clothX.toFixed(1),
                        clothSpeed: (clothVelX * 8).toFixed(2),
                        pullForce: pullForce.toFixed(1),
                        frictionLoad: frictionLoad.toFixed(1),
                        phase: '⚡ PULLING!',
                        objectsMoved: movedCount === 0 ? 'NONE' : `${movedCount} SHIFTED`,
                        explanation: currentPullSpeed < 2
                            ? 'Slow pull means friction acts longer. Extra weight increases the cloth load and also increases inertia, so the cloth slows while heavier objects resist motion.'
                            : currentPullSpeed >= 5
                                ? 'Maximum speed gives the cloth almost no time to transfer motion, so the objects remain at rest while the cloth slips out.'
                            : movedCount === 0
                                ? 'Fast pull reduces contact time. The cloth still feels the total load, but the heavier objects stay nearly at rest because of inertia.'
                                : 'The total load slowed the cloth, so friction had more time to act. Increase pull force or increase object weight to compare the effect.'
                    })
                } else if (phase === 'settling') {
                    // Objects drop/settle
                    let allSettled = true
                    objects.forEach((obj, i) => {
                        if (!objectsSettled[i]) {
                            const tableEdge = 6
                            const onTable = Math.abs(obj.mesh.position.x) < tableEdge

                            objectsDropVel[i] -= 0.015
                            obj.mesh.position.y += objectsDropVel[i]

                            // If dragged past table edge, fall to ground
                            if (!onTable) {
                                // Also move sideways as they fall (tumble off)
                                obj.mesh.position.x += 0.03
                                obj.mesh.rotation.z += 0.05
                                obj.mesh.rotation.x += 0.03

                                // Hit the floor
                                if (obj.mesh.position.y <= 0.4) {
                                    obj.mesh.position.y = 0.4
                                    objectsDropVel[i] = 0
                                    objectsSettled[i] = true
                                } else {
                                    allSettled = false
                                }
                            } else {
                                // On table — settle onto table surface
                                if (obj.mesh.position.y <= obj.restY) {
                                    obj.mesh.position.y = obj.restY
                                    objectsDropVel[i] = 0
                                    objectsSettled[i] = true
                                } else {
                                    allSettled = false
                                }
                            }
                            obj.wire.position.copy(obj.mesh.position)
                            obj.wire.rotation.copy(obj.mesh.rotation)
                        }
                    })

                    if (allSettled) {
                        phase = 'done'
                        const anyFell = objects.some(obj => obj.mesh.position.y < 1)
                        setHudData(prev => ({
                            ...prev, phase: '✅ COMPLETE', clothSpeed: '0.0',
                            explanation: pullSuccessful
                                ? '🎉 Success! The cloth slipped out quickly, so friction acted for a short time and inertia kept the objects nearly at rest.'
                                : anyFell
                                    ? '💥 Some objects fell off. The heavier load slowed the cloth enough for friction to drag objects toward the edge.'
                                    : '⚠️ Some objects were dragged. Compare how changing weight changes both the cloth speed and the object motion.'
                        }))
                    }
                } else if (phase === 'ready') {
                    // Idle animation — gentle float
                    objects.forEach((obj, i) => {
                        obj.mesh.position.y = obj.startY + Math.sin(t * 2 + i * 1.5) * 0.05
                        obj.mesh.rotation.y = t * 0.3 + i
                        obj.wire.position.copy(obj.mesh.position)
                        obj.wire.rotation.copy(obj.mesh.rotation)
                    })
                }

                updateObjectHighlights(t)

                // Fade trail
                trailParticles.forEach(tp => {
                    if (tp.visible && tp.material.opacity > 0) {
                        tp.material.opacity -= 0.015
                        tp.position.x += 0.05
                        if (tp.material.opacity <= 0) tp.visible = false
                    }
                })
            },
            pull: () => {
                if (phase === 'ready') {
                    phase = 'pulling'
                    clothVelX = 0
                    clothX = 0
                    pullTimer = 0
                    cloth.visible = true
                    movedCount = 0
                }
            },
            reset: resetAll
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
                <span className="simulation-title">🪄 TABLECLOTH TRICK</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Inertia Monitor</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Phase:</span>
                        <span className={`sim-data-value ${hudData.phase.includes('PULL') ? 'warning' : 'neutral'}`}>
                            {hudData.phase}
                        </span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Cloth Pulled:</span>
                        <span className="sim-data-value">{hudData.clothPos} m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Cloth Speed:</span>
                        <span className="sim-data-value">{hudData.clothSpeed} m/s</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#00d4ff' }}>Pull Force:</span>
                        <span className="sim-data-value" style={{ color: '#00d4ff' }}>{hudData.pullForce} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#fbbf24' }}>Cloth Load:</span>
                        <span className="sim-data-value" style={{ color: '#fbbf24' }}>{hudData.frictionLoad} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Objects Moved?</span>
                        <span className={`sim-data-value ${hudData.objectsMoved !== 'NONE' ? 'warning' : ''}`} style={{ color: hudData.objectsMoved === 'NONE' ? '#2dce89' : '#e63946' }}>
                            {hudData.objectsMoved}
                        </span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controlsRef.current?.pull?.()}>
                    🪄 PULL CLOTH!
                </button>
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-selector-group">
                    <span className="sim-slider-label">SELECT:</span>
                    <div className="sim-chip-list">
                        {['Plate', 'Vase', 'Box'].map((name) => (
                            <button
                                key={name}
                                type="button"
                                className={`sim-chip ${selectedObject === name ? 'active' : ''}`}
                                onClick={() => setSelectedObject(name)}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">WEIGHT:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="10" step="0.5" value={selectedWeight}
                        onChange={(e) => updateSelectedWeight(Number(e.target.value))}
                    />
                    <span className="sim-value">{selectedWeight.toFixed(1)}kg</span>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">PULL SPEED:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="5" step="0.5" value={pullSpeed}
                        onChange={(e) => setPullSpeed(Number(e.target.value))}
                    />
                    <span className="sim-value">{pullSpeed < 2 ? '🐢 SLOW' : pullSpeed < 4 ? '🏃 FAST' : '⚡ LIGHTNING'}</span>
                </div>
            </div>
            <div className="sim-control-summary">
                <div className="sim-control-summary-grid">
                    <div className="sim-summary-pill active">
                        Selected: {selectedObject} ({selectedWeight.toFixed(1)} kg)
                    </div>
                    <div className="sim-summary-pill">
                        Total Weight: {totalWeight.toFixed(1)} kg
                    </div>
                    {Object.entries(objectWeights).map(([name, weight]) => (
                        <div
                            key={name}
                            className={`sim-summary-pill ${selectedObject === name ? 'active' : ''}`}
                        >
                            {name}: {weight.toFixed(1)} kg
                        </div>
                    ))}
                </div>
                <div className="sim-control-summary-text">
                    {hudData.explanation}
                </div>
            </div>
            <div className="sim-info">
                Change object weights, then pull the cloth. The total weight now changes the cloth speed, and each object's own weight changes how much friction and inertia affect its motion. 🪄
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 4: Inertia Bowling — Same Hit, Different Masses
   ══════════════════════════════════════════════ */
function Sim4_MassCompare() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})
    const [hudData, setHudData] = useState({
        lightDist: '0.0', medDist: '0.0', heavyDist: '0.0',
        phase: 'READY', force: 10
    })
    const [bowlForce, setBowlForce] = useState(10)

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 12, 20)
        camera.lookAt(0, 0, -2)

        // ── Floor ──
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.MeshStandardMaterial({ color: 0x0d1b2a, metalness: 0.6, roughness: 0.4 })
        )
        floor.rotation.x = -Math.PI / 2
        floor.position.y = -0.01
        scene.add(floor)

        // ── Three Lanes ──
        const laneColors = [0x00d4ff, 0xfbbf24, 0xe63946]
        const laneZ = [-4, 0, 4]
        const laneNames = ['LIGHT', 'MEDIUM', 'HEAVY']
        const masses = [1, 5, 20]

        // Lane lines
        laneZ.forEach((z, i) => {
            const lane = new THREE.Mesh(
                new THREE.BoxGeometry(22, 0.02, 2.5),
                new THREE.MeshStandardMaterial({
                    color: laneColors[i],
                    transparent: true,
                    opacity: 0.08
                })
            )
            lane.position.set(2, 0.01, z)
            scene.add(lane)

            // Lane border lines
            for (const offset of [-1.25, 1.25]) {
                const border = new THREE.Mesh(
                    new THREE.BoxGeometry(22, 0.05, 0.04),
                    new THREE.MeshBasicMaterial({ color: laneColors[i], transparent: true, opacity: 0.4 })
                )
                border.position.set(2, 0.03, z + offset)
                scene.add(border)
            }

            // Distance markers every 2 units
            for (let x = -6; x <= 12; x += 2) {
                const tick = new THREE.Mesh(
                    new THREE.BoxGeometry(0.04, 0.04, 0.6),
                    new THREE.MeshBasicMaterial({ color: laneColors[i], transparent: true, opacity: 0.25 })
                )
                tick.position.set(x, 0.02, z)
                scene.add(tick)
            }
        })

        // ── Target Objects (different masses, different sizes) ──
        const targets = []
        const targetConfigs = [
            { size: 0.7, color: 0x00d4ff, geo: 'sphere' },   // Light — small sphere
            { size: 1.1, color: 0xfbbf24, geo: 'box' },      // Medium — box
            { size: 1.8, color: 0xe63946, geo: 'box' }        // Heavy — big box
        ]

        targetConfigs.forEach((cfg, i) => {
            let geometry
            if (cfg.geo === 'sphere') {
                geometry = new THREE.SphereGeometry(cfg.size * 0.5, 12, 12)
            } else {
                geometry = new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size)
            }

            const mat = new THREE.MeshStandardMaterial({
                color: cfg.color,
                metalness: 0.4,
                roughness: 0.3
            })
            const mesh = new THREE.Mesh(geometry, mat)
            mesh.position.set(-2, cfg.size * 0.5, laneZ[i])
            mesh.userData = {
                startX: -2,
                startY: cfg.size * 0.5,
                velocity: 0,
                mass: masses[i],
                size: cfg.size,
                settled: false
            }
            scene.add(mesh)

            // Wireframe overlay
            const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                color: 0xffffff, wireframe: true, transparent: true, opacity: 0.12
            }))
            wire.position.copy(mesh.position)
            scene.add(wire)
            mesh.userData.wireframe = wire

            targets.push(mesh)
        })

        // ── Bowling Balls ──
        const balls = []
        const ballGeo = new THREE.SphereGeometry(0.4, 12, 12)
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.7, roughness: 0.2 })

        laneZ.forEach((z, i) => {
            const ball = new THREE.Mesh(ballGeo, ballMat.clone())
            ball.position.set(-9, 0.4, z)
            ball.userData = { velocity: 0, rolling: false, hit: false, startX: -9 }
            scene.add(ball)

            // Ball glow ring
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.5, 0.04, 8, 16),
                new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.4 })
            )
            ring.rotation.x = Math.PI / 2
            ring.position.copy(ball.position)
            ring.position.y = 0.05
            scene.add(ring)
            ball.userData.ring = ring

            balls.push(ball)
        })

        // ── Debris Particles ──
        const debrisParticles = []
        const debrisGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15)

        for (let i = 0; i < 60; i++) {
            const dMat = new THREE.MeshBasicMaterial({
                color: laneColors[i % 3],
                transparent: true,
                opacity: 0
            })
            const d = new THREE.Mesh(debrisGeo, dMat)
            d.visible = false
            d.userData = { velX: 0, velY: 0, velZ: 0, life: 0, maxLife: 40 }
            scene.add(d)
            debrisParticles.push(d)
        }

        // ── Impact flash rings ──
        const flashRings = []
        laneZ.forEach((z, i) => {
            const flash = new THREE.Mesh(
                new THREE.RingGeometry(0.1, 1.5, 16),
                new THREE.MeshBasicMaterial({ color: laneColors[i], transparent: true, opacity: 0, side: THREE.DoubleSide })
            )
            flash.rotation.x = -Math.PI / 2
            flash.position.set(-2, 0.1, z)
            flash.visible = false
            flash.userData = { expanding: false, t: 0 }
            scene.add(flash)
            flashRings.push(flash)
        })

        // ── State ──
        let launched = false

        const spawnDebris = (pos, colorIdx) => {
            let count = 0
            debrisParticles.forEach(d => {
                if (!d.visible && count < 12 && Math.floor(d.userData.laneIdx || 0) === 0) {
                    d.visible = true
                    d.material.color.setHex(laneColors[colorIdx])
                    d.material.opacity = 1
                    d.position.set(
                        pos.x + (Math.random() - 0.5) * 0.5,
                        pos.y + Math.random() * 0.5,
                        pos.z + (Math.random() - 0.5) * 0.5
                    )
                    d.userData.velX = (Math.random() - 0.5) * 0.15 + 0.1
                    d.userData.velY = 0.08 + Math.random() * 0.12
                    d.userData.velZ = (Math.random() - 0.5) * 0.1
                    d.userData.life = 0
                    d.userData.maxLife = 30 + Math.random() * 30
                    d.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
                    count++
                }
            })
        }

        const resetAll = () => {
            launched = false
            targets.forEach((t, i) => {
                t.position.x = t.userData.startX
                t.position.y = t.userData.startY
                t.userData.velocity = 0
                t.userData.settled = false
                t.rotation.set(0, 0, 0)
                t.userData.wireframe.position.copy(t.position)
                t.userData.wireframe.rotation.set(0, 0, 0)
            })
            balls.forEach(b => {
                b.position.x = b.userData.startX
                b.userData.velocity = 0
                b.userData.rolling = false
                b.userData.hit = false
                b.userData.ring.position.x = b.userData.startX
            })
            debrisParticles.forEach(d => { d.visible = false; d.material.opacity = 0 })
            flashRings.forEach(f => { f.visible = false; f.userData.expanding = false; f.material.opacity = 0 })
            setHudData({ lightDist: '0.0', medDist: '0.0', heavyDist: '0.0', phase: 'READY', force: bowlForce })
        }

        return {
            update: (t) => {
                // Animate bowling balls
                balls.forEach((ball, i) => {
                    if (ball.userData.rolling && !ball.userData.hit) {
                        ball.position.x += ball.userData.velocity
                        ball.rotation.z -= ball.userData.velocity * 2
                        ball.userData.ring.position.x = ball.position.x

                        // Check collision with target
                        const target = targets[i]
                        const dist = Math.abs(ball.position.x - target.position.x)
                        if (dist < target.userData.size * 0.5 + 0.4) {
                            ball.userData.hit = true
                            ball.userData.velocity *= 0.1

                            // Transfer momentum: F = mv, a = F/m → lighter objects get more velocity
                            const impactForce = bowlForce
                            target.userData.velocity = (impactForce / target.userData.mass) * 0.012

                            // Spawn debris
                            spawnDebris(target.position, i)

                            // Flash ring
                            flashRings[i].visible = true
                            flashRings[i].userData.expanding = true
                            flashRings[i].userData.t = 0
                            flashRings[i].position.x = target.position.x
                        }
                    }

                    // Slow down after hit
                    if (ball.userData.hit) {
                        ball.userData.velocity *= 0.95
                    }
                })

                // Animate targets
                targets.forEach((target, i) => {
                    if (target.userData.velocity > 0.001) {
                        target.position.x += target.userData.velocity
                        target.userData.velocity *= 0.985 // friction
                        target.rotation.z += target.userData.velocity * 0.3
                        target.rotation.x += target.userData.velocity * 0.2
                    } else if (target.userData.velocity > 0) {
                        target.userData.velocity = 0
                        target.userData.settled = true
                    }

                    target.userData.wireframe.position.copy(target.position)
                    target.userData.wireframe.rotation.copy(target.rotation)
                })

                // Animate debris
                debrisParticles.forEach(d => {
                    if (d.visible) {
                        d.userData.life++
                        d.position.x += d.userData.velX
                        d.position.y += d.userData.velY
                        d.position.z += d.userData.velZ
                        d.userData.velY -= 0.004 // gravity
                        d.rotation.x += 0.1
                        d.rotation.z += 0.08
                        d.material.opacity = Math.max(0, 1 - d.userData.life / d.userData.maxLife)
                        if (d.position.y < 0) d.position.y = 0

                        if (d.userData.life > d.userData.maxLife) {
                            d.visible = false
                        }
                    }
                })

                // Animate flash rings
                flashRings.forEach(f => {
                    if (f.userData.expanding) {
                        f.userData.t += 0.05
                        const s = 1 + f.userData.t * 3
                        f.scale.set(s, s, s)
                        f.material.opacity = Math.max(0, 0.6 - f.userData.t)
                        if (f.userData.t > 1) {
                            f.visible = false
                            f.userData.expanding = false
                        }
                    }
                })

                // Idle animation for targets before launch
                if (!launched) {
                    targets.forEach((target, i) => {
                        target.position.y = target.userData.startY + Math.sin(t * 2 + i) * 0.1
                        target.rotation.y = t * 0.3 + i
                        target.userData.wireframe.position.copy(target.position)
                        target.userData.wireframe.rotation.copy(target.rotation)
                    })

                    // Pulse the bowling balls
                    balls.forEach((ball, i) => {
                        ball.userData.ring.material.opacity = 0.2 + Math.sin(t * 3 + i) * 0.2
                    })
                }

                // Update HUD
                if (launched) {
                    setHudData({
                        lightDist: Math.max(0, targets[0].position.x - targets[0].userData.startX).toFixed(1),
                        medDist: Math.max(0, targets[1].position.x - targets[1].userData.startX).toFixed(1),
                        heavyDist: Math.max(0, targets[2].position.x - targets[2].userData.startX).toFixed(1),
                        phase: targets.every(t2 => t2.userData.settled || t2.userData.velocity === 0) ? 'COMPLETE' : 'IMPACT!',
                        force: bowlForce
                    })
                }
            },
            bowl: () => {
                if (launched) return
                launched = true
                balls.forEach(b => {
                    b.userData.rolling = true
                    b.userData.velocity = 0.18
                })
                setHudData(prev => ({ ...prev, phase: 'ROLLING...', force: bowlForce }))
            },
            reset: resetAll
        }
    }, [bowlForce])

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">🎳 INERTIA BOWLING</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* HUD Overlay */}
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Displacement (a = F/m)</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#00d4ff' }}>🔵 Light (1kg):</span>
                        <span className="sim-data-value" style={{ color: '#00d4ff' }}>{hudData.lightDist} m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#fbbf24' }}>🟡 Medium (5kg):</span>
                        <span className="sim-data-value" style={{ color: '#fbbf24' }}>{hudData.medDist} m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#e63946' }}>🔴 Heavy (20kg):</span>
                        <span className="sim-data-value" style={{ color: '#e63946' }}>{hudData.heavyDist} m</span>
                    </div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)' }}>
                        <span className="sim-data-label">Status:</span>
                        <span className={`sim-data-value ${hudData.phase === 'IMPACT!' ? 'warning' : 'neutral'}`}>{hudData.phase}</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn primary" onClick={() => controlsRef.current?.bowl?.()}>
                    🎳 BOWL!
                </button>
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">FORCE:</span>
                    <input
                        type="range" className="sim-slider"
                        min="5" max="30" value={bowlForce}
                        onChange={(e) => setBowlForce(Number(e.target.value))}
                    />
                    <span className="sim-value">{bowlForce}N</span>
                </div>
            </div>
            <div className="sim-info">Same force hits 3 objects of different mass. Lighter = more acceleration, heavier = more inertia! 🎯</div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   UNIT 5: F=ma Dynamics Lab (PhET-style)
   Demonstrates: Newton's Second Law
   Apply force to a crate, change mass, observe
   acceleration, velocity, and momentum in real time
   ══════════════════════════════════════════════ */
function Sim5_FmaCalculator() {
    const mountRef = useRef(null)
    const controlsRef = useRef({})
    const [mass, setMass] = useState(3)
    const [appliedForce, setAppliedForce] = useState(0)
    const [hudData, setHudData] = useState({
        force: '0.0', mass: '3.0', accel: '0.0',
        velocity: '0.0', position: '0.0', momentum: '0.0',
        phase: 'RESTING'
    })

    const buildScene = useCallback((scene, camera) => {
        camera.position.set(0, 8, 20)
        camera.lookAt(0, 1, 0)

        // ── Track / Ground ──
        const ground = new THREE.Mesh(
            new THREE.BoxGeometry(40, 0.25, 6),
            new THREE.MeshStandardMaterial({ color: 0x16213e, metalness: 0.5, roughness: 0.4 })
        )
        ground.position.y = -0.12
        scene.add(ground)

        // Track lines
        for (let x = -18; x <= 18; x += 1) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(0.03, 0.01, 6),
                new THREE.MeshBasicMaterial({ color: 0x3d3d5c, transparent: true, opacity: 0.25 })
            )
            line.position.set(x, 0.02, 0)
            scene.add(line)
        }

        // Major markers every 5 units
        for (let x = -15; x <= 15; x += 5) {
            const tick = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.15, 1),
                new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.5 })
            )
            tick.position.set(x, 0.08, -2)
            scene.add(tick)
        }

        // ── Crate (mass object) ──
        const crateGroup = new THREE.Group()

        const crateMat = new THREE.MeshStandardMaterial({
            color: 0x2dce89, metalness: 0.35, roughness: 0.35
        })
        const crate = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            crateMat
        )
        crateGroup.add(crate)

        // Crate wireframe
        const crateWire = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.12 })
        )
        crateGroup.add(crateWire)

        // Mass label ring
        const massRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.2, 0.05, 8, 24),
            new THREE.MeshBasicMaterial({ color: 0x2dce89, transparent: true, opacity: 0.3 })
        )
        massRing.rotation.x = Math.PI / 2
        massRing.position.y = 0
        crateGroup.add(massRing)

        crateGroup.position.set(0, 1, 0)
        scene.add(crateGroup)

        // ── Force Arrow ──
        const forceArrowGroup = new THREE.Group()
        const arrowShaft = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 0.2),
            new THREE.MeshBasicMaterial({ color: 0xe63946 })
        )
        forceArrowGroup.add(arrowShaft)
        const arrowHead = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.7, 4),
            new THREE.MeshBasicMaterial({ color: 0xe63946 })
        )
        arrowHead.rotation.z = -Math.PI / 2
        arrowHead.position.x = 0.85
        forceArrowGroup.add(arrowHead)
        forceArrowGroup.position.set(0, 3, 0)
        forceArrowGroup.visible = false
        scene.add(forceArrowGroup)

        // ── Acceleration arrow (green) ──
        const accelArrowGroup = new THREE.Group()
        const accelShaft = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.15, 0.15),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        )
        accelArrowGroup.add(accelShaft)
        const accelHead = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.5, 4),
            new THREE.MeshBasicMaterial({ color: 0x00d4ff })
        )
        accelHead.rotation.z = -Math.PI / 2
        accelHead.position.x = 0.75
        accelArrowGroup.add(accelHead)
        accelArrowGroup.position.set(0, 3.6, 0)
        accelArrowGroup.visible = false
        scene.add(accelArrowGroup)

        // ── Motion trail ──
        const trailPoints = []
        const trailGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15)
        for (let i = 0; i < 40; i++) {
            const tp = new THREE.Mesh(trailGeo,
                new THREE.MeshBasicMaterial({ color: 0x2dce89, transparent: true, opacity: 0 })
            )
            tp.visible = false
            scene.add(tp)
            trailPoints.push(tp)
        }
        let trailIdx = 0
        let trailTimer = 0

        // ── Speedometer bar (on ground) ──
        const speedBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.1, 2),
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6 })
        )
        speedBar.position.set(0, 0.06, -2.5)
        scene.add(speedBar)

        // ── Physics state ──
        let velocity = 0
        let posX = 0
        let pushing = false

        return {
            update: (t) => {
                const F = appliedForce
                const m = mass
                const a = m > 0 ? F / m : 0
                const dt = 0.016

                // Apply force
                if (Math.abs(F) > 0.1) {
                    velocity += a * dt
                    pushing = true
                } else {
                    // Friction decay when no force
                    velocity *= 0.995
                    if (Math.abs(velocity) < 0.005) velocity = 0
                    pushing = false
                }

                // Clamp
                velocity = Math.max(-10, Math.min(10, velocity))

                posX += velocity * dt * 3

                // Boundaries
                if (posX > 16) { posX = 16; velocity = -velocity * 0.2 }
                if (posX < -16) { posX = -16; velocity = -velocity * 0.2 }

                // Update crate
                const scale = 0.6 + m * 0.1
                crateGroup.position.x = posX
                crateGroup.position.y = scale
                crate.scale.setScalar(scale)
                crateWire.scale.setScalar(scale)
                massRing.scale.setScalar(scale)
                crate.rotation.z = -velocity * 0.01

                // Color intensity based on acceleration
                const absA = Math.abs(a)
                crateMat.emissive = new THREE.Color(0x2dce89)
                crateMat.emissiveIntensity = Math.min(absA / 10, 0.5)

                // Force arrow
                if (Math.abs(F) > 0.1) {
                    forceArrowGroup.visible = true
                    forceArrowGroup.position.x = posX
                    const fScale = Math.abs(F) / 8
                    arrowShaft.scale.x = fScale
                    arrowHead.position.x = fScale * 0.5 + 0.35
                    forceArrowGroup.rotation.y = F < 0 ? Math.PI : 0
                } else {
                    forceArrowGroup.visible = false
                }

                // Acceleration arrow
                if (Math.abs(a) > 0.05) {
                    accelArrowGroup.visible = true
                    accelArrowGroup.position.x = posX
                    const aScale = Math.abs(a) / 5
                    accelShaft.scale.x = aScale
                    accelHead.position.x = aScale * 0.5 + 0.25
                    accelArrowGroup.rotation.y = a < 0 ? Math.PI : 0
                } else {
                    accelArrowGroup.visible = false
                }

                // Trail
                trailTimer += dt
                if (Math.abs(velocity) > 0.1 && trailTimer > 0.08) {
                    const tp = trailPoints[trailIdx % trailPoints.length]
                    tp.visible = true
                    tp.position.set(posX, 0.1, 0)
                    tp.material.opacity = 0.5
                    trailIdx++
                    trailTimer = 0
                }
                trailPoints.forEach(tp => {
                    if (tp.visible && tp.material.opacity > 0) {
                        tp.material.opacity -= 0.005
                        if (tp.material.opacity <= 0) tp.visible = false
                    }
                })

                // Speedometer
                speedBar.scale.x = Math.abs(velocity) * 2
                speedBar.position.x = posX
                speedBar.material.color.setHex(Math.abs(velocity) > 5 ? 0xe63946 : 0xfbbf24)

                // Phase
                let phase = 'RESTING'
                if (Math.abs(velocity) > 0.05) {
                    phase = pushing ? 'ACCELERATING' : 'COASTING'
                }
                if (pushing && Math.abs(velocity) < 0.05) phase = 'STARTING'

                const momentum = m * velocity

                setHudData({
                    force: F.toFixed(1),
                    mass: m.toFixed(1),
                    accel: a.toFixed(2),
                    velocity: velocity.toFixed(2),
                    position: posX.toFixed(1),
                    momentum: momentum.toFixed(1),
                    phase
                })
            },
            reset: () => {
                velocity = 0
                posX = 0
                crateGroup.position.x = 0
                crate.rotation.z = 0
                trailPoints.forEach(tp => { tp.visible = false })
            }
        }
    }, [mass, appliedForce])

    const buildSceneWrapper = useCallback((scene, camera, renderer, clock) => {
        const result = buildScene(scene, camera, renderer, clock)
        controlsRef.current = result
        return result
    }, [buildScene])

    useSimCanvas(mountRef, buildSceneWrapper)

    return (
        <div className="simulation-container">
            <div className="simulation-header">
                <span className="simulation-title">📊 F = ma DYNAMICS LAB</span>
                <span className="simulation-dot green"></span>
                <span className="simulation-dot amber"></span>
                <span className="simulation-dot red"></span>
            </div>

            <div className="simulation-canvas-wrapper" ref={mountRef}>
                {/* Equations overlay */}
                <div className="sim-math-overlay" style={{ fontSize: '1.1rem', top: 'auto', bottom: '0.8rem', transform: 'translateX(-50%)' }}>
                    <span style={{ color: '#e63946' }}>F</span> = <span style={{ color: '#2dce89' }}>{mass}kg</span> × <span style={{ color: '#00d4ff' }}>{hudData.accel}m/s²</span> = <strong style={{ color: '#fbbf24' }}>{(mass * parseFloat(hudData.accel)).toFixed(1)}N</strong>
                </div>

                {/* HUD */}
                <div className="sim-overlay-panel">
                    <h4 className="sim-overlay-title">Physics Dashboard</h4>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Phase:</span>
                        <span className={`sim-data-value ${hudData.phase === 'ACCELERATING' ? 'warning' : 'neutral'}`}>
                            {hudData.phase}
                        </span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#e63946' }}>Force:</span>
                        <span className="sim-data-value" style={{ color: '#e63946' }}>{hudData.force} N</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#00d4ff' }}>Accel:</span>
                        <span className="sim-data-value" style={{ color: '#00d4ff' }}>{hudData.accel} m/s²</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label">Velocity:</span>
                        <span className="sim-data-value">{hudData.velocity} m/s</span>
                    </div>
                    <div className="sim-data-row" style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.3rem', marginTop: '0.3rem' }}>
                        <span className="sim-data-label">Position:</span>
                        <span className="sim-data-value">{hudData.position} m</span>
                    </div>
                    <div className="sim-data-row">
                        <span className="sim-data-label" style={{ color: '#a855f7' }}>Momentum:</span>
                        <span className="sim-data-value" style={{ color: '#a855f7' }}>{hudData.momentum} kg·m/s</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="sim-overlay-panel right-side" style={{ minWidth: '120px' }}>
                    <h4 className="sim-overlay-title">Arrows</h4>
                    <div className="sim-data-row"><span style={{ color: '#e63946', fontSize: '0.85rem' }}>■ Force (F)</span></div>
                    <div className="sim-data-row"><span style={{ color: '#00d4ff', fontSize: '0.85rem' }}>■ Acceleration (a)</span></div>
                    <div className="sim-data-row" style={{ marginTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>■ Speed bar</span>
                    </div>
                </div>
            </div>
            <div className="simulation-controls">
                <button className="sim-btn" onClick={() => controlsRef.current?.reset?.()}>
                    ↺ RESET
                </button>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">FORCE:</span>
                    <input
                        type="range" className="sim-slider"
                        min="-20" max="20" step="0.5" value={appliedForce}
                        onChange={(e) => setAppliedForce(Number(e.target.value))}
                    />
                    <span className="sim-value">{appliedForce > 0 ? '+' : ''}{appliedForce.toFixed(1)}N</span>
                </div>
                <div className="sim-slider-group">
                    <span className="sim-slider-label">MASS:</span>
                    <input
                        type="range" className="sim-slider"
                        min="1" max="15" step="0.5" value={mass}
                        onChange={(e) => setMass(Number(e.target.value))}
                    />
                    <span className="sim-value">{mass.toFixed(1)}kg</span>
                </div>
            </div>
            <div className="sim-info">
                Drag FORCE to push/pull the crate. Change MASS to see how it affects acceleration. F = m × a — Newton's Second Law! 📏
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
