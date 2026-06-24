import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt =
  'Case File VB-19 — Vladyslav Babii. Telegram Mini Apps, websites and AI integrations.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#100f0d';
const ORANGE = '#ff5a1e';
const BONE = '#ece7da';
const STEEL = '#9c968a';
const LINE = 'rgba(236,231,218,0.14)';

// угловая кроп-марка «улики» (L-образный уголок)
function Corner(pos: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  const v = pos.top !== undefined ? 'Top' : 'Bottom';
  const h = pos.left !== undefined ? 'Left' : 'Right';
  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        width: 22,
        height: 22,
        [`border${v}`]: `3px solid ${ORANGE}`,
        [`border${h}`]: `3px solid ${ORANGE}`,
      }}
    />
  );
}

export default async function OpengraphImage() {
  const dir = join(process.cwd(), 'src/app/og-assets');
  const [anton, mono, mug] = await Promise.all([
    readFile(join(dir, 'Anton-Regular.ttf')),
    readFile(join(dir, 'JetBrainsMono-Regular.ttf')),
    readFile(join(dir, 'mugshot.jpg')),
  ]);
  const mugSrc = `data:image/jpeg;base64,${mug.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        color: BONE,
        fontFamily: 'JBMono',
      }}
    >
      {/* шильд дела — минимум */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '52px 72px 0',
          color: ORANGE,
          fontSize: 24,
          letterSpacing: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 12,
            height: 12,
            borderRadius: 12,
            background: ORANGE,
            marginRight: 16,
          }}
        />
        CASE FILE · VB-19
      </div>

      {/* тело: фото-улика + типографика, много воздуха */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          gap: 72,
          padding: '0 72px',
        }}
      >
        {/* фото как улика */}
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: 360,
            height: 430,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <img
              src={mugSrc}
              width={360}
              height={430}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <Corner top={-2} left={-2} />
          <Corner top={-2} right={-2} />
          <Corner bottom={-2} left={-2} />
          <Corner bottom={-2} right={-2} />
          {/* тег EXHIBIT A — как на сайте (убирает дубль VB-19) */}
          <div
            style={{
              position: 'absolute',
              top: -18,
              left: -16,
              display: 'flex',
              background: ORANGE,
              color: '#160d06',
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 2,
              padding: '6px 13px',
              borderRadius: 4,
              transform: 'rotate(-3deg)',
            }}
          >
            EXHIBIT A
          </div>
          {/* штамп AT LARGE — сверху-справа, как на сайте (не на доске) */}
          <div
            style={{
              position: 'absolute',
              top: 22,
              right: -34,
              display: 'flex',
              border: `3px solid ${ORANGE}`,
              color: ORANGE,
              fontSize: 27,
              letterSpacing: 3,
              padding: '7px 17px',
              borderRadius: 7,
              transform: 'rotate(-9deg)',
              background: 'rgba(16,15,13,0.5)',
            }}
          >
            AT LARGE
          </div>
        </div>

        {/* типографика */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Anton',
              fontSize: 118,
              lineHeight: 1.04,
              letterSpacing: 1,
              color: BONE,
            }}
          >
            <div style={{ display: 'flex' }}>VLADYSLAV</div>
            <div style={{ display: 'flex' }}>BABII</div>
          </div>
          <div
            style={{
              display: 'flex',
              width: 190,
              height: 4,
              background: ORANGE,
              margin: '34px 0 28px',
            }}
          />
          <div
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              fontSize: 22,
              color: STEEL,
              letterSpacing: 1,
            }}
          >
            Telegram Mini Apps · Websites · AI Integrations
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Anton', data: anton, weight: 400, style: 'normal' },
        { name: 'JBMono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
