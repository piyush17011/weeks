import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
import { api } from '../utils/api.js';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOverview(), api.getMoodTrend()])
      .then(([ov, tr]) => { setOverview(ov); setTrend(tr.trend || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(2);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 36px', minHeight: 'calc(100vh - 52px)' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="label" style={{ marginBottom: '6px' }}>insights</div>
        <div className="serif" style={{ fontSize: '2.8rem', color: 'var(--text)', marginBottom: '40px' }}>
          your time
        </div>
      </motion.div>

      {/* Life bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label">life elapsed</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'var(--accent)' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '1px', background: 'var(--border)', position: 'relative', width: '100%' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--accent)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span className="label" style={{ fontSize: '9px' }}>birth</span>
          <span className="label" style={{ fontSize: '9px' }}>{user.expectedLifespan} years</span>
        </div>
      </motion.div>

      {loading ? (
        <div className="label" style={{ padding: '20px 0' }}>loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', background: 'var(--border)', marginBottom: '48px',
          }}>
            {[
              { label: 'weeks logged', value: overview?.totalLogged || 0 },
              { label: 'avg mood', value: overview?.avgMood ? `${overview.avgMood}/5` : '—' },
              { label: 'avg meaningful', value: overview?.avgMeaningful ? `${overview.avgMeaningful}/10` : '—' },
              { label: 'avg wasted', value: overview?.avgWasted ? `${overview.avgWasted}/10` : '—' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', padding: '20px 22px' }}>
                <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize: '2rem', color: 'var(--text)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Mood chart */}
          {trend.length > 1 && (
            <div style={{ marginBottom: '48px' }}>
              <div className="label" style={{ marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                mood over time
              </div>
              <MoodChart data={trend} />
            </div>
          )}

          {/* Awareness */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'weeks behind you', val: user.weeksLived, note: 'each a world of its own' },
              { label: 'weeks ahead', val: user.remainingWeeks, note: 'still unwritten' },
            ].map(s => (
              <div key={s.label}>
                <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize: '3rem', color: 'var(--accent)', lineHeight: 1, marginBottom: '6px' }}>
                  {s.val.toLocaleString()}
                </div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--dim)', fontStyle: 'italic' }}>
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MoodChart({ data }) {
  const W = 800, H = 140;
  const pad = { l: 24, r: 24, t: 12, b: 24 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const pts = data.map((d, i) => ({
    x: pad.l + (i / Math.max(data.length - 1, 1)) * cw,
    y: pad.t + ch - ((d.avgMood - 1) / 4) * ch,
    ...d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Area fill path
  const areaPath = [
    `M${pts[0].x},${pad.t + ch}`,
    linePath.replace('M', 'L'),
    `L${pts[pts.length - 1].x},${pad.t + ch}`,
    'Z',
  ].join(' ');

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '400px', display: 'block' }}>
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[1,2,3,4,5].map(v => {
          const y = pad.t + ch - ((v - 1) / 4) * ch;
          return (
            <g key={v}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y}
                stroke="var(--border)" strokeWidth="1" />
              <text x={pad.l - 4} y={y + 3} textAnchor="end"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fill: 'var(--dim)' }}>
                {v}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#moodGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Dots — only show every Nth */}
        {pts.filter((_, i) => i % Math.max(1, Math.floor(pts.length / 30)) === 0).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--accent)" />
        ))}

        {/* X labels */}
        {[0, Math.floor(data.length / 2), data.length - 1].map(idx => {
          const p = pts[idx];
          if (!p) return null;
          return (
            <text key={idx} x={p.x} y={H - 4} textAnchor="middle"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fill: 'var(--dim)' }}>
              wk {data[idx].weekNumber}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
