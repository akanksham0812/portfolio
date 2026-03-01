import { useNavigate } from 'react-router';
import { ShoppingBasket, ScanLine } from 'lucide-react';
import AppHeader from './AppHeader';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff', fontFamily: 'sans-serif' }}>
      <AppHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-16 py-10">
        <h1 style={{ fontSize: 44, fontWeight: 800, color: '#fff', marginBottom: 8, textAlign: 'center' }}>
          Welcome to Self Checkout
        </h1>
        <p style={{ fontSize: 18, color: '#888', marginBottom: 48, textAlign: 'center' }}>
          Choose how you'd like to scan your items
        </p>

        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Smart Basket */}
          <button
            onClick={() => navigate('/smart-basket-place')}
            style={{ background: '#242424', border: '1px solid #333', borderRadius: 20, padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8200')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
          >
            <div style={{ background: '#FF8200', borderRadius: '50%', padding: 28, marginBottom: 24 }}>
              <ShoppingBasket size={72} color="#fff" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Smart Basket</h2>
            <p style={{ fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 1.6 }}>
              Place your Smart Basket on the scanner — all items detected automatically
            </p>
            <div style={{ marginTop: 20, background: 'rgba(255,130,0,0.15)', color: '#FF8200', padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
              Fast &amp; Easy
            </div>
          </button>

          {/* Manual Scan */}
          <button
            onClick={() => navigate('/manual-scan')}
            style={{ background: '#242424', border: '1px solid #333', borderRadius: 20, padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#3ED598')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
          >
            <div style={{ background: '#2a2a2a', border: '2px solid #3a3a3a', borderRadius: '50%', padding: 28, marginBottom: 24 }}>
              <ScanLine size={72} color="#3ED598" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Manual Scan</h2>
            <p style={{ fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 1.6 }}>
              Scan each item individually using the barcode scanner
            </p>
            <div style={{ marginTop: 20, background: 'rgba(62,213,152,0.12)', color: '#3ED598', padding: '6px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
              Traditional Method
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111', borderTop: '1px solid #2e2e2e', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: 12 }}>
        <span>Till Number: 04</span>
        <span>Please scan your Nectar card at any time</span>
      </footer>
    </div>
  );
}
