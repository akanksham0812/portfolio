import { Outlet } from 'react-router';

function CardTerminal() {
  const buttonRows = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  return (
    <div style={{
      width: 148,
      flexShrink: 0,
      alignSelf: 'center',
      marginLeft: 20,
      background: 'linear-gradient(160deg, #3e3e3e 0%, #2c2c2c 60%, #242424 100%)',
      borderRadius: 22,
      padding: '16px 14px 20px',
      boxShadow: `
        8px 12px 32px rgba(0,0,0,0.7),
        2px 2px 0px rgba(255,255,255,0.04) inset,
        -2px -2px 0px rgba(0,0,0,0.3) inset
      `,
      border: '1px solid #4a4a4a',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Screen */}
      <div style={{
        background: '#0e0e0e',
        borderRadius: 10,
        height: 86,
        border: '2px solid #1a1a1a',
        boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Screen glare */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)',
          borderRadius: '10px 10px 0 0',
        }} />
        {/* Inner bezel */}
        <div style={{
          width: '75%', height: '65%',
          border: '1px solid #2a2a2a',
          borderRadius: 5,
          background: '#111',
        }} />
      </div>

      {/* Keypad grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {buttonRows.map((row, r) => (
          <div key={r} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
            {row.map((_, c) => (
              <div
                key={c}
                style={{
                  height: 30,
                  borderRadius: 7,
                  background: 'linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%)',
                  boxShadow: `
                    2px 3px 6px rgba(0,0,0,0.5),
                    0 1px 0 rgba(255,255,255,0.06) inset
                  `,
                  border: '1px solid #474747',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Base ridge */}
      <div style={{
        height: 4,
        borderRadius: 99,
        background: 'linear-gradient(to right, #222, #383838, #222)',
        marginTop: -4,
      }} />
    </div>
  );
}

export default function Root() {
  return (
    /* Full-viewport dark stage */
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0c0c0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Kiosk frame: screen + terminal side by side */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        background: '#181818',
        borderRadius: 28,
        border: '1px solid #2e2e2e',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset',
        padding: 16,
        gap: 0,
      }}>
        {/* Main touchscreen */}
        <div style={{
          width: 1024,
          height: 640,
          borderRadius: 16,
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 0 0 2px #222, 0 8px 32px rgba(0,0,0,0.6)',
          position: 'relative',
        }}>
          {/* Scale the 1366×768 content to fit 1024×640 */}
          <div style={{
            width: 1366,
            height: 768,
            transformOrigin: 'top left',
            transform: `scale(${1024 / 1366})`,
          }}>
            <Outlet />
          </div>
        </div>

        {/* Card terminal */}
        <CardTerminal />
      </div>
    </div>
  );
}
