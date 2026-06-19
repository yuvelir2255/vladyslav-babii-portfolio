import { ImageResponse } from 'next/og';

export const alt = 'Vladyslav Babii — Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Branded social card — matches the site's cinematic dark aesthetic.
 * Latin/brand text (shared across locales); the localized title/description
 * live in the HTML OpenGraph meta tags.
 */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0b0d',
        color: '#f4f4f2',
        padding: '80px',
        position: 'relative',
      }}
    >
      {/* accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-160px',
          width: '720px',
          height: '720px',
          backgroundImage:
            'radial-gradient(circle, rgba(74,108,255,0.30) 0%, rgba(139,92,246,0.14) 40%, rgba(10,11,13,0) 70%)',
        }}
      />

      {/* eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '24px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          color: 'rgba(244,244,242,0.55)',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: '#10b981',
          }}
        />
        <div>Available for work</div>
      </div>

      {/* name + tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div
          style={{
            fontSize: '116px',
            fontWeight: 700,
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          Vladyslav Babii
        </div>
        <div style={{ fontSize: '36px', color: 'rgba(244,244,242,0.62)' }}>
          Developer · Telegram Mini Apps · Websites · AI Products
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '24px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'rgba(244,244,242,0.32)',
        }}
      >
        <div>Portfolio</div>
        <div
          style={{
            width: '120px',
            height: '2px',
            backgroundColor: 'rgba(244,244,242,0.3)',
          }}
        />
      </div>
    </div>,
    size,
  );
}
