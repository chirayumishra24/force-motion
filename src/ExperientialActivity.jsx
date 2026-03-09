import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useDragControls } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// -------------------------------------------------------------
// 2D SCENES FOR EACH CHAPTER (SVG / Framer Motion Based)
// -------------------------------------------------------------

// Chapter 1: 2D Force push/pull vector (Drag to push)
function Scene2DChapter1({ setTelemetry }) {
    useEffect(() => {
        setTelemetry({
            Status: "PhET Simulation Linked",
            Topic: "Forces and Motion Basics",
            View: "Embedded IFrame"
        })
    }, [setTelemetry])

    return (
        <div className="sim-2d-container" style={{ padding: 0, width: '100%', height: '100%' }}>
            <iframe
                src="https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allowFullScreen
                title="PhET Forces and Motion Basics"
            ></iframe>
        </div>
    )
}

// Chapter 2: 2D Balance Board (PhET-style Drag & Drop)
function Scene2DChapter2({ setTelemetry }) {
    useEffect(() => {
        setTelemetry({
            Status: "PhET Simulation Linked",
            Topic: "Balancing Act",
            View: "Embedded IFrame"
        })
    }, [setTelemetry])

    return (
        <div className="sim-2d-container" style={{ padding: 0, width: '100%', height: '100%' }}>
            <iframe
                src="https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allowFullScreen
                title="PhET Balancing Act"
            ></iframe>
        </div>
    )
}

// Chapter 3: PhET Motion Series
function Scene2DChapter3({ setTelemetry }) {
    useEffect(() => {
        setTelemetry({
            Status: "PhET Simulation Linked",
            Topic: "Motion Series",
            View: "Embedded IFrame"
        })
    }, [setTelemetry])

    return (
        <div className="sim-2d-container" style={{ padding: 0, width: '100%', height: '100%' }}>
            <iframe
                src="https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=forces-and-motion"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allowFullScreen
                title="PhET Motion Series (Forces and Motion)"
            ></iframe>
        </div>
    )
}

// Chapter 4: PhET Ramp Forces and Motion
function Scene2DChapter4({ setTelemetry }) {
    useEffect(() => {
        setTelemetry({
            Status: "PhET Simulation Linked",
            Topic: "Ramp Forces and Motion",
            View: "Embedded IFrame"
        })
    }, [setTelemetry])

    return (
        <div className="sim-2d-container" style={{ padding: 0, width: '100%', height: '100%' }}>
            <iframe
                src="https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=ramp-forces-and-motion"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allowFullScreen
                title="PhET Motion Series (Ramp Forces and Motion)"
            ></iframe>
        </div>
    )
}

const ScenesMap = {
    1: Scene2DChapter1,
    2: Scene2DChapter2,
    3: Scene2DChapter3,
    4: Scene2DChapter4
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function ExperientialActivity() {
    const navigate = useNavigate()
    const [activeActivity, setActiveActivity] = useState(1)
    const [telemetry, setTelemetry] = useState({})

    const ActiveScene = ScenesMap[activeActivity] || Scene2DChapter1

    return (
        <div className="experiential-layout">
            {/* SIDEBAR NAVIGATION */}
            <div className="exp-sidebar">
                <div className="exp-sidebar-header">
                    <button className="exp-back-btn" onClick={() => navigate('/')}>◄ BACK</button>
                    <h2>ACTIVITIES</h2>
                </div>
                <div className="exp-chapter-list">
                    {[1, 2, 3, 4].map(act => (
                        <button
                            key={act}
                            className={"exp-chapter-btn " + (activeActivity === act ? "active" : "")}
                            onClick={() => {
                                setActiveActivity(act)
                                setTelemetry({}) // Clear telemetry on switch
                            }}
                        >
                            <span className="ch-num">ACTIVITY {act}</span>
                            <span className="ch-dot"></span>
                        </button>
                    ))}
                </div>

                {/* TELEMETRY HUD */}
                <div className="exp-telemetry">
                    <h3>TELEMETRY</h3>
                    {Object.keys(telemetry).length === 0 && <span className="tel-value" style={{ color: 'grey' }}>Interact with scene...</span>}
                    {Object.keys(telemetry).map(key => (
                        <div className="tel-row" key={key}>
                            <span className="tel-label">{key}:</span>
                            <span className="tel-value">{telemetry[key]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN 2D CANVAS */}
            <div className="exp-main 2d-mode">
                <ActiveScene setTelemetry={setTelemetry} />
            </div>
        </div >
    )
}
