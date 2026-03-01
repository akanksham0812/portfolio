import { useNavigate, useLocation } from 'react-router';
import { Check, Printer, Mail, ShoppingBag, Tag, CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

export default function Complete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, items, nectarSavings, paymentMethod } = location.state || {
    total: 0, items: [], nectarSavings: 0, paymentMethod: 'card'
  };

  const [countdown, setCountdown] = useState(15);
  const transactionId = `TXN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
  const receiptNumber = `RCP-${Math.floor(Math.random() * 1000000)}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { navigate('/'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const iconMap: Record<string, JSX.Element> = {
    card: <CreditCard size={20} />,
    contactless: <Smartphone size={20} />,
    cash: <Banknote size={20} />,
    voucher: <Wallet size={20} />,
  };
  const labelMap: Record<string, string> = {
    card: 'Card Payment', contactless: 'Mobile Payment', cash: 'Cash Payment', voucher: 'Voucher Payment'
  };

  const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

  const countdownSlot = (
    <div style={{ background: '#242424', border: '1px solid #333', color: '#ccc', borderRadius: 10, padding: '7px 14px', fontSize: 13 }}>
      New transaction in: <strong style={{ color: '#FF8200' }}>{countdown}s</strong>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff', fontFamily: 'sans-serif' }}>
      <AppHeader rightSlot={countdownSlot} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 48px' }}>
          <div style={{ background: 'rgba(62,213,152,0.1)', border: '2px solid rgba(62,213,152,0.3)', borderRadius: '50%', padding: 36, marginBottom: 24, boxShadow: '0 0 48px rgba(62,213,152,0.2)' }}>
            <Check size={96} color="#3ED598" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#3ED598', marginBottom: 8, textAlign: 'center' }}>Thank You!</h1>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#ccc', marginBottom: 6, textAlign: 'center' }}>Your transaction is complete</p>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 32, textAlign: 'center' }}>Please take your receipt and items</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 440, marginBottom: 20 }}>
            <button style={{ background: '#242424', border: '1px solid #333', color: '#ccc', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#FF8200'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
            >
              <Printer size={20} /> Print Receipt
            </button>
            <button style={{ background: '#242424', border: '1px solid #333', color: '#ccc', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#FF8200'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
            >
              <Mail size={20} /> Email Receipt
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            style={{ background: '#FF8200', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,130,0,0.25)' }}
          >
            Start New Transaction
          </button>

          <p style={{ marginTop: 20, color: '#444', fontSize: 13 }}>
            Returning to start in <strong style={{ color: '#FF8200' }}>{countdown}</strong> seconds
          </p>
        </div>

        {/* Right — receipt */}
        <div style={{ width: 400, background: '#141414', borderLeft: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #2e2e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#ccc' }}>Receipt</span>
            <span style={{ fontSize: 11, color: '#555' }}>{receiptNumber}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <div style={{ background: '#1e1e1e', borderRadius: 14, padding: '18px', border: '1px solid #2e2e2e' }}>
              {/* Store */}
              <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #2e2e2e' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#FF8200', marginBottom: 6 }}>Sainsbury's</div>
                <div style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>
                  123 High Street, London, SW1A 1AA<br />
                  Tel: 0800 123 4567 · VAT: GB 123456789
                </div>
              </div>

              {/* Transaction details */}
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Date', `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`],
                  ['Till', '04'],
                  ['Transaction', transactionId],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#666' }}>{k}:</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#aaa' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#666' }}>Payment:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {iconMap[paymentMethod] || iconMap.card} {labelMap[paymentMethod] || 'Payment'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #2e2e2e' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShoppingBag size={14} /> Items ({items.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.map((item: any) => (
                    <div key={item.id}>
                      <div style={{ fontSize: 11, color: '#ccc' }}>{item.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#666', paddingLeft: 8 }}>
                        <span>{item.quantity} × £{item.price.toFixed(2)}</span>
                        <span style={{ fontWeight: 600, color: '#aaa' }}>£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#666' }}>Subtotal:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#aaa' }}>£{subtotal.toFixed(2)}</span>
                </div>
                {nectarSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#a855f7', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Tag size={12} /> Nectar:
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#a855f7' }}>-£{nectarSavings.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ borderTop: '2px solid #333', paddingTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Total Paid:</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#3ED598' }}>£{(total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {nectarSavings > 0 && (
                <div style={{ background: 'rgba(123,53,179,0.12)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag size={14} color="#a855f7" />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#c084fc' }}>Nectar Points Earned</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#a855f7' }}>{Math.floor((total || 0) * 10)} pts</div>
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', paddingTop: 12, borderTop: '1px dashed #2e2e2e' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4 }}>Thank you for shopping with us!</p>
                <p style={{ fontSize: 10, color: '#444' }}>Customer Services: 0800 636 262</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
