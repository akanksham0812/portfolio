import { useNavigate } from 'react-router';
import { ShoppingBasket, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

export default function SmartBasketPlace() {
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff' }}>
      <AppHeader />

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-16">
        <div style={{ transition: 'transform 0.9s ease-in-out', transform: pulse ? 'scale(1.06)' : 'scale(1)', marginBottom: 16 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ background: '#FF8200', borderRadius: '50%', padding: 48, boxShadow: '0 0 60px rgba(255,130,0,0.25)' }}>
              <ShoppingBasket size={120} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)' }}>
              <ArrowDown size={36} color="#FF8200" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginTop: 52, marginBottom: 14, textAlign: 'center' }}>
          Place Your Smart Basket
        </h1>
        <p style={{ fontSize: 17, color: '#888', marginBottom: 10, textAlign: 'center', maxWidth: 520, lineHeight: 1.6 }}>
          Place your Smart Basket on the scanning platform below
        </p>
        <p style={{ fontSize: 15, color: '#FF8200', fontWeight: 600, marginBottom: 36 }}>
          Ensure the basket is centred on the platform
        </p>

        <div style={{ background: '#242424', border: '2px dashed #3a3a3a', borderRadius: 20, width: 300, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36 }}>
          <span style={{ color: '#555', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Scanning Platform</span>
        </div>

        <button
          onClick={() => navigate('/smart-basket-scanning')}
          style={{ background: '#FF8200', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 52px', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,130,0,0.25)' }}
        >
          Simulate Basket Placement
        </button>
      </div>

      {/* Bottom bar */}
      <div style={{ background: '#111', borderTop: '1px solid #2e2e2e', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: '#2a2a2a', border: '1px solid #3a3a3a', color: '#ccc', borderRadius: 10, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}
        >
          ← Back to Start
        </button>
        <span style={{ color: '#555', fontSize: 13 }}>Step 1 of 4: Place Smart Basket</span>
        <div style={{ width: 120 }} />
      </div>
    </div>
  );
}
