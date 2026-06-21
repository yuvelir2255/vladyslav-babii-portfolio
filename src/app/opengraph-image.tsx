import { ImageResponse } from 'next/og';

export const alt =
  'Case File VB-19 — Vladyslav Babii. Telegram Mini Apps, websites and AI products.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#100f0d',
        color: '#ece7da',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#ff5a1e',
            fontSize: 28,
            letterSpacing: 4,
          }}
        >
          CASE FILE · VB-19
        </div>
        <div
          style={{
            display: 'flex',
            border: '3px solid #ff5a1e',
            color: '#ff5a1e',
            padding: '8px 22px',
            fontSize: 26,
            letterSpacing: 2,
            borderRadius: 8,
          }}
        >
          AT LARGE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: -4,
          }}
        >
          VLADYSLAV
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: -4,
          }}
        >
          BABII
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 30,
            fontSize: 34,
            color: '#9c968a',
            letterSpacing: 1,
          }}
        >
          Telegram Mini Apps · Websites · AI Products
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            height: 3,
            width: 220,
            background: '#ff5a1e',
            marginBottom: 22,
          }}
        />
        <div style={{ display: 'flex', fontSize: 28, color: '#827c70' }}>
          I build products that ship — and take real orders.
        </div>
      </div>
    </div>,
    { ...size },
  );
}
