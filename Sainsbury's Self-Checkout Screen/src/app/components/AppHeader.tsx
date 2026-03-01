import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  Volume2, VolumeX, HelpCircle, Globe, PhoneCall,
  ChevronDown, ChevronUp, MapPin, Zap, Type, Eye,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const STORE_LOCATION = '123 High Street, London, EC1A 1BB';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English',  native: 'English'  },
  { code: 'pl', flag: '🇵🇱', name: 'Polish',   native: 'Polski'   },
  { code: 'ro', flag: '🇷🇴', name: 'Romanian', native: 'Română'   },
  { code: 'es', flag: '🇪🇸', name: 'Spanish',  native: 'Español'  },
  { code: 'fr', flag: '🇫🇷', name: 'French',   native: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'German',   native: 'Deutsch'  },
  { code: 'ar', flag: '🇸🇦', name: 'Arabic',   native: 'العربية'  },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese',  native: '中文'     },
];

const FAQS = [
  {
    q: 'How do I scan an item?',
    a: 'Place the barcode facing the scanner until you hear a beep, or press the Barcode button on screen.',
  },
  {
    q: 'How do I remove an item?',
    a: 'Press "Remove item" in the top right, or tap the trash icon next to any item in your basket.',
  },
  {
    q: "My item won't scan",
    a: 'Try pressing "Barcode" on screen to simulate a scan, or ask an attendant for assistance.',
  },
  {
    q: 'Can I pay with cash?',
    a: 'Yes — select Cash Payment on the payment screen. Notes and coins are both accepted.',
  },
];

type Modal = 'sound' | 'help' | 'language' | null;

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 48, height: 26, borderRadius: 99, flexShrink: 0,
        background: on ? '#FF8200' : '#333',
        position: 'relative', cursor: 'pointer', transition: 'background 0.25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 24 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
      }} />
    </div>
  );
}

function AccessRow({
  icon, label, sub, on, onToggle,
}: {
  icon: ReactNode; label: string; sub: string; on: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#242424', border: `1px solid ${on ? '#FF820044' : '#2e2e2e'}`,
      borderRadius: 12, padding: '14px 16px', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: on ? 'rgba(255,130,0,0.15)' : '#1e1e1e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: on ? '#fff' : '#888' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{sub}</div>
        </div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

export default function AppHeader({ rightSlot }: { rightSlot?: ReactNode }) {
  const {
    soundOn, setSoundOn,
    language, setLanguage,
    visualAlerts, setVisualAlerts,
    screenReader, setScreenReader,
    largeText, setLargeText,
  } = useAppContext();

  const [modal, setModal]                     = useState<Modal>(null);
  const [openFaq, setOpenFaq]                 = useState<number | null>(null);
  const [attendantCalled, setAttendantCalled] = useState(false);
  const [clock, setClock]                     = useState(new Date());
  const [flashActive, setFlashActive]         = useState(false);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Visual flash effect — triggered when visualAlerts is on (demo pulse every 5s)
  useEffect(() => {
    if (!visualAlerts) return;
    const id = setInterval(() => {
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 300);
    }, 5000);
    return () => clearInterval(id);
  }, [visualAlerts]);

  const closeModal = () => {
    setModal(null);
    setAttendantCalled(false);
    setOpenFaq(null);
  };

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  const iconBtn = (active = false): React.CSSProperties => ({
    background: active ? '#FF8200' : '#252525',
    border: `1px solid ${active ? '#FF8200' : '#333'}`,
    color: active ? '#fff' : '#888',
    borderRadius: '50%', width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
  });

  return (
    <>
      {/* Visual alert flash border */}
      {visualAlerts && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 500,
          border: `4px solid #FF8200`,
          borderRadius: 0,
          opacity: flashActive ? 1 : 0,
          transition: flashActive ? 'none' : 'opacity 0.25s',
        }} />
      )}

      {/* Screen reader announcement bar */}
      {screenReader && (
        <div style={{
          background: '#7c3aed', color: '#fff',
          fontSize: largeText ? 15 : 12, fontWeight: 600,
          padding: '6px 20px', textAlign: 'center', flexShrink: 0,
        }}>
          🔊 Screen Reader Active — All actions will be announced
        </div>
      )}

      <header style={{
        background: '#0f0f0f', borderBottom: '1px solid #242424',
        padding: '0 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
        height: largeText ? 60 : 52,
      }}>
        {/* Logo + store location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: largeText ? 34 : 28, height: largeText ? 34 : 28,
            borderRadius: '50%', background: '#FF8200',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: largeText ? 16 : 13, fontWeight: 900 }}>S</span>
          </div>
          <div>
            <div style={{
              color: '#FF8200', fontWeight: 800,
              fontSize: largeText ? 22 : 18, letterSpacing: '-0.3px', lineHeight: 1.1,
            }}>
              Sainsbury's
            </div>
            <div style={{ color: '#444', fontSize: largeText ? 11 : 9, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
              <MapPin size={largeText ? 10 : 8} color="#555" />
              <span>{STORE_LOCATION}</span>
            </div>
          </div>
        </div>

        {/* Icon trio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={iconBtn(!soundOn)} onClick={() => setModal('sound')}>
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button style={iconBtn()} onClick={() => setModal('help')}>
            <HelpCircle size={14} />
          </button>
          <button style={iconBtn()} onClick={() => setModal('language')}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>{currentLang.flag}</span>
          </button>
        </div>

        {/* Clock */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: largeText ? 15 : 13, fontWeight: 700, color: '#ccc', letterSpacing: 1 }}>
            {clock.toLocaleDateString('en-GB')}
          </div>
          <div style={{ fontSize: largeText ? 13 : 11, color: '#555', marginTop: 1 }}>
            {clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        {/* Right slot */}
        {rightSlot != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {rightSlot}
          </div>
        )}
      </header>

      {/* ── Modal overlay ── */}
      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, backdropFilter: 'blur(6px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 24,
              padding: '28px', width: 460, maxHeight: '84vh', overflowY: 'auto',
              boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
            }}
          >

            {/* ── Sound & Accessibility ── */}
            {modal === 'sound' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  Sound & Accessibility
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>
                  Customise audio and visual settings for your needs
                </div>

                {/* Sound on/off */}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#444',
                  marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.2,
                }}>
                  Audio
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#242424', border: `1px solid ${soundOn ? '#FF820044' : '#2e2e2e'}`,
                  borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: soundOn ? 'rgba(255,130,0,0.15)' : '#1e1e1e',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {soundOn ? <Volume2 size={18} color="#FF8200" /> : <VolumeX size={18} color="#555" />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: soundOn ? '#fff' : '#888' }}>
                        Sound {soundOn ? 'On' : 'Off'}
                      </div>
                      <div style={{ fontSize: 11, color: '#555' }}>
                        {soundOn ? 'Beeps and alerts enabled' : 'Silent mode — no audio cues'}
                      </div>
                    </div>
                  </div>
                  <Toggle on={soundOn} onToggle={() => setSoundOn(!soundOn)} />
                </div>

                {/* Accessibility section */}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#444',
                  marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.2,
                }}>
                  Accessibility
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <AccessRow
                    icon={<Zap size={18} color={visualAlerts ? '#FF8200' : '#555'} />}
                    label="Visual Alerts"
                    sub="Screen flashes orange on scan events — for hearing impaired users"
                    on={visualAlerts}
                    onToggle={() => setVisualAlerts(!visualAlerts)}
                  />
                  <AccessRow
                    icon={<Eye size={18} color={screenReader ? '#FF8200' : '#555'} />}
                    label="Screen Reader Mode"
                    sub="Announces actions via on-screen text — for visually impaired users"
                    on={screenReader}
                    onToggle={() => setScreenReader(!screenReader)}
                  />
                  <AccessRow
                    icon={<Type size={18} color={largeText ? '#FF8200' : '#555'} />}
                    label="Large Text"
                    sub="Increases text and header size across all screens"
                    on={largeText}
                    onToggle={() => setLargeText(!largeText)}
                  />
                </div>

                {/* Disability note */}
                <div style={{
                  background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 12, padding: '12px 14px', marginTop: 16,
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>♿</span>
                  <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                    Need additional assistance? Press <strong style={{ color: '#FF8200' }}>Help</strong> to call
                    a member of staff who can assist with accessibility requirements.
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    width: '100%', marginTop: 16, background: '#FF8200', border: 'none',
                    color: '#fff', borderRadius: 12, padding: '13px',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </>
            )}

            {/* ── Help ── */}
            {modal === 'help' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  Help Centre
                </div>
                <div style={{
                  fontSize: 12, color: '#555', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <MapPin size={11} color="#555" />
                  {STORE_LOCATION}
                </div>

                {/* Call attendant */}
                <button
                  onClick={() => setAttendantCalled(true)}
                  style={{
                    width: '100%', borderRadius: 14, padding: '16px 20px', marginBottom: 20,
                    background: attendantCalled ? 'rgba(62,213,152,0.10)' : 'rgba(255,130,0,0.10)',
                    border: `1px solid ${attendantCalled ? 'rgba(62,213,152,0.3)' : 'rgba(255,130,0,0.3)'}`,
                    display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  }}
                >
                  <div style={{
                    background: attendantCalled ? '#3ED598' : '#FF8200',
                    borderRadius: '50%', width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'background 0.3s',
                  }}>
                    <PhoneCall size={20} color="#fff" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: attendantCalled ? '#3ED598' : '#FF8200' }}>
                      {attendantCalled ? '✓ Attendant Called' : 'Call an Attendant'}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {attendantCalled
                        ? 'A staff member is on their way to assist you'
                        : 'A staff member will come to assist you'}
                    </div>
                  </div>
                </button>

                {/* FAQ accordion */}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#444',
                  marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.2,
                }}>
                  Common Questions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {FAQS.map((faq, i) => (
                    <div key={i} style={{
                      background: '#242424', border: '1px solid #2e2e2e',
                      borderRadius: 12, overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', padding: '12px 14px',
                          background: 'none', border: 'none', color: '#ccc',
                          cursor: 'pointer', fontSize: 13, fontWeight: 600, gap: 8,
                        }}
                      >
                        <span style={{ textAlign: 'left', flex: 1 }}>{faq.q}</span>
                        {openFaq === i
                          ? <ChevronUp size={15} color="#555" style={{ flexShrink: 0 }} />
                          : <ChevronDown size={15} color="#555" style={{ flexShrink: 0 }} />}
                      </button>
                      {openFaq === i && (
                        <div style={{ padding: '0 14px 12px', fontSize: 12, color: '#888', lineHeight: 1.65 }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    width: '100%', marginTop: 16,
                    background: '#1e1e1e', border: '1px solid #2e2e2e',
                    color: '#777', borderRadius: 12, padding: '12px',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </>
            )}

            {/* ── Language ── */}
            {modal === 'language' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  Select Language
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>
                  Choose your preferred language
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {LANGUAGES.map(lang => {
                    const selected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        style={{
                          background: selected ? '#FF8200' : '#242424',
                          border: `1px solid ${selected ? '#FF8200' : '#2e2e2e'}`,
                          borderRadius: 12, padding: '12px 14px', minHeight: 64,
                          display: 'flex', alignItems: 'center', gap: 10,
                          cursor: 'pointer', transition: 'all 0.15s',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 700,
                            color: selected ? '#fff' : '#ccc',
                            direction: lang.code === 'ar' ? 'ltr' : undefined,
                          }}>
                            {lang.native}
                          </div>
                          <div style={{ fontSize: 10, color: selected ? 'rgba(255,255,255,0.65)' : '#555', marginTop: 1 }}>
                            {lang.name}
                          </div>
                        </div>
                        {selected && (
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#fff', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8200' }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    width: '100%', marginTop: 16, background: '#FF8200', border: 'none',
                    color: '#fff', borderRadius: 12, padding: '13px',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Confirm
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
