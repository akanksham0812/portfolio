import { useNavigate, useLocation } from 'react-router';
import { CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import AppHeader from './AppHeader';

const METHODS = [
  { id: 'card', icon: CreditCard, label: 'Card Payment', sub: 'Insert or tap your card', tags: ['Chip & PIN', 'Contactless'], color: '#3b82f6' },
  { id: 'contactless', icon: Smartphone, label: 'Mobile Payment', sub: 'Apple Pay, Google Pay', tags: ['Quick', 'Secure'], color: '#8b5cf6' },
  { id: 'cash', icon: Banknote, label: 'Cash Payment', sub: 'Insert notes or coins', tags: ['Notes', 'Coins'], color: '#3ED598' },
  { id: 'voucher', icon: Wallet, label: 'Voucher / Gift Card', sub: 'Scan your voucher', tags: ['Gift Cards', 'Vouchers'], color: '#FF8200' },
];

export default function PaymentSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, items, nectarSavings } = location.state || { total: 0, items: [], nectarSavings: 0 };

  const selectPaymentMethod = (method: string) => {
    navigate('/payment-processing', { state: { total, items, nectarSavings, paymentMethod: method } });
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff', fontFamily: 'sans-serif' }}>
      <AppHeader rightSlot={<span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Select Payment Method</span>} />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 48px' }}>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>Choose how you'd like to pay</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%', maxWidth: 740, marginBottom: 28 }}>
          {METHODS.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => selectPaymentMethod(m.id)}
                style={{
                  background: '#242424', border: '1px solid #333', borderRadius: 18,
                  padding: '30px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', gap: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = '#2a2a2a'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = '#242424'; }}
              >
                <div style={{ background: m.color + '22', borderRadius: '50%', padding: 18, marginBottom: 4 }}>
                  <Icon size={42} color={m.color} strokeWidth={1.5} />
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>{m.label}</h2>
                <p style={{ fontSize: 12, color: '#888', margin: 0, textAlign: 'center' }}>{m.sub}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                  {m.tags.map(t => (
                    <span key={t} style={{ background: '#2e2e2e', color: '#777', padding: '3px 10px', borderRadius: 999, fontSize: 11 }}>{t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ background: '#242424', border: '1px solid #333', borderRadius: 16, padding: '20px 32px', width: '100%', maxWidth: 540, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#ccc' }}>Amount to Pay:</span>
          <span style={{ fontSize: 34, fontWeight: 900, color: '#FF8200' }}>£{(total || 0).toFixed(2)}</span>
        </div>
        {nectarSavings > 0 && (
          <div style={{ marginTop: 8, color: '#a855f7', fontSize: 13 }}>
            You saved £{nectarSavings.toFixed(2)} with Nectar
          </div>
        )}
      </div>

      <div style={{ background: '#111', borderTop: '1px solid #2e2e2e', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: '#2a2a2a', border: '1px solid #333', color: '#ccc', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}
        >
          ← Back to Review
        </button>
        <span style={{ color: '#555', fontSize: 13 }}>Step 4 of 4: Payment</span>
        <div style={{ width: 130 }} />
      </div>
    </div>
  );
}
