import { useNavigate, useLocation } from 'react-router';
import { ShoppingBag, AlertCircle, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

export default function BaggingArea() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, items, nectarSavings, paymentMethod } = location.state || {
    total: 0, items: [], nectarSavings: 0, paymentMethod: 'card'
  };

  const [itemsBagged, setItemsBagged] = useState(0);
  const [baggingProgress, setBaggingProgress] = useState(0);
  const totalItems = items.length;
  const done = itemsBagged >= totalItems && totalItems > 0;

  useEffect(() => {
    if (itemsBagged < totalItems) {
      const t = setTimeout(() => {
        setItemsBagged(prev => prev + 1);
        setBaggingProgress(((itemsBagged + 1) / totalItems) * 100);
      }, 1200);
      return () => clearTimeout(t);
    } else if (done) {
      const t = setTimeout(() => {
        navigate('/complete', { state: { total, items, nectarSavings, paymentMethod } });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [itemsBagged, totalItems, done, navigate, total, items, nectarSavings, paymentMethod]);

  const accentColor = done ? '#3ED598' : '#FF8200';

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff', fontFamily: 'sans-serif' }}>
      <AppHeader rightSlot={<span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Bagging Area</span>} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 48px' }}>
          <div style={{ transition: 'transform 0.4s', transform: done ? 'scale(1.05)' : 'scale(1)', marginBottom: 24 }}>
            <div style={{
              background: accentColor + '22', border: `2px solid ${accentColor}44`,
              borderRadius: '50%', padding: 40,
              boxShadow: `0 0 48px ${accentColor}33`,
              transition: 'all 0.5s'
            }}>
              {done
                ? <Check size={96} color="#3ED598" strokeWidth={2.5} />
                : <ShoppingBag size={96} color="#FF8200" strokeWidth={1.5} />
              }
            </div>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, color: done ? '#3ED598' : '#fff', marginBottom: 10, textAlign: 'center', transition: 'color 0.5s' }}>
            {done ? 'All Items Bagged!' : 'Place Items in Bagging Area'}
          </h1>
          <p style={{ fontSize: 16, color: '#888', marginBottom: 28, textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
            {done ? 'Please collect your receipt and items' : 'Place each item in the bagging area one at a time'}
          </p>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: 420, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888', marginBottom: 8 }}>
              <span>Items Bagged:</span>
              <span style={{ fontWeight: 700, color: accentColor }}>{itemsBagged} / {totalItems}</span>
            </div>
            <div style={{ height: 8, background: '#2e2e2e', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${baggingProgress}%`, background: accentColor, borderRadius: 99, transition: 'width 0.5s ease, background 0.5s' }} />
            </div>
          </div>

          {!done && (
            <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 12, maxWidth: 420 }}>
              <AlertCircle size={22} color="#eab308" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#eab308', marginBottom: 4 }}>Important</div>
                <p style={{ fontSize: 12, color: '#a38a0a', margin: 0, lineHeight: 1.5 }}>
                  Ensure all items are placed in the bagging area. Unexpected items will trigger an alert.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right — items list */}
        <div style={{ width: 380, background: '#141414', borderLeft: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #2e2e2e' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#ccc' }}>Your Items</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {items.map((item: any, index: number) => {
              const bagged = index < itemsBagged;
              return (
                <div key={item.id} style={{
                  background: bagged ? '#fff' : '#242424',
                  border: `1px solid ${bagged ? '#3ED598' : '#2e2e2e'}`,
                  borderRadius: 12, padding: '10px 14px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.3s',
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: bagged ? '#111' : '#aaa', lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: bagged ? '#888' : '#555', marginTop: 2 }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: bagged ? '#111' : '#888' }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                    {bagged && (
                      <div style={{ background: '#3ED598', borderRadius: '50%', padding: 3 }}>
                        <Check size={12} color="#fff" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: '#1e1e1e', borderTop: '1px solid #2e2e2e', padding: '14px 20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#ccc' }}>Total Paid:</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#3ED598' }}>£{(total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
