import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeBackground from './ThreeBackground'
import ForceBackground from './ForceBackground'
import PhysicsSimulation from './PhysicsSimulations'
import ExperientialActivity from './ExperientialActivity'
import courseData from './courseData'

/* ─── Helpers: YouTube parsing from document content ─── */
function getYouTubeId(value = '') {
  if (!value) return null

  const directId = value.match(/^[A-Za-z0-9_-]{11}$/)
  if (directId) return directId[0]

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return url.pathname.split('/').filter(Boolean)[0] || null
    }

    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      if (url.searchParams.get('v')) {
        return url.searchParams.get('v')
      }

      const parts = url.pathname.split('/').filter(Boolean)
      const marker = parts.findIndex((part) => part === 'shorts' || part === 'embed')
      if (marker !== -1 && parts[marker + 1]) {
        return parts[marker + 1]
      }
    }
  } catch {
    const fallback = value.match(/([A-Za-z0-9_-]{11})/)
    return fallback ? fallback[1] : null
  }

  const fallback = value.match(/([A-Za-z0-9_-]{11})/)
  return fallback ? fallback[1] : null
}

function ytEmbed(value) {
  const id = getYouTubeId(value)
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : value
}

function stripTags(text = '') {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSectionVideos(html = '', videoLookup = new Map()) {
  const matches = [...html.matchAll(/<a[^>]+href="([^"]*(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
  const seen = new Set()

  return matches.flatMap(([, href, label]) => {
    const id = getYouTubeId(href)
    if (!id || seen.has(id)) return []

    seen.add(id)
    const existing = videoLookup.get(id)
    return [{
      id,
      title: existing?.title || stripTags(label) || 'Topic Video',
      isShort: existing?.isShort || false
    }]
  })
}

function removeSectionVideoLinks(html = '') {
  return html.replace(/<p>\s*<a[^>]+href="[^"]*(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))[^"]*"[^>]*>[\s\S]*?<\/a>\s*<\/p>/gi, '')
}

/* ─── Sub-components ─── */
function VideoCard({ video }) {
  return (
    <motion.div
      className={`video-embed ${video.isShort ? 'video-short' : ''}`}
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ x: 1, y: 1 }}
      transition={{ type: "tween", duration: 0.1 }}
    >
      <div className={`video-aspect-ratio ${video.isShort ? 'is-short' : ''}`}>
        <iframe
          src={ytEmbed(video.id)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="video-caption">{video.title}</p>
    </motion.div>
  )
}

function DataTable({ headers, rows }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ScientistTitleArt() {
  return (
    <div className="unit-character-stack" aria-hidden="true">
      <motion.img
        src="/assets/galileo.webp"
        alt=""
        className="unit-character unit-character-back"
        animate={{ y: [0, -4, 0], rotate: [0, -1.5, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      />
      <motion.img
        src="/assets/newton.webp"
        alt=""
        className="unit-character unit-character-front"
        animate={{ y: [0, -6, 0], rotate: [0, 1.5, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.4 }}
      />
    </div>
  )
}

function SectionBlock({ section, index, videoLookup, unitId }) {
  const typeClass = section.type === 'activity' ? 'section-activity'
    : section.type === 'insight' ? 'section-insight'
      : ''

  const isNewton = index % 2 === 0
  const avatarSrc = isNewton ? '/assets/newton.webp' : '/assets/galileo.webp'
  const scientistName = isNewton ? 'Isaac Newton' : 'Galileo Galilei'
  const inlineVideos = section.type === 'table' ? [] : extractSectionVideos(section.content, videoLookup)
  const renderedContent = section.type === 'table' ? section.content : removeSectionVideoLinks(section.content)

  return (
    <motion.div
      className={`section-block ${typeClass}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ x: -1, y: -1 }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <div className="scientist-guide">
        <motion.img
          src={avatarSrc}
          alt={scientistName}
          className="scientist-avatar"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: isNewton ? 0 : 2 }}
        />
        <div className="scientist-bubble">
          <h3 className="section-heading">
            {section.type === 'activity' && <span className="section-badge badge-activity">🧪 Activity</span>}
            {section.type === 'insight' && <span className="section-badge badge-insight">💡 Insight</span>}
            {section.heading}
          </h3>

          <div className="section-layout">
            <div className="section-content-column">
              {section.type === 'table' ? (
                <DataTable headers={section.tableHeaders} rows={section.tableRows} />
              ) : (
                <>
                  <div className="section-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
                  {inlineVideos.length > 0 && (
                    <div className={`section-inline-videos ${unitId === 'unit-6' && index === 0 && inlineVideos.length > 1 ? 'split-75-25' : ''}`}>
                      {inlineVideos.map((video) => <VideoCard key={`${section.heading}-${video.id}`} video={video} />)}
                    </div>
                  )}
                </>
              )}
            </div>
            {section.image && (
              <div className="section-image-column">
                <img src={section.image} alt={section.heading} className="section-illustration" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Notes Panel (Retro Terminal Style) ─── */
function NotesPanel() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(() => localStorage.getItem('fm_notes') || '')

  const save = (val) => {
    setText(val)
    localStorage.setItem('fm_notes', val)
  }

  const download = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'force-motion-notes.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    if (confirm('Clear all notes?')) {
      setText('')
      localStorage.removeItem('fm_notes')
    }
  }

  return (
    <>
      <motion.button
        className="fab fab-notes"
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ x: 1, y: 1 }}
        transition={{ type: "tween", duration: 0.1 }}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Notes"
      >
        📝
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="notes-panel"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <div className="notes-header">
              <h3>📟 TERMINAL NOTES</h3>
              <button className="notes-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <textarea
              className="notes-area"
              value={text}
              onChange={(e) => save(e.target.value)}
              placeholder="> Jot down formulas or key points..."
            />
            <div className="notes-actions">
              <button className="notes-btn notes-download" onClick={download}>SAVE FILE</button>
              <button className="notes-btn notes-clear" onClick={clear}>CLEAR</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── Fullscreen Toggle ─── */
function FullscreenBtn() {
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen request problematic:', err)
      // Fallback for some browsers if standard fails
      setFs(false)
    }
  }

  return (
    <motion.button
      className="fab fab-fs"
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ x: 1, y: 1 }}
      transition={{ type: "tween", duration: 0.1 }}
      onClick={toggle}
      aria-label="Toggle Fullscreen"
    >
      {fs ? '✕' : '⛶'}
    </motion.button>
  )
}

/* ─── Unit View Component ─── */
function UnitView({ unit }) {
  if (!unit) return null

  const videoLookup = new Map(unit.videos.map((video) => [getYouTubeId(video.id), video]))
  const inlineVideoIds = new Set(unit.sections.flatMap((section) => extractSectionVideos(section.content, videoLookup).map((video) => video.id)))
  const galleryVideos = unit.videos.filter((video) => !inlineVideoIds.has(getYouTubeId(video.id)))

  return (
    <motion.div
      key={unit.id}
      className="unit-cards-layout"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        exit: { opacity: 0 }
      }}
    >
      <motion.div
        className="unit-header-card"
        style={{ '--unit-color': unit.color }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.4 } }
        }}
      >
        <ScientistTitleArt />
        <div>
          <div className="unit-eyebrow">Unit {unit.number}</div>
          <h2 className="unit-title">{unit.title}</h2>
        </div>
      </motion.div>

      {galleryVideos.length > 0 && (
        <motion.div
          className="video-gallery"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.4 } }
          }}
        >
          <h3 className="gallery-title">📽️ Topic Videos</h3>
          <div className="video-grid">
            {galleryVideos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </motion.div>
      )}

      {/* ── VERTICAL TIMELINE WRAPPER (Chapter Content) ── */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        <div className="sections-container">
          {unit.sections.map((s, i) => (
            <SectionBlock key={i} index={i} section={s} videoLookup={videoLookup} unitId={unit.id} />
          ))}
        </div>
      </div>

      {/* ── Physics Simulation for this unit (MOVED TO END) ── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.4 } }
        }}
      >
        <PhysicsSimulation unitNumber={unit.number} />
      </motion.div>
    </motion.div>
  )
}

function SummaryView({ summary }) {
  const questionnaireTabs = summary.questionnaire?.tabs ?? []
  const [activeTabId, setActiveTabId] = useState(questionnaireTabs[0]?.id ?? '')
  const [questionIndexByTab, setQuestionIndexByTab] = useState(() =>
    Object.fromEntries(questionnaireTabs.map((tab) => [tab.id, 0]))
  )
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const activeTab = questionnaireTabs.find((tab) => tab.id === activeTabId) ?? questionnaireTabs[0]
  const activeQuestionIndex = activeTab ? (questionIndexByTab[activeTab.id] ?? 0) : 0
  const activeQuestion = activeTab?.questions?.[activeQuestionIndex]
  const answerKey = activeQuestion ? `${activeTab.id}-${activeQuestionIndex}` : ''
  const selectedAnswer = answerKey ? selectedAnswers[answerKey] : undefined
  const isAnswered = Number.isInteger(selectedAnswer)
  const isCorrect = isAnswered && selectedAnswer === activeQuestion.correctIndex
  const answeredCount = activeTab
    ? activeTab.questions.filter((_, index) => Object.hasOwn(selectedAnswers, `${activeTab.id}-${index}`)).length
    : 0

  const goToQuestion = (direction) => {
    if (!activeTab) return

    setQuestionIndexByTab((prev) => ({
      ...prev,
      [activeTab.id]: Math.max(0, Math.min((prev[activeTab.id] ?? 0) + direction, activeTab.questions.length - 1))
    }))
  }

  const selectAnswer = (optionIndex) => {
    if (!activeQuestion) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [answerKey]: optionIndex
    }))
  }

  return (
    <motion.div
      className="unit-cards-layout"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "tween", duration: 0.4 }}
    >
      <div className="unit-header-card" style={{ '--unit-color': '#2dce89' }}>
        <ScientistTitleArt />
        <div>
          <div className="unit-eyebrow">Chapter Recap</div>
          <h2 className="unit-title">{summary.heading}</h2>
        </div>
      </div>
      
      <motion.div 
        className="summary-infographic-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <img 
          src="https://login.skillizee.io/s/articles/69b26acb5568c89352886234/images/WhatsApp%20Image%202026-03-11%20at%2012.39.00.jpeg" 
          alt="Mastering the Three Laws of Motion Infographic" 
          className="summary-infographic"
        />
      </motion.div>

      <div className="summary-card">
        <ul className="summary-list">
          {summary.points.map((p, i) => (
            <motion.li
              key={i}
              className="summary-list-item"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "tween", duration: 0.3 }}
            >
              {p}
            </motion.li>
          ))}
        </ul>
      </div>

      {activeTab && (
        <motion.div
          className="summary-questionnaire"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="summary-questionnaire-header">
            <div>
              <div className="summary-questionnaire-eyebrow">Practice Zone</div>
              <h3 className="summary-questionnaire-title">{summary.questionnaire.heading}</h3>
            </div>
            <p className="summary-questionnaire-intro">{summary.questionnaire.intro}</p>
          </div>

          <div className="summary-tab-list" role="tablist" aria-label="Revision questionnaire tabs">
            {questionnaireTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab.id === tab.id}
                className={`summary-tab-btn ${activeTab.id === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={`${activeTab.id}-${activeQuestionIndex}`}
            className="summary-tab-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="summary-tab-copy">
              <div className="summary-mcq-meta">
                <span className="summary-question-tag">{activeQuestion.tag}</span>
                <span className="summary-mcq-counter">Question {activeQuestionIndex + 1} / {activeTab.questions.length}</span>
              </div>
              <h4>{activeTab.title}</h4>
              <p>{activeTab.prompt}</p>
            </div>

            <div className="summary-mcq-progress" aria-hidden="true">
              <span style={{ width: `${((activeQuestionIndex + 1) / activeTab.questions.length) * 100}%` }} />
            </div>

            <div className="summary-mcq-card">
              <p className="summary-mcq-question">{activeQuestion.question}</p>

              <div className="summary-option-list">
                {activeQuestion.options.map((option, optionIndex) => {
                  const optionLetter = String.fromCharCode(65 + optionIndex)
                  const state = !isAnswered
                    ? ''
                    : optionIndex === activeQuestion.correctIndex
                      ? 'correct'
                      : optionIndex === selectedAnswer
                        ? 'incorrect'
                        : ''

                  return (
                    <button
                      key={`${answerKey}-${optionIndex}`}
                      type="button"
                      className={`summary-option-btn ${selectedAnswer === optionIndex ? 'selected' : ''} ${state}`}
                      onClick={() => selectAnswer(optionIndex)}
                    >
                      <span className="summary-option-letter">{optionLetter}</span>
                      <span>{option}</span>
                    </button>
                  )
                })}
              </div>

              {isAnswered && (
                <div className={`summary-answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <strong>{isCorrect ? 'Correct answer' : 'Try to notice the concept'}</strong>
                  <p>{activeQuestion.explanation}</p>
                </div>
              )}
            </div>

            <div className="summary-mcq-footer">
              <span className="summary-mcq-status">{answeredCount} of {activeTab.questions.length} answered in this tab</span>
              <div className="summary-mcq-nav">
                <button
                  type="button"
                  className="summary-nav-btn"
                  disabled={activeQuestionIndex === 0}
                  onClick={() => goToQuestion(-1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="summary-nav-btn"
                  disabled={activeQuestionIndex === activeTab.questions.length - 1}
                  onClick={() => goToQuestion(1)}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ─── Retro Landing Page ─── */
function RetroLanding() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="retro-landing">
        {courseData.units.map((unit, i) => (
          <motion.div
            key={unit.id}
            className="retro-unit-card"
            onClick={() => navigate(`/unit${unit.number}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "tween", duration: 0.3 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/unit${unit.number}`)}
          >
            <div className="retro-card-header" style={{ background: unit.color }}>
              <span className="retro-card-number">UNIT {unit.number}</span>
              <span className="retro-card-dot"></span>
            </div>
            <div className="retro-card-body">
              <span className="retro-card-icon">{unit.icon}</span>
              <span className="retro-card-title">{unit.title}</span>
            </div>
            <div className="retro-card-footer">
              <span className="retro-card-cta">► START</span>
            </div>
          </motion.div>
        ))}

        {/* Summary Card */}
        <motion.div
          className="retro-unit-card"
          onClick={() => navigate('/summary')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, type: "tween", duration: 0.3 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/summary')}
        >
          <div className="retro-card-header" style={{ background: '#2dce89' }}>
            <span className="retro-card-number">RECAP</span>
            <span className="retro-card-dot"></span>
          </div>
          <div className="retro-card-body">
            <span className="retro-card-icon">🎓</span>
            <span className="retro-card-title">Summary</span>
          </div>
          <div className="retro-card-footer">
            <span className="retro-card-cta">► REVIEW</span>
          </div>
        </motion.div>

        {/* Experiential Activity Card */}
        <motion.div
          className="retro-unit-card"
          onClick={() => navigate('/experiential')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, type: "tween", duration: 0.3 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/experiential')}
        >
          <div className="retro-card-header" style={{ background: '#ef4444' }}>
            <span className="retro-card-number">EXPERIENTIAL</span>
            <span className="retro-card-dot"></span>
          </div>
          <div className="retro-card-body">
            <span className="retro-card-icon">🎮</span>
            <span className="retro-card-title">3D Activities</span>
          </div>
          <div className="retro-card-footer">
            <span className="retro-card-cta">► ENTER LAB</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Main App ─── */
export default function App() {
  const location = useLocation()

  const match = location.pathname.match(/unit(\d+)/)
  const activeUnit = match ? parseInt(match[1], 10) : (location.pathname === '/summary' ? 'summary' : 0)

  return (
    <div className="app-container">
      {/* ── TOP DARK HEADER REGION ── */}
      <div className="header-block">
        <ThreeBackground activeUnit={activeUnit || 1} />
        <div className="light-overlay" />

        <header className="page-header">
          <motion.h1
            className="main-title"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "tween", duration: 0.5 }}
          >
            <span className="title-bold">Force</span> &amp; Laws of <span className="title-bold">Motion</span>
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "tween", duration: 0.4 }}
          >
            {courseData.subtitle}
          </motion.p>
        </header>
      </div>

      <FullscreenBtn />
      <NotesPanel />

      {/* ── BEIGE CONTENT REGION ── */}
      <div className="content-wrapper">
        <ForceBackground />
        <div className="retro-corner-tl"></div>
        <div className="retro-corner-tr"></div>
        <div className="retro-corner-bl"></div>
        <div className="retro-corner-br"></div>

        <main className="tab-content-area">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<RetroLanding />} />
              {courseData.units.map(unit => (
                <Route
                  key={`route-${unit.id}`}
                  path={`/unit${unit.number}`}
                  element={<UnitView unit={unit} />}
                />
              ))}
              <Route path="/summary" element={<SummaryView summary={courseData.summary} />} />
              <Route path="/experiential" element={<ExperientialActivity />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
