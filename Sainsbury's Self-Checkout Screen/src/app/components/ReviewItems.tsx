import { useNavigate, useLocation } from 'react-router';
import { ShoppingCart, Trash2, Tag } from 'lucide-react';
import { useState } from 'react';
import AppHeader from './AppHeader';

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  color?: string;
}

export default function ReviewItems() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const initialItems = location.state?.items || [];
  const [items, setItems]               = useState<ScannedItem[]>(initialItems);
  const [hasNectarCard, setHasNectarCard] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<ScannedItem | null>(null);

  const requestRemove = (item: ScannedItem) => setPendingRemove(item);
  const confirmRemove = () => { if (pendingRemove) setItems(prev => prev.filter(i => i.id !== pendingRemove.id)); setPendingRemove(null); };
  const cancelRemove  = () => setPendingRemove(null);
  const removeItem    = (id: string) => { const item = items.find(i => i.id === id); if (item) requestRemove(item); };

  const subtotal      = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemDiscounts = items.reduce((s, i) => s + (i.discount || 0) * i.quantity, 0);
  const nectarSavings = hasNectarCard ? subtotal * 0.05 : 0;
  const total         = subtotal - itemDiscounts - nectarSavings;
  const totalQty      = items.reduce((s, i) => s + i.quantity, 0);

  const proceedToPayment = () => { if (items.length > 0) navigate('/payment-selection', { state: { items, total, nectarSavings } }); };

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
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — items list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid #222', flexShrink: 0 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Review Your Items</h1>
            <p style={{ fontSize: 12, color: '#555', margin: '3px 0 0' }}>Check your basket before payment</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {items.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <ShoppingCart size={48} color="#2a2a2a" strokeWidth={1.5} />
                <p style={{ color: '#3a3a3a', fontSize: 14, margin: 0 }}>Your basket is empty</p>
              </div>
            ) : (
              items.map((item, idx) => {
                const isActive = idx === items.length - 1;
                const disc     = (item.discount || 0) * item.quantity;
                const accent   = item.color || '#888';
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isActive ? '#fff' : '#1c1c1c',
                      border: `1px solid ${isActive ? '#e8e8e8' : '#252525'}`,
                      borderRadius: 14, padding: '12px 14px',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      {/* Color dot + text */}
                      <div style={{ display: 'flex', gap: 10, flex: 1 }}>
                        <div style={{ width: 4, borderRadius: 99, background: isActive ? accent : accent + '55', flexShrink: 0, alignSelf: 'stretch' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#111' : '#d0d0d0', lineHeight: 1.35, marginBottom: 3 }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: 11, color: isActive ? '#999' : '#555' }}>
                            Quantity {item.quantity}× — at £{item.price.toFixed(2)}/each
                          </div>
                          {disc > 0 && (
                            <div style={{ fontSize: 11, color: '#3ED598', marginTop: 2, fontWeight: 600 }}>
                              Discount: −£{disc.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: isActive ? '#111' : '#fff', letterSpacing: '-0.5px' }}>
                          £{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.4 }}>
                          <Trash2 size={13} color={isActive ? '#666' : '#aaa'} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Nectar card */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #222', flexShrink: 0 }}>
            <button
              onClick={() => setHasNectarCard(!hasNectarCard)}
              style={{
                width: '100%',
                background: hasNectarCard ? 'rgba(168,85,247,0.08)' : '#1a1a1a',
                border: `1px solid ${hasNectarCard ? 'rgba(168,85,247,0.4)' : '#252525'}`,
                borderRadius: 14, padding: '11px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: hasNectarCard ? 'rgba(168,85,247,0.15)' : '#242424', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Tag size={16} color={hasNectarCard ? '#a855f7' : '#555'} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: hasNectarCard ? '#c084fc' : '#bbb' }}>Nectar Card</div>
                  <div style={{ fontSize: 11, color: hasNectarCard ? '#a855f7' : '#444' }}>
                    {hasNectarCard ? 'Applied — earning points & 5% discount' : 'Tap to scan your Nectar card'}
                  </div>
                </div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${hasNectarCard ? '#a855f7' : '#3a3a3a'}`, background: hasNectarCard ? '#a855f7' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {hasNectarCard && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT — summary + CTA */}
        <div style={{ width: 340, background: '#0f0f0f', borderLeft: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #222' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#666', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Order Summary</h2>
          </div>

          <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Items', value: `${items.length}`, valueColor: '#ccc' },
                { label: 'Subtotal', value: `£${subtotal.toFixed(2)}`, valueColor: '#ccc' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#555' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: row.valueColor }}>{row.value}</span>
                </div>
              ))}
              {itemDiscounts > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#3ED598' }}>Item discounts</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#3ED598' }}>−£{itemDiscounts.toFixed(2)}</span>
                </div>
              )}
              {hasNectarCard && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#a855f7', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={12} /> Nectar (5%)
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#a855f7' }}>−£{nectarSavings.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Divider + total */}
            <div style={{ borderTop: '1px solid #222', paddingTop: 12, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: '#888' }}>Total:</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#FF8200', letterSpacing: '-1px' }}>£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Nectar points banner */}
            {hasNectarCard && (
              <div style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tag size={16} color="#a855f7" />
                <div>
                  <div style={{ fontSize: 11, color: '#c084fc', fontWeight: 700 }}>Nectar Points Earned</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#a855f7' }}>{Math.floor(total * 10)} pts</div>
                </div>
              </div>
            )}
          </div>

          {/* CTA area */}
          <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
            <button
              onClick={proceedToPayment}
              disabled={items.length === 0}
              style={{
                width: '100%',
                background: items.length === 0 ? '#1e1e1e' : '#3ED598',
                color: items.length === 0 ? '#3a3a3a' : '#0a2a1a',
                border: 'none', borderRadius: 16,
                padding: '0 22px', height: 70,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                marginBottom: 8,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 2 }}>PAY FOR</div>
                <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>£{total.toFixed(2)}</div>
              </div>
              <span style={{ fontSize: 24, fontWeight: 300 }}>→</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #252525', color: '#666', borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              ← Add More Items
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
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Remove from your basket?</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>This item will be removed before payment</div>
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
