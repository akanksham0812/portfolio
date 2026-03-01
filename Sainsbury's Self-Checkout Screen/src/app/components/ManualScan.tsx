import { useNavigate } from 'react-router';
import { ShoppingCart, Trash2, Plus, Minus, ScanLine } from 'lucide-react';
import { useState } from 'react';
import AppHeader from './AppHeader';

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  color: string;
}

const AVAILABLE_ITEMS = [
  { name: "Sainsbury's Semi Skimmed Milk 2.27L", price: 1.65, discount: 0.10, color: '#3b82f6' },
  { name: "Sainsbury's White Bread 800g",         price: 1.10, discount: 0.05, color: '#f59e0b' },
  { name: 'British Strawberries 400g',             price: 2.50, discount: 0.25, color: '#ef4444' },
  { name: "Sainsbury's Free Range Eggs x6",        price: 1.85, discount: 0.10, color: '#eab308' },
  { name: 'Cheddar Cheese 350g',                   price: 2.75, discount: 0.15, color: '#f97316' },
  { name: "Sainsbury's Bananas (per kg)",          price: 0.95, discount: 0,    color: '#facc15' },
  { name: 'Tomatoes Cherry Punnet 350g',           price: 1.80, discount: 0.10, color: '#dc2626' },
  { name: "Sainsbury's Orange Juice 1L",           price: 2.20, discount: 0.12, color: '#fb923c' },
  { name: 'Cucumber',                              price: 0.75, discount: 0,    color: '#22c55e' },
  { name: 'Bell Peppers 3-Pack',                   price: 1.45, discount: 0.08, color: '#a855f7' },
];

// SVG bag icon for bag selection cards
function BagIcon({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none">
      <path d="M13 14 C13 8 27 8 27 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="7" y="14" width="26" height="28" rx="4" fill={color} opacity="0.18"/>
      <rect x="7" y="14" width="26" height="28" rx="4" stroke={color} strokeWidth="1.5" fill="none"/>
      <line x1="14" y1="14" x2="14" y2="42" stroke={color} strokeWidth="1" opacity="0.4"/>
      <line x1="26" y1="14" x2="26" y2="42" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

// Colorful product image placeholder
function ProductOrb({ color, size = 96 }: { color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
      boxShadow: `0 8px 32px ${color}55, inset 0 -4px 12px rgba(0,0,0,0.2)`,
      flexShrink: 0,
      border: `1px solid ${color}33`,
    }} />
  );
}

const BAGS = [
  { label: 'Paper bag', sub: '5kg',  color: '#b07c4a' },
  { label: 'Green bag', sub: '10kg', color: '#3ED598' },
  { label: 'White bag', sub: '20kg', color: '#aaaaaa' },
];

export default function ManualScan() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedBag, setSelectedBag] = useState<number | null>(null);
  const [pendingRemove, setPendingRemove] = useState<ScannedItem | null>(null);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const src = AVAILABLE_ITEMS[Math.floor(Math.random() * AVAILABLE_ITEMS.length)];
      const existing = items.find(i => i.name === src.name);
      if (existing) {
        setItems(prev => prev.map(i => i.name === src.name ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        setItems(prev => [...prev, {
          id: Date.now().toString(),
          name: src.name, price: src.price, quantity: 1,
          discount: src.discount, color: src.color,
        }]);
      }
      setIsScanning(false);
    }, 700);
  };

  const requestRemove  = (item: ScannedItem) => setPendingRemove(item);
  const confirmRemove  = () => { if (pendingRemove) setItems(prev => prev.filter(i => i.id !== pendingRemove.id)); setPendingRemove(null); };
  const cancelRemove   = () => setPendingRemove(null);
  const removeItem     = (id: string) => { const item = items.find(i => i.id === id); if (item) requestRemove(item); };

  const adjustQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const q = i.quantity + delta;
      return q <= 0 ? i : { ...i, quantity: q };
    }));
  };

  const subtotal      = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalDiscount = items.reduce((s, i) => s + i.discount * i.quantity, 0);
  const total         = subtotal - totalDiscount;
  const lastItem      = items[items.length - 1];
  const totalQty      = items.reduce((s, i) => s + i.quantity, 0);

  const proceedToReview = () => { if (items.length > 0) navigate('/review', { state: { items } }); };

  const headerRight = (
    <>
      <div style={{ background: '#252525', border: '1px solid #333', borderRadius: 10, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#ddd' }}>
        <ShoppingCart size={15} />
        <span>Cart</span>
        {totalQty > 0 && (
          <span style={{ background: '#FF8200', color: '#fff', borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 800 }}>{totalQty}</span>
        )}
      </div>
      <button
        onClick={() => items.length > 0 && requestRemove(items[items.length - 1])}
        disabled={items.length === 0}
        style={{ background: '#252525', border: '1px solid #333', color: '#888', borderRadius: 10, padding: '7px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: items.length === 0 ? 'not-allowed' : 'pointer', opacity: items.length === 0 ? 0.35 : 1 }}
      >
        <Trash2 size={14} /> Remove item
      </button>
    </>
  );

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#161616', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <AppHeader rightSlot={headerRight} />

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', gap: 0 }}>

        {/* ─── LEFT PANEL ─── */}
        <div style={{ width: 460, display: 'flex', flexDirection: 'column', padding: '14px 14px 14px 14px', gap: 10, borderRight: '1px solid #242424', flexShrink: 0 }}>

          {/* Active item card */}
          <div style={{
            background: '#1e1e1e',
            borderRadius: 18,
            padding: '18px 20px 16px',
            border: '1px solid #2a2a2a',
            flex: lastItem ? 'none' : 1,
            minHeight: lastItem ? 'auto' : 140,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: lastItem ? 'flex-start' : 'center',
          }}>
            {lastItem ? (
              <>
                {/* Name + orb row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1, marginRight: 16 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 5 }}>
                      {lastItem.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      Quantity {lastItem.quantity}× — at £{lastItem.price.toFixed(2)} each
                    </div>
                  </div>
                  <ProductOrb color={lastItem.color} size={80} />
                </div>

                {/* Controls row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                  <button
                    onClick={() => adjustQty(lastItem.id, -1)}
                    style={{ background: '#2e2e2e', border: '1px solid #3a3a3a', borderRadius: 12, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Minus size={20} color="#fff" />
                  </button>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', minWidth: 36, textAlign: 'center' }}>{lastItem.quantity}</span>
                  <button
                    onClick={() => adjustQty(lastItem.id, 1)}
                    style={{ background: '#fff', border: 'none', borderRadius: 12, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Plus size={20} color="#111" />
                  </button>
                  <span style={{ marginLeft: 'auto', fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                    £{(lastItem.price * lastItem.quantity).toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <ScanLine size={44} color={isScanning ? '#FF8200' : '#333'} strokeWidth={1.5} style={{ transition: 'color 0.3s' }} />
                <p style={{ color: '#444', fontSize: 14, margin: 0 }}>
                  {isScanning ? 'Scanning...' : 'Scan an item to begin'}
                </p>
              </div>
            )}
          </div>

          {/* Mode buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {/* Quantity button */}
            <button
              style={{
                background: '#1e1e1e', border: '1px solid #2a2a2a',
                borderRadius: 14, padding: '13px 16px', color: '#bbb', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="1" width="7" height="7" rx="2" stroke="#888" strokeWidth="1.5"/>
                  <rect x="10" y="1" width="7" height="7" rx="2" stroke="#888" strokeWidth="1.5"/>
                  <rect x="1" y="10" width="7" height="7" rx="2" stroke="#888" strokeWidth="1.5"/>
                  <rect x="10" y="10" width="7" height="7" rx="2" stroke="#888" strokeWidth="1.5"/>
                </svg>
                <span>Quantity</span>
              </div>
              <span style={{ color: '#444', fontSize: 16 }}>→</span>
            </button>

            {/* Barcode / Scan button */}
            <button
              onClick={simulateScan}
              disabled={isScanning}
              style={{
                background: '#1e1e1e', border: '1px solid #2a2a2a',
                borderRadius: 14, padding: '13px 16px',
                color: isScanning ? '#555' : '#bbb', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: isScanning ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="2" width="2" height="14" rx="1" fill="#888"/>
                  <rect x="5" y="2" width="1" height="14" rx="0.5" fill="#888"/>
                  <rect x="8" y="2" width="2" height="14" rx="1" fill="#888"/>
                  <rect x="12" y="2" width="1" height="14" rx="0.5" fill="#888"/>
                  <rect x="15" y="2" width="2" height="14" rx="1" fill="#888"/>
                </svg>
                <span>{isScanning ? 'Scanning...' : 'Barcode'}</span>
              </div>
              <span style={{ color: '#444', fontSize: 16 }}>→</span>
            </button>
          </div>

          {/* Bags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {BAGS.map((bag, i) => {
              const active = selectedBag === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedBag(active ? null : i)}
                  style={{
                    background: active ? '#fff' : '#1e1e1e',
                    border: `1px solid ${active ? '#ddd' : '#2a2a2a'}`,
                    borderRadius: 16, padding: '12px 8px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#111' : '#bbb', letterSpacing: '-0.1px' }}>{bag.label}</div>
                  <div style={{ fontSize: 10, color: active ? '#999' : '#444', marginBottom: 4 }}>{bag.sub}</div>
                  <BagIcon color={active ? bag.color : (bag.color + '88')} size={36} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: active ? '#555' : '#3a3a3a', marginTop: 2 }}>+</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#161616' }}>

          {/* Items scroll */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {items.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <ShoppingCart size={48} color="#2a2a2a" strokeWidth={1.5} />
                <p style={{ color: '#3a3a3a', fontSize: 14, margin: 0 }}>No items scanned yet</p>
                <p style={{ color: '#2e2e2e', fontSize: 12, margin: 0 }}>Press Barcode to add products</p>
              </div>
            ) : (
              items.map((item, idx) => {
                const isActive = idx === items.length - 1;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isActive ? '#fff' : '#1c1c1c',
                      border: `1px solid ${isActive ? '#e8e8e8' : '#252525'}`,
                      borderRadius: 14,
                      padding: '12px 14px',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#111' : '#d0d0d0', lineHeight: 1.35, marginBottom: 3 }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: isActive ? '#999' : '#555' }}>
                          Quantity {item.quantity}× — at £{item.price.toFixed(2)}/each
                        </div>
                        {item.discount > 0 && (
                          <div style={{ fontSize: 11, color: '#3ED598', marginTop: 2, fontWeight: 600 }}>
                            Discount: −£{(item.discount * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: isActive ? '#111' : '#fff', letterSpacing: '-0.5px' }}>
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.45 }}>
                          <Trash2 size={13} color={isActive ? '#666' : '#aaa'} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary + CTA */}
          <div style={{ background: '#0f0f0f', borderTop: '1px solid #222', padding: '14px 16px 14px', flexShrink: 0 }}>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#555' }}>Discount:</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#3ED598' }}>−£{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#666' }}>Total:</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>£{total.toFixed(2)}</span>
            </div>

            <button
              onClick={proceedToReview}
              disabled={items.length === 0}
              style={{
                width: '100%',
                background: items.length === 0 ? '#1e1e1e' : '#3ED598',
                color: items.length === 0 ? '#3a3a3a' : '#0a2a1a',
                border: 'none', borderRadius: 16,
                padding: '0 22px',
                height: 70,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 2 }}>BUY FOR</div>
                <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>£{total.toFixed(2)}</div>
              </div>
              <span style={{ fontSize: 26, fontWeight: 300 }}>→</span>
            </button>

            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', background: 'none', border: 'none', color: '#3a3a3a', fontSize: 12, marginTop: 8, cursor: 'pointer', padding: '4px 0', letterSpacing: 0.3 }}
            >
              ← Cancel &amp; Start Over
            </button>
          </div>
        </div>
      </div>

      {/* ── Remove confirmation modal ── */}
      {pendingRemove && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 22, padding: '28px 26px', width: 400, boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Remove from scanning area?</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>This item will be removed from the current scan</div>
              </div>
            </div>

            <div style={{ background: '#232323', border: '1px solid #2e2e2e', borderRadius: 12, padding: '12px 14px', marginBottom: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ccc' }}>{pendingRemove.name}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                {pendingRemove.quantity}× · £{(pendingRemove.price * pendingRemove.quantity).toFixed(2)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={cancelRemove} style={{ background: '#252525', border: '1px solid #333', color: '#bbb', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Keep Item
              </button>
              <button onClick={confirmRemove} style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
