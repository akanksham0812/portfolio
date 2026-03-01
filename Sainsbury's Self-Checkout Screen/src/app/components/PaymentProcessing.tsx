import { useNavigate, useLocation } from 'react-router';
import { CreditCard, Banknote, Smartphone, Wallet, Loader2, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, items, nectarSavings, paymentMethod } = location.state || {
    total: 0, items: [], nectarSavings: 0, paymentMethod: 'card'
  };

  const [status, setStatus] = useState<'processing' | 'approved' | 'complete'>('processing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(50), 1000);
    const t2 = setTimeout(() => { setProgress(100); setStatus('approved'); }, 2500);
    const t3 = setTimeout(() => setStatus('complete'), 3500);
    const t4 = setTimeout(() => navigate('/bagging-area', { state: { total, items, nectarSavings, paymentMethod } }), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [navigate, total, items, nectarSavings, paymentMethod]);

  const iconMap: Record<string, JSX.Element> = {
    card: <CreditCard size={72} color="#fff" strokeWidth={1.5} />,
    contactless: <Smartphone size={72} color="#fff" strokeWidth={1.5} />,
    cash: <Banknote size={72} color="#fff" strokeWidth={1.5} />,
    voucher: <Wallet size={72} color="#fff" strokeWidth={1.5} />,
  };

  const labelMap: Record<string, string> = {
    card: 'Card Payment', contactless: 'Mobile Payment', cash: 'Cash Payment', voucher: 'Voucher Payment'
  };

  const msgMap: Record<string, string> = {
    card: 'Please do not remove your card...',
    contactless: 'Hold your device steady...',
    cash: 'Counting your payment...',
    voucher: 'Validating voucher...',
  };

  const accentColor = status === 'processing' ? '#3b82f6' : '#3ED598';

  const statusLabel = status === 'processing' ? 'Processing Payment' : status === 'approved' ? 'Payment Approved' : 'Transaction Complete';

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff', fontFamily: 'sans-serif' }}>
      <AppHeader rightSlot={<span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>{statusLabel}</span>} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: 24 }}>
        {/* Icon */}
        <div style={{
          background: accentColor + '22', border: `2px solid ${accentColor}44`,
          borderRadius: '50%', padding: 36, transition: 'all 0.5s',
          boxShadow: `0 0 48px ${accentColor}33`
        }}>
          {status === 'processing' ? (
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              {iconMap[paymentMethod] || iconMap.card}
              <Loader2 size={72} color={accentColor} style={{ position: 'absolute', inset: 0, animation: 'spin 1s linear infinite', opacity: 0.4 }} />
            </div>
          ) : (
            <Check size={72} color="#3ED598" strokeWidth={2.5} />
          )}
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: accentColor, margin: 0, transition: 'color 0.5s' }}>
          {status === 'processing' ? 'Processing Payment...' : status === 'approved' ? 'Payment Approved!' : 'Complete!'}
        </h1>
        <p style={{ fontSize: 16, color: '#888', margin: 0 }}>
          {status === 'processing' ? msgMap[paymentMethod] || 'Processing...' : status === 'approved' ? 'Payment successful!' : 'Transaction complete'}
        </p>

        {/* Progress bar */}
        {status === 'processing' && (
          <div style={{ width: '100%', maxWidth: 480, height: 6, background: '#2e2e2e', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#3b82f6', borderRadius: 99, transition: 'width 1s ease-out' }} />
          </div>
        )}

        {/* Payment details card */}
        <div style={{ background: '#242424', border: '1px solid #333', borderRadius: 16, padding: '20px 32px', width: '100%', maxWidth: 480 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#888' }}>Payment Method:</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#ccc' }}>{labelMap[paymentMethod] || 'Payment'}</span>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Amount Paid:</span>
              <span style={{ fontSize: 30, fontWeight: 900, color: accentColor, transition: 'color 0.5s' }}>
                £{(total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {status === 'approved' && (
          <p style={{ color: '#555', fontSize: 14, animation: 'pulse 2s infinite' }}>Please wait...</p>
        )}
      </div>

      <footer style={{ background: '#111', borderTop: '1px solid #2e2e2e', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: 12 }}>
        <span>Till Number: 04</span>
        <span>{status === 'processing' ? 'Processing your payment securely...' : 'Payment successful'}</span>
      </footer>
    </div>
  );
}
