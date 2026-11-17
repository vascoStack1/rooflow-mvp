import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'

type Screen =
  | 'home'
  | 'planning'
  | 'planning-detail'
  | 'planning-method'
  | 'd-inspection'
  | 'd-defect'
  | 'd-office'
  | 'e-record'
  | 'e-loading'
  | 'e-transcript'
  | 'e-check'
  | 'f-camera'
  | 'f-loading'
  | 'f-result'
  | 'f-confirm'

type IconName =
  | 'home'
  | 'list'
  | 'mic'
  | 'camera'
  | 'plus'
  | 'chevron'
  | 'building'
  | 'check'
  | 'sparkles'
  | 'send'
  | 'ruler'
  | 'material'
  | 'warning'
  | 'clock'
  | 'edit'
  | 'pin'
  | 'phone'
  | 'shield'
  | 'route'
  | 'roof'

type Inspection = {
  id: string
  time: string
  name: string
  address: string
  roof: string
  area: string
  travel: string
  distance: string
  contact: string
  phone: string
  access: string
  fallProtection: boolean
  lastInspection: string
}

const INSPECTIONS: Inspection[] = [
  {
    id: 'zaandam',
    time: '08:30',
    name: 'Bedrijfspand Zaandam',
    address: 'Industrieweg 14, Zaandam',
    roof: 'Bitumen plat dak',
    area: '850 m²',
    travel: '25 min',
    distance: '18 km',
    contact: 'Sander de Boer',
    phone: '06 12 34 56 78',
    access: 'Sleutel bij receptie, dakluik via trappenhuis B',
    fallProtection: true,
    lastInspection: '12 november 2024',
  },
  {
    id: 'purmerend',
    time: '11:00',
    name: 'Basisschool De Linde',
    address: 'Lindelaan 3, Purmerend',
    roof: 'EPDM',
    area: '420 m²',
    travel: '25 min',
    distance: '18 km',
    contact: 'Marieke Jansen',
    phone: '06 87 65 43 21',
    access: 'Aanmelden bij conciërge, ladder staat in berging',
    fallProtection: false,
    lastInspection: '4 februari 2024',
  },
  {
    id: 'amsterdam',
    time: '14:00',
    name: 'Loods Amsterdam-Noord',
    address: 'Buiksloterweg 88, Amsterdam',
    roof: 'Bitumen met lichtkoepels',
    area: '1.200 m²',
    travel: '35 min',
    distance: '26 km',
    contact: 'Niels Vermeer',
    phone: '06 45 67 89 01',
    access: 'Melden bij slagboom, toegang via technische ruimte',
    fallProtection: true,
    lastInspection: '21 augustus 2024',
  },
]

const PHOTO =
  'https://images.unsplash.com/photo-1694415847950-973e7dcca94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080'

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  const paths: Record<IconName, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9M9 21v-7h6v7" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
    mic: (
      <>
        <rect x="8" y="2" width="8" height="13" rx="4" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
        <circle cx="12" cy="14" r="4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    building: (
      <>
        <path d="M4 21V5l8-3v19M12 8h8v13M2 21h20" />
        <path d="M7 7h2M7 11h2M7 15h2M15 12h2M15 16h2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    sparkles: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" />
      </>
    ),
    send: <path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2" />,
    ruler: (
      <>
        <path d="m4 19 15-15 2 2L6 21H4v-2Z" />
        <path d="m13 8 3 3M10 11l2 2M7 14l3 3" />
      </>
    ),
    material: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    warning: (
      <>
        <path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="5" r="2" />
        <path d="M8 19h3a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3" />
      </>
    ),
    roof: (
      <>
        <path d="m2.5 12 9.5-8 9.5 8" />
        <path d="M5 10.5V20h14v-9.5" />
        <path d="M8.5 20v-5.5h7V20" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Header({
  onBack,
  onHome,
  label,
}: {
  onBack: () => void
  onHome: () => void
  label: string
}) {
  return (
    <div className="topbar">
      <button className="icon-button back-button" onClick={onBack} aria-label="Vorige scherm">
        ‹
      </button>
      <div className="topbar-center">
        <div className="topbar-label">{label}</div>
        <div className="topbar-user">Jan de Vries · Dakdekker</div>
      </div>
      <button className="icon-button" onClick={onHome} aria-label="Naar start">
        <Icon name="home" size={20} />
      </button>
    </div>
  )
}

function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'dark'
  disabled?: boolean
  icon?: IconName
}) {
  return (
    <button className={`action-button ${variant}`} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={19} />}
      {children}
    </button>
  )
}

function SectionTitle({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="section-title">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <div className="page-title">{title}</div>
      {intro && <div className="page-intro">{intro}</div>}
    </div>
  )
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="chips">
      {options.map((option) => (
        <button
          key={option}
          className={`chip ${value === option ? 'selected' : ''}`}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          {value === option && <Icon name="check" size={14} />}
          {option}
        </button>
      ))}
    </div>
  )
}

function PlanningList({
  completed,
  selectedId,
  onSelect,
}: {
  completed: string[]
  selectedId: string | null
  onSelect: (inspection: Inspection) => void
}) {
  const firstPending = INSPECTIONS.findIndex((inspection) => !completed.includes(inspection.id))

  return (
    <div className="planning-list">
      {INSPECTIONS.map((inspection, index) => {
        const isDone = completed.includes(inspection.id)
        const status = isDone ? 'Afgerond' : index === firstPending ? (completed.length ? 'Volgende' : 'Nu bezig') : 'Gepland'
        return (
          <button key={inspection.id} className={`planning-card ${selectedId === inspection.id ? 'selected' : ''}`} onClick={() => onSelect(inspection)}>
            <div className="planning-time">{inspection.time}</div>
            <div className="planning-card-main">
              <div className="planning-card-head">
                <strong>{inspection.name}</strong>
                <span className={`planning-status ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
              </div>
              <div className="planning-address"><Icon name="pin" size={13} /> {inspection.address}</div>
              <div className="planning-facts"><span>{inspection.roof}</span><i /> <span>{inspection.area}</span></div>
              <div className="planning-route"><Icon name="route" size={14} /> {inspection.travel} · {inspection.distance}{status === 'Volgende' ? ' vanaf huidige locatie' : ''}</div>
            </div>
            <Icon name="chevron" size={17} />
          </button>
        )
      })}
    </div>
  )
}

function InspectionDetail({
  inspection,
  status,
  safety,
  onToggleSafety,
  onNavigate,
  onStart,
}: {
  inspection: Inspection
  status: string
  safety: Record<string, boolean>
  onToggleSafety: (item: string) => void
  onNavigate: () => void
  onStart: () => void
}) {
  return (
    <div className="inspection-detail-screen">
      <div className="detail-heading">
        <div><span>{inspection.time} · Vandaag</span><strong>{inspection.name}</strong><small>{inspection.address}</small></div>
        <span className={`planning-status ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
      </div>
      <div className="static-map">
        <i className="road r1" /><i className="road r2" /><i className="road r3" />
        <div className="map-label">{inspection.address.split(',')[0]}</div>
        <div className="map-pin"><Icon name="pin" size={24} /></div>
        <button onClick={onNavigate}><Icon name="route" size={17} /> Navigeer</button>
      </div>
      <div className="detail-grid">
        <section className="detail-card customer-card">
          <div className="detail-card-title">Klant & toegang</div>
          <div className="contact-row">
            <div><small>Contactpersoon</small><strong>{inspection.contact}</strong><span>{inspection.phone}</span></div>
            <button onClick={() => { window.location.href = `tel:${inspection.phone.replaceAll(' ', '')}` }} aria-label={`Bel ${inspection.contact}`}><Icon name="phone" size={19} /></button>
          </div>
          <div className="access-note"><Icon name="pin" size={17} /><div><small>Toegangsinfo</small><span>{inspection.access}</span></div></div>
        </section>
        <section className="detail-card roof-card">
          <div className="detail-card-title">Dakgegevens</div>
          <div className="roof-facts">
            <div><span>Daktype</span><strong>{inspection.roof}</strong></div>
            <div><span>Oppervlakte</span><strong>{inspection.area}</strong></div>
            <div><span>Valbeveiliging</span><strong>{inspection.fallProtection ? 'Ja' : 'Nee'}</strong></div>
            <div><span>Laatste inspectie</span><strong>{inspection.lastInspection}</strong></div>
          </div>
        </section>
      </div>
      <section className="detail-card previous-defects">
        <div className="detail-card-title">Bekende gebreken vorige inspectie</div>
        <div><span className="defect-bullet">01</span><strong>Scheurvorming dakrand</strong><small>1,4 m¹</small><b>Opnieuw controleren</b></div>
        <div><span className="defect-bullet">02</span><strong>Blaasvorming bitumen</strong><small>0,8 m²</small><b>Opnieuw controleren</b></div>
      </section>
      <section className="detail-card safety-card">
        <div className="detail-card-title"><Icon name="shield" size={17} /> Veiligheidscheck</div>
        <div className="safety-options">
          {['Helm', 'Harnas', 'Ladder'].map((item) => (
            <button key={item} className={safety[item] ? 'checked' : ''} onClick={() => onToggleSafety(item)}>
              <span>{safety[item] && <Icon name="check" size={15} />}</span>{item}
            </button>
          ))}
        </div>
      </section>
      <Button onClick={onStart}>Start inspectie</Button>
    </div>
  )
}

function MethodPicker({ inspection, onPick }: { inspection: Inspection; onPick: (screen: Screen) => void }) {
  const methods: { title: string; sub: string; icon: IconName; target: Screen; tone: string }[] = [
    { title: 'Vaste velden', sub: 'Snel registreren', icon: 'list', target: 'd-defect', tone: 'd-green' },
    { title: 'Spraak', sub: 'Vertel wat je ziet', icon: 'mic', target: 'e-record', tone: 'e-petrol' },
    { title: 'Foto', sub: 'AI-herkenning', icon: 'camera', target: 'f-camera', tone: 'f-yellow' },
  ]
  return (
    <div className="method-picker">
      <SectionTitle eyebrow={`${inspection.time} · ${inspection.name}`} title="Hoe wil je inspecteren?" intro="De locatiegegevens zijn al voor je ingevuld." />
      <div className="method-grid">
        {methods.map((method) => (
          <button key={method.title} className={`method-card ${method.tone}`} onClick={() => onPick(method.target)}>
            <span><Icon name={method.icon} size={26} /></span>
            <div><strong>{method.title}</strong><small>{method.sub}</small></div>
            <Icon name="chevron" size={19} />
          </button>
        ))}
      </div>
    </div>
  )
}

function IpadSidebar({
  screen,
  onNavigate,
  activeInspection,
}: {
  screen: Screen
  onNavigate: (screen: Screen) => void
  activeInspection?: Inspection
}) {
  const defects = [
    ['01', 'Scheurvorming', 'Gevel · 1,2 m¹'],
    ['02', 'Vochtschade', 'Plafond · 0,8 m²'],
    ['03', 'Loszittend voegwerk', 'Galerij · 3 st'],
  ]

  return (
    <aside className="ipad-sidebar">
      <button className="sidebar-brand" onClick={() => onNavigate('home')}>
        <span><Icon name="roof" size={22} /></span>
        <div><strong>RooFlow</strong><small>Schadenberg Dakwerken</small></div>
      </button>
      <div className="sidebar-project">
        <div className="eyebrow">Actieve inspectie</div>
        <div className="sidebar-project-title">{activeInspection?.name ?? 'Complex De Wilg'}</div>
        <div className="sidebar-project-sub">{activeInspection?.address ?? 'Vleugel B · Tweede verdieping'}</div>
        <div className="progress-head"><span>Voortgang</span><strong>6 van 18</strong></div>
        <div className="progress-track"><span /></div>
      </div>
      <div className="sidebar-list-head"><span>Woning B-24</span><small>3 gebreken</small></div>
      <div className="sidebar-defects">
        {defects.map(([number, title, meta]) => (
          <button key={number} className="sidebar-defect" onClick={() => onNavigate('d-office')}>
            <span>{number}</span>
            <div><strong>{title}</strong><small>{meta}</small></div>
            <Icon name="chevron" size={15} />
          </button>
        ))}
      </div>
      <button className={`sidebar-add ${screen === 'd-defect' ? 'active' : ''}`} onClick={() => onNavigate('d-defect')}>
        <Icon name="plus" size={20} /> Gebrek toevoegen
      </button>
      <div className="sidebar-user">
        <strong>Jan de Vries</strong>
        <small>Dakdekker · Schadenberg Dakwerken</small>
      </div>
      <div className="sidebar-methods">
        <button className={screen.startsWith('e-') ? 'active' : ''} onClick={() => onNavigate('e-record')}><Icon name="mic" size={19} /> Spraak</button>
        <button className={screen.startsWith('f-') ? 'active' : ''} onClick={() => onNavigate('f-camera')}><Icon name="camera" size={19} /> Foto</button>
      </div>
    </aside>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [deviceMode, setDeviceMode] = useState<'phone' | 'ipad'>('ipad')
  const [history, setHistory] = useState<Screen[]>([])
  const [toast, setToast] = useState('')
  const [selectedPlanningId, setSelectedPlanningId] = useState<string | null>(null)
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null)
  const [completedInspections, setCompletedInspections] = useState<string[]>([])
  const [safety, setSafety] = useState<Record<string, boolean>>({ Helm: false, Harnas: false, Ladder: false })
  const [material, setMaterial] = useState('')
  const [defectType, setDefectType] = useState('')
  const [measure, setMeasure] = useState(0)
  const [unit, setUnit] = useState('m²')
  const [statuses, setStatuses] = useState(['Te controleren', 'Gecontroleerd', 'Definitief'])
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [flash, setFlash] = useState(false)
  const [photoType, setPhotoType] = useState('Scheurvorming')
  const [photoMeasure, setPhotoMeasure] = useState('1,8')
  const timerRef = useRef<number | null>(null)

  const navigate = (next: Screen) => {
    setHistory((current) => [...current, screen])
    setScreen(next)
  }

  const replace = (next: Screen) => setScreen(next)

  const goBack = () => {
    const previous = history.at(-1) ?? 'home'
    setHistory((current) => current.slice(0, -1))
    setScreen(previous)
  }

  const goHome = () => {
    setHistory([])
    setScreen('home')
    setRecording(false)
  }

  const finish = (message: string) => {
    if (activeInspectionId) {
      setCompletedInspections((current) => current.includes(activeInspectionId) ? current : [...current, activeInspectionId])
    }
    goHome()
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const selectPlanningInspection = (inspection: Inspection) => {
    setSelectedPlanningId(inspection.id)
    if (deviceMode === 'phone') navigate('planning-detail')
  }

  const beginInspection = (inspection: Inspection) => {
    setActiveInspectionId(inspection.id)
    navigate('planning-method')
  }

  const activeInspection = INSPECTIONS.find((inspection) => inspection.id === activeInspectionId)
  const selectedInspection = INSPECTIONS.find((inspection) => inspection.id === selectedPlanningId)
  const planningStatus = (inspection: Inspection) => {
    if (completedInspections.includes(inspection.id)) return 'Afgerond'
    const firstPending = INSPECTIONS.findIndex((item) => !completedInspections.includes(item.id))
    const index = INSPECTIONS.findIndex((item) => item.id === inspection.id)
    return index === firstPending ? (completedInspections.length ? 'Volgende' : 'Nu bezig') : 'Gepland'
  }

  useEffect(() => {
    if (screen === 'e-loading') {
      const timeout = window.setTimeout(() => replace('e-transcript'), 1500)
      return () => window.clearTimeout(timeout)
    }
    if (screen === 'f-loading') {
      const timeout = window.setTimeout(() => replace('f-result'), 1300)
      return () => window.clearTimeout(timeout)
    }
  }, [screen])

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    },
    [],
  )

  const startRecording = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setSeconds(0)
    setRecording(true)
    timerRef.current = window.setInterval(() => setSeconds((value) => value + 0.1), 100)
  }

  const stopRecording = () => {
    if (!recording) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
    setRecording(false)
    navigate('e-loading')
  }

  const takePhoto = () => {
    setFlash(true)
    window.setTimeout(() => {
      setFlash(false)
      navigate('f-loading')
    }, 220)
  }

  const cycleStatus = (index: number) => {
    const order = ['Te controleren', 'Gecontroleerd', 'Definitief']
    setStatuses((current) =>
      current.map((status, statusIndex) =>
        statusIndex === index ? order[(order.indexOf(status) + 1) % order.length] : status,
      ),
    )
  }

  const titleByScreen: Partial<Record<Screen, string>> = {
    planning: 'Planning vandaag',
    'planning-detail': 'Inspectiedetails',
    'planning-method': 'Start inspectie',
    'd-inspection': 'Vaste velden',
    'd-defect': 'Nieuw gebrek',
    'd-office': 'Kantoorweergave',
    'e-record': 'Spraakopname',
    'e-loading': 'Spraakopname',
    'e-transcript': 'Transcriptie',
    'e-check': 'Controle',
    'f-camera': 'Foto maken',
    'f-loading': 'Foto analyseren',
    'f-result': 'AI-resultaat',
    'f-confirm': 'Controleren',
  }

  const requiredComplete = Boolean(material && defectType && measure > 0)

  let content: ReactNode

  if (screen === 'home') {
    const tiles: { title: string; sub: string; icon: IconName; target: Screen; tone: string }[] = [
      { title: 'Vaste velden', sub: 'Snel registreren', icon: 'list', target: deviceMode === 'ipad' ? 'd-defect' : 'd-inspection', tone: 'd-green' },
      { title: 'Spraak', sub: 'Vertel wat je ziet', icon: 'mic', target: 'e-record', tone: 'e-petrol' },
      { title: 'Foto', sub: 'AI-herkenning', icon: 'camera', target: 'f-camera', tone: 'f-yellow' },
    ]
    content = (
      <div className="home-screen">
        <div className="brand-row">
          <div className="brand-mark"><Icon name="roof" size={24} /></div>
          <div>
            <div className="brand-name">RooFlow</div>
            <div className="brand-sub">Schadenberg Dakwerken</div>
          </div>
          <div className="device-toggle" aria-label="Kies apparaatweergave">
            <button className={deviceMode === 'phone' ? 'active' : ''} onClick={() => setDeviceMode('phone')}>Telefoon</button>
            <button className={deviceMode === 'ipad' ? 'active' : ''} onClick={() => setDeviceMode('ipad')}>iPad</button>
          </div>
        </div>
        <div className="home-heading">
          <div className="eyebrow">Prototype oplossingen</div>
          <div className="hero-title">Goedemorgen,<br />Jan</div>
          <div className="page-intro">Hoe wil je vandaag inspecteren?</div>
        </div>
        <div className="tile-grid">
          {tiles.map((tile) => (
            <button key={tile.title} className={`solution-tile ${tile.tone}`} onClick={() => navigate(tile.target)}>
              <div className="tile-top">
                <span className="tile-arrow"><Icon name="chevron" size={18} /></span>
              </div>
              <div className="tile-icon"><Icon name={tile.icon} size={27} /></div>
              <div className="tile-title">{tile.title}</div>
              <div className="tile-sub">{tile.sub}</div>
            </button>
          ))}
        </div>
        <button className="today-card" onClick={() => { setSelectedPlanningId(null); navigate('planning') }}>
          <div className="today-icon"><Icon name="building" size={22} /></div>
          <div>
            <div className="small-label">Vandaag</div>
            <div className="today-title">{completedInspections.length ? `${completedInspections.length} van 3 afgerond` : '3 inspecties gepland'}</div>
          </div>
          <Icon name="chevron" size={18} />
        </button>
        <div className="home-footer">RooFlow · Vas&amp;Co × Schadenberg Dakwerken</div>
      </div>
    )
  } else if (screen === 'planning') {
    content = deviceMode === 'ipad' ? (
      <div className="planning-ipad">
        <div className="planning-ipad-list">
          <SectionTitle eyebrow="Di 3 november" title="Planning vandaag" intro="3 inspecties · ± 1 u 45 min reistijd" />
          <PlanningList completed={completedInspections} selectedId={selectedPlanningId} onSelect={selectPlanningInspection} />
        </div>
        <div className="planning-ipad-detail">
          {selectedInspection ? (
            <InspectionDetail
              inspection={selectedInspection}
              status={planningStatus(selectedInspection)}
              safety={safety}
              onToggleSafety={(item) => setSafety((current) => ({ ...current, [item]: !current[item] }))}
              onNavigate={() => showToast('Opent Google Maps / Apple Kaarten')}
              onStart={() => beginInspection(selectedInspection)}
            />
          ) : (
            <div className="planning-empty"><span><Icon name="building" size={30} /></span><strong>Selecteer een inspectie</strong><p>Bekijk hier de locatie, klantgegevens en veiligheidsinformatie.</p></div>
          )}
        </div>
      </div>
    ) : (
      <div className="screen-content planning-phone">
        <SectionTitle eyebrow="Di 3 november" title="Planning vandaag" intro="3 inspecties · ± 1 u 45 min reistijd" />
        <PlanningList completed={completedInspections} selectedId={selectedPlanningId} onSelect={selectPlanningInspection} />
      </div>
    )
  } else if (screen === 'planning-detail') {
    const inspection = selectedInspection ?? INSPECTIONS[0]
    content = (
      <div className="screen-content detail-phone">
        <InspectionDetail
          inspection={inspection}
          status={planningStatus(inspection)}
          safety={safety}
          onToggleSafety={(item) => setSafety((current) => ({ ...current, [item]: !current[item] }))}
          onNavigate={() => showToast('Opent Google Maps / Apple Kaarten')}
          onStart={() => beginInspection(inspection)}
        />
      </div>
    )
  } else if (screen === 'planning-method') {
    content = (
      <div className="screen-content method-screen">
        <MethodPicker
          inspection={activeInspection ?? selectedInspection ?? INSPECTIONS[0]}
          onPick={(target) => navigate(target === 'd-defect' && deviceMode === 'phone' ? 'd-inspection' : target)}
        />
      </div>
    )
  } else if (screen === 'd-inspection') {
    content = (
      <div className="screen-content">
        <SectionTitle eyebrow="Vaste velden" title={activeInspection?.name ?? 'Complex De Wilg'} intro={activeInspection?.address ?? 'Vleugel B · Tweede verdieping'} />
        <div className="progress-card">
          <div className="progress-head"><span>Inspectievoortgang</span><strong>6 van 18</strong></div>
          <div className="progress-track"><span /></div>
        </div>
        <div className="room-heading"><div>Woning B-24</div><span>2 gebreken</span></div>
        <div className="defect-row">
          <div className="defect-number">01</div>
          <div><strong>Scheurvorming</strong><span>Gevel · 1,2 m¹</span></div>
          <span className="severity low">Laag</span>
        </div>
        <div className="defect-row">
          <div className="defect-number">02</div>
          <div><strong>Vochtschade</strong><span>Plafond · 0,8 m²</span></div>
          <span className="severity medium">Middel</span>
        </div>
        <button className="add-defect-card" onClick={() => navigate('d-defect')}>
          <span><Icon name="plus" size={23} /></span>
          <div><strong>Gebrek toevoegen</strong><small>Registreer een nieuwe waarneming</small></div>
          <Icon name="chevron" size={19} />
        </button>
      </div>
    )
  } else if (screen === 'd-defect') {
    content = (
      <div className="screen-content">
        <SectionTitle eyebrow={activeInspection?.name ?? 'Woning B-24'} title="Type en maat" intro="Selecteer de vaste kenmerken van het gebrek." />
        <div className="step-line"><span className="active">1</span><i /><span>2</span><i /><span>3</span></div>
        <div className="choice-section">
          <div className="choice-title"><Icon name="material" size={19} /> Materiaal <span>*</span></div>
          <ChipGroup options={['Baksteen', 'Beton', 'Hout', 'Staal']} value={material} onChange={setMaterial} />
        </div>
        <div className="d-detail-grid">
          <div className="choice-section">
            <div className="choice-title"><Icon name="warning" size={19} /> Type gebrek <span>*</span></div>
            <ChipGroup options={['Scheur', 'Vocht', 'Loszittend', 'Corrosie']} value={defectType} onChange={setDefectType} />
          </div>
          <div className="choice-section">
            <div className="choice-title"><Icon name="ruler" size={19} /> Maat <span>*</span></div>
            <div className="measure-row">
              <div className="stepper">
                <button onClick={() => setMeasure((value) => Math.max(0, Number((value - 0.1).toFixed(1))))} aria-label="Maat verlagen">−</button>
                <strong>{measure.toFixed(1).replace('.', ',')}</strong>
                <button onClick={() => setMeasure((value) => Number((value + 0.1).toFixed(1)))} aria-label="Maat verhogen">+</button>
              </div>
              <div className="unit-picker">
                {['m²', 'm¹', 'st'].map((item) => <button key={item} className={unit === item ? 'selected' : ''} onClick={() => setUnit(item)}>{item}</button>)}
              </div>
            </div>
          </div>
        </div>
        {!requiredComplete && <div className="required-note">Vul materiaal, type en een maat groter dan 0 in.</div>}
        <Button disabled={!requiredComplete} onClick={() => navigate('d-office')}>Volgende</Button>
      </div>
    )
  } else if (screen === 'd-office') {
    const rows = [
      ['Scheur boven kozijn', 'Baksteen', 'Scheur', '1,2 m¹', 'Sika', '1'],
      ['Vochtplek plafond', 'Beton', 'Vocht', '0,8 m²', 'Remmers', '2'],
      ['Los voegwerk', material || 'Baksteen', defectType || 'Scheur', `${measure.toFixed(1).replace('.', ',')} ${unit}`, 'Weber', '3'],
    ]
    const sendButton = <Button variant="dark" icon="send" onClick={() => activeInspectionId ? finish('Inspectie afgerond en verzonden') : showToast('Verzonden naar Baudex')}>Naar Baudex (API)</Button>
    content = (
      <div className="screen-content office">
        <div className="office-title-row">
          <SectionTitle eyebrow="Ellen de Groot, Sales · Controle & overdracht" title="Kantoorweergave" intro="Tik op een status om deze te wijzigen." />
          {deviceMode === 'ipad' && <div className="office-send">{sendButton}</div>}
        </div>
        <div className="office-stats">
          <div><strong>18</strong><span>Gebreken</span></div><div><strong>11</strong><span>Gecontroleerd</span></div><div><strong>7</strong><span>Openstaand</span></div>
        </div>
        {deviceMode === 'ipad' ? (
          <div className="office-table">
            <div className="office-table-head"><span>Gebrek</span><span>Materiaal</span><span>Type</span><span>Maat</span><span>Merk</span><span>Aantal</span><span>Status</span></div>
            {rows.map((row, index) => (
              <div className="office-table-row" key={row[0]}>
                {row.map((cell) => <span key={cell}>{cell}</span>)}
                <button className={`status-button s${statuses[index].replaceAll(' ', '-').toLowerCase()}`} onClick={() => cycleStatus(index)}>{statuses[index]}</button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="office-list">
              {rows.map((row, index) => (
                <div className="office-row" key={row[0]}>
                  <div className="office-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="office-copy"><small>B-{24 + index}</small><strong>{row[0]}</strong><span>{row[1]} · {row[3]}</span></div>
                  <button className={`status-button s${statuses[index].replaceAll(' ', '-').toLowerCase()}`} onClick={() => cycleStatus(index)}>{statuses[index]}</button>
                </div>
              ))}
            </div>
            {sendButton}
          </>
        )}
      </div>
    )
  } else if (screen === 'e-record') {
    const wave = <div className="wave" aria-hidden="true">
      {[18, 30, 44, 26, 55, 38, 62, 32, 48, 24, 42, 20].map((height, index) => <i key={index} style={{ '--wave-height': `${height}px`, '--delay': `${index * 0.06}s` } as React.CSSProperties} />)}
    </div>
    const microphone = <>
      {wave}
      <div className="voice-timer">{seconds.toFixed(1).replace('.', ',')} sec</div>
      <button className="mic-button" onPointerDown={startRecording} onPointerUp={stopRecording} onPointerCancel={stopRecording} aria-label="Houd ingedrukt om op te nemen">
        <Icon name="mic" size={38} /><span />
      </button>
      <div className="hold-label">{recording ? 'Laat los om te stoppen' : 'Houd ingedrukt om te spreken'}</div>
    </>
    content = deviceMode === 'ipad' ? (
      <div className={`voice-ipad ${recording ? 'is-recording' : ''}`}>
        <div className="voice-ipad-left">
          <SectionTitle eyebrow={activeInspection ? `${activeInspection.name} · Spraak` : 'Spraak'} title="Vertel wat je ziet" intro="Houd de microfoon ingedrukt en spreek je waarneming in." />
          {microphone}
        </div>
        <div className="live-transcript">
          <div className="live-heading"><span><i className={recording ? 'active' : ''} /> Live transcriptie</span><small>{recording ? 'Luistert…' : 'Klaar voor opname'}</small></div>
          <div className={`live-copy ${recording ? 'speaking' : ''}`}>
            {seconds > 2.8 ? 'Op de gemetselde gevel boven het kozijn zit een verticale scheur van ongeveer één komma acht meter.' : seconds > 1.2 ? 'Op de gemetselde gevel boven het kozijn…' : recording ? 'Op de gemetselde gevel…' : 'Je gesproken tekst verschijnt hier tijdens het opnemen.'}
          </div>
          <div className="live-fields-title"><Icon name="sparkles" size={17} /> Herkende velden</div>
          <div className="live-fields">
            <div><span>Bouwdeel</span><strong>{seconds > 1.2 ? 'Gevel' : '—'}</strong></div>
            <div><span>Materiaal</span><strong>{seconds > 2 ? 'Baksteen' : '—'}</strong></div>
            <div><span>Type</span><strong>{seconds > 2.8 ? 'Scheur' : '—'}</strong></div>
            <div><span>Maat</span><strong>{seconds > 3.5 ? '1,8 m¹' : '—'}</strong></div>
          </div>
        </div>
      </div>
    ) : (
      <div className={`voice-screen ${recording ? 'is-recording' : ''}`}>
        <SectionTitle eyebrow={activeInspection ? `${activeInspection.name} · Spraak` : 'Spraak'} title="Vertel wat je ziet" intro="Houd de microfoon ingedrukt en spreek je waarneming in." />
        {microphone}
        <div className="voice-tip"><Icon name="sparkles" size={18} /> Noem bouwdeel, materiaal, gebrek en maat voor het beste resultaat.</div>
      </div>
    )
  } else if (screen === 'e-loading' || screen === 'f-loading') {
    const isVoice = screen === 'e-loading'
    content = (
      <div className="loading-screen">
        <div className="loader-orbit">
          <div className="loader-core"><Icon name={isVoice ? 'mic' : 'sparkles'} size={30} /></div>
          <span /><span /><span />
        </div>
        <SectionTitle title={isVoice ? 'We luisteren…' : 'Foto analyseren…'} intro={isVoice ? 'Je opname wordt omgezet naar tekst.' : 'AI zoekt naar materialen en gebreken.'} />
        <div className="loading-line"><span /></div>
      </div>
    )
  } else if (screen === 'e-transcript') {
    content = (
      <div className="screen-content">
        <SectionTitle eyebrow="Automatisch uitgeschreven" title="Transcriptie" intro="Controleer kort of we je goed hebben verstaan." />
        <div className="transcript-card">
          <div className="quote-mark">“</div>
          <p>Op de gemetselde gevel boven het kozijn zit een verticale scheur van ongeveer één komma acht meter. Het gebrek bevindt zich op de tweede verdieping en heeft middelhoge urgentie.</p>
          <button aria-label="Transcriptie bewerken"><Icon name="edit" size={18} /> Bewerken</button>
        </div>
        <div className="detected"><Icon name="sparkles" size={17} /> 4 velden herkend</div>
        <div className="button-stack">
          <Button onClick={() => navigate('e-check')}>Velden invullen</Button>
          <Button variant="secondary" onClick={() => { setSeconds(0); navigate('e-record') }}>Opnieuw</Button>
        </div>
      </div>
    )
  } else if (screen === 'e-check') {
    const fields = [['Bouwdeel', 'Gevel'], ['Materiaal', 'Baksteen'], ['Type gebrek', 'Scheurvorming'], ['Maat', '1,8 m¹'], ['Urgentie', 'Middelhoog']]
    content = (
      <div className="screen-content">
        <SectionTitle eyebrow="Controle" title="Klopt dit zo?" intro="De herkende velden staan klaar om op te slaan." />
        <div className="recognized-card">
          {fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong><Icon name="check" size={16} /></div>)}
        </div>
        <Button onClick={() => finish('Gebrek opgeslagen')} icon="check">Bevestig</Button>
        <Button variant="secondary" onClick={() => navigate('e-record')}>Opnieuw</Button>
      </div>
    )
  } else if (screen === 'f-camera') {
    const camera = (
      <div className="camera-screen">
        <img src={PHOTO} alt="Scheur in een witte buitenmuur" />
        {activeInspection && <div className="camera-location"><Icon name="pin" size={14} /> {activeInspection.name}</div>}
        <div className={`camera-flash ${flash ? 'visible' : ''}`} />
        <div className="camera-guide"><span /><span /><span /><span /></div>
        <div className="camera-hint">Breng het gebrek duidelijk in beeld</div>
        <div className="camera-controls">
          <button className="gallery-thumb" aria-label="Open galerij"><img src={PHOTO} alt="" /></button>
          <button className="shutter" onClick={takePhoto} aria-label="Maak foto"><span /></button>
          <button className="camera-switch" aria-label="Wissel camera">↻</button>
        </div>
      </div>
    )
    content = deviceMode === 'ipad' ? (
      <div className="photo-ipad">
        <div className="ipad-camera-panel">{camera}</div>
        <div className="ipad-ai-panel">
          <SectionTitle eyebrow={activeInspection ? `${activeInspection.name} · Foto` : 'Foto'} title="Maak een foto" intro="Zorg dat het gebrek scherp en volledig in beeld staat." />
          <div className="ai-waiting"><span><Icon name="sparkles" size={28} /></span><strong>Klaar voor analyse</strong><p>Na het maken van de foto verschijnen het materiaal, type gebrek en de geschatte maat hier.</p></div>
          <div className="camera-checks"><div><Icon name="check" size={15} /> Voldoende licht</div><div><Icon name="check" size={15} /> Gebrek binnen kader</div></div>
        </div>
      </div>
    ) : camera
  } else if (screen === 'f-result') {
    const resultDetails = <>
      <SectionTitle eyebrow={activeInspection ? `${activeInspection.name} · AI-herkenning` : 'Foto · AI-herkenning'} title="Gebrek gevonden" intro="We hebben de foto geanalyseerd." />
      <div className="ai-card">
        <div className="ai-heading"><span><Icon name="sparkles" size={18} /></span><div><small>Waarschijnlijk</small><strong>Scheurvorming</strong></div><b>92%</b></div>
        <div className="ai-grid"><div><span>Materiaal</span><strong>Stucwerk</strong></div><div><span>Geschatte maat</span><strong>1,8 m¹</strong></div></div>
      </div>
      {deviceMode === 'ipad' && <div className="confidence-bars">
        <div><span><b>Scheurvorming</b><small>92%</small></span><i><em style={{ width: '92%' }} /></i></div>
        <div><span><b>Vochtschade</b><small>18%</small></span><i><em style={{ width: '18%' }} /></i></div>
        <div><span><b>Loszittend</b><small>7%</small></span><i><em style={{ width: '7%' }} /></i></div>
      </div>}
      <Button onClick={() => navigate('f-confirm')}>Controleren</Button>
    </>
    content = deviceMode === 'ipad' ? (
      <div className="photo-ipad result">
        <div className="ipad-result-photo">
          <div className="analysis-photo"><img src={PHOTO} alt="Geanalyseerde scheur in een witte buitenmuur" /><span className="focus-box"><i>92%</i></span></div>
        </div>
        <div className="ipad-ai-panel">{resultDetails}</div>
      </div>
    ) : (
      <div className="screen-content photo-result">
        <SectionTitle eyebrow={activeInspection ? `${activeInspection.name} · AI-herkenning` : 'Foto · AI-herkenning'} title="Gebrek gevonden" intro="We hebben de foto geanalyseerd." />
        <div className="analysis-photo">
          <img src={PHOTO} alt="Geanalyseerde scheur in een witte buitenmuur" />
          <span className="focus-box"><i>92%</i></span>
        </div>
        <div className="ai-card">
          <div className="ai-heading"><span><Icon name="sparkles" size={18} /></span><div><small>Waarschijnlijk</small><strong>Scheurvorming</strong></div><b>92%</b></div>
          <div className="ai-grid"><div><span>Materiaal</span><strong>Stucwerk</strong></div><div><span>Geschatte maat</span><strong>1,8 m¹</strong></div></div>
        </div>
        <Button onClick={() => navigate('f-confirm')}>Controleren</Button>
      </div>
    )
  } else {
    content = (
      <div className="screen-content">
        <SectionTitle eyebrow={activeInspection ? activeInspection.name : 'Foto controleren'} title="Bevestig het gebrek" intro="Pas de AI-velden aan als dat nodig is." />
        <div className="confirm-photo-row">
          <img src={PHOTO} alt="Scheur in een witte buitenmuur" />
          <div><span>AI-herkenning</span><strong>92% zekerheid</strong></div>
          <Icon name="sparkles" size={20} />
        </div>
        <div className="choice-section">
          <div className="choice-title">Type gebrek</div>
          <ChipGroup options={['Scheurvorming', 'Vochtschade', 'Loszittend']} value={photoType} onChange={setPhotoType} />
        </div>
        <div className="choice-section">
          <label className="choice-title" htmlFor="photo-measure">Maat</label>
          <div className="measure-input">
            <input id="photo-measure" value={photoMeasure} onChange={(event) => setPhotoMeasure(event.target.value)} inputMode="decimal" />
            <span>m¹</span>
          </div>
        </div>
        <div className="ai-note"><Icon name="sparkles" size={18} /> Automatisch ingevuld op basis van de foto.</div>
        <Button onClick={() => finish('Gebrek opgeslagen')} icon="check">Opslaan</Button>
      </div>
    )
  }

  const isPlanningScreen = screen.startsWith('planning')

  return (
    <main className={`app-shell mode-${deviceMode}`}>
      <div className={`phone device-${deviceMode}`}>
        {screen !== 'home' && deviceMode === 'ipad' && !isPlanningScreen && <IpadSidebar screen={screen} activeInspection={activeInspection} onNavigate={(next) => next === 'home' ? goHome() : navigate(next)} />}
        <div className={screen !== 'home' && deviceMode === 'ipad' && !isPlanningScreen ? 'ipad-workspace' : ''}>
          {screen !== 'home' && <Header onBack={goBack} onHome={goHome} label={titleByScreen[screen] ?? ''} />}
          <div className="screen-slide" key={screen}>{content}</div>
        </div>
        {toast && <div className="toast"><span><Icon name="check" size={17} /></span>{toast}</div>}
      </div>
      <div className="photo-credit">RooFlow · Vas&amp;Co × Schadenberg Dakwerken · Foto door Lallaoke via Unsplash</div>
    </main>
  )
}

export default App
