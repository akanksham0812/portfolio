import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

interface ScannedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  scanned: boolean;
}

const ITEMS_TO_SCAN: Omit<ScannedItem, 'scanned'>[] = [
  { id: '1', name: "Sainsbury's British Semi Skimmed Milk 2.27L", price: 1.65, quantity: 1 },
  { id: '2', name: "Sainsbury's White Bread Medium Sliced 800g", price: 1.10, quantity: 1 },
  { id: '3', name: 'British Strawberries 400g', price: 2.50, quantity: 1 },
  { id: '4', name: "Sainsbury's Free Range Medium Eggs x6", price: 1.85, quantity: 1 },
  { id: '5', name: 'Cheddar Cheese 350g', price: 2.75, quantity: 1 },
  { id: '6', name: "Sainsbury's Bananas Loose (per kg)", price: 0.95, quantity: 1 },
  { id: '7', name: 'Tomatoes Cherry Punnet 350g', price: 1.80, quantity: 1 },
  { id: '8', name: "Sainsbury's Orange Juice 1L", price: 2.20, quantity: 1 },
];

export default function SmartBasketScanning() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ScannedItem[]>(ITEMS_TO_SCAN.map(item => ({ ...item, scanned: false })));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < items.length) {
      const timer = setTimeout(() => {
        setItems(prev => prev.map((item, idx) => idx === currentIndex ? { ...item, scanned: true } : item));
        setCurrentIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else if (currentIndex === items.length && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        navigate('/review', { state: { items: items.map(({ scanned, ...rest }) => rest) } });
      }, 2000);
    }
  }, [currentIndex, items.length, isComplete, navigate]);

  const scannedCount = items.filter(item => item.scanned).length;
  const progress = (scannedCount / items.length) * 100;
  const R = 88;
  const circumference = 2 * Math.PI * R;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#1A1A1A', color: '#fff' }}>
      <AppHeader rightSlot={<span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>Smart Basket — Scanning</span>} />

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — progress */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 48px' }}>
          {!isComplete ? (
            <>
              <div style={{ position: 'relative', marginBottom: 32 }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="100" cy="100" r={R} stroke="#2e2e2e" strokeWidth="12" fill="none" />
                  <circle
                    cx="100" cy="100" r={R}
                    stroke="#FF8200"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 48, fontWeight: 800, color: '#FF8200' }}>{scannedCount}</span>
                  <span style={{ fontSize: 16, color: '#888' }}>of {items.length}</span>
                </div>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, textAlign: 'center' }}>Scanning Items...</h1>
              <p style={{ fontSize: 16, color: '#888', textAlign: 'center' }}>Please wait while we detect all items</p>
              {/* Animated scan bar */}
              <div style={{ marginTop: 28, width: 240, height: 4, background: '#2e2e2e', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: '#FF8200', borderRadius: 99, transition: 'width 0.4s ease' }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ background: '#3ED598', borderRadius: '50%', padding: 36, marginBottom: 24, boxShadow: '0 0 40px rgba(62,213,152,0.3)' }}>
                <Check size={96} color="#fff" strokeWidth={3} />
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: '#3ED598', marginBottom: 8, textAlign: 'center' }}>All Items Scanned!</h1>
              <p style={{ fontSize: 16, color: '#888', textAlign: 'center' }}>Redirecting to review...</p>
            </>
          )}
        </div>

        {/* Right — items list */}
        <div style={{ width: 420, background: '#141414', borderLeft: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2e2e2e' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#ccc' }}>Detected Items</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  background: item.scanned ? '#fff' : '#242424',
                  border: `1px solid ${item.scanned ? '#3ED598' : '#2e2e2e'}`,
                  borderRadius: 12,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: item.scanned ? 1 : 0.45,
                  transition: 'all 0.3s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: item.scanned ? '#111' : '#ccc', lineHeight: 1.3 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: item.scanned ? '#888' : '#555', marginTop: 3 }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: item.scanned ? '#111' : '#888' }}>£{item.price.toFixed(2)}</span>
                  {item.scanned && (
                    <div style={{ background: '#3ED598', borderRadius: '50%', padding: 3 }}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
