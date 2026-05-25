import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import { useSettings } from '../store/settings.jsx';
import { api } from '../utils/api.js';
import LifespanGrid from '../components/grid/LifespanGrid.jsx';

export default function GridPage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [weeksData, setWeeksData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWeeks(), api.getMilestones()])
      .then(([wd, ms]) => {
        setWeeksData(wd.weeks || []);
        setMilestones(ms.milestones || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scrollToCurrent = () => {
    document.querySelector('.cell.current')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(1);

  return (
    <div style={{ padding: '36px 40px', minHeight: 'calc(100vh - 52px)' }}>

      {/* Header row */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div className="serif" style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '4px' }}>
            {user.name}
          </div>
          <div className="label">
            week {user.currentWeek} · {new Date().getFullYear()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={scrollToCurrent} className="btn" style={{ fontSize: '11px' }}>
            jump to now
          </button>
          <button onClick={() => navigate(`/week/${user.currentWeek}`)} className="btn btn-primary">
            this week →
          </button>
        </div>
      </motion.div>

      {/* Optional stats panel */}
      {settings.showStats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: 'flex', gap: '32px', marginBottom: '28px',
            padding: '18px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', flexWrap: 'wrap',
          }}>
          {[
            { label: 'weeks lived', value: user.weeksLived.toLocaleString() },
            { label: 'weeks remaining', value: user.remainingWeeks.toLocaleString() },
            { label: 'total weeks', value: user.totalWeeks.toLocaleString() },
            { label: 'elapsed', value: `${pct}%` },
          ].map(s => (
            <div key={s.label}>
              <div className="label" style={{ marginBottom: '4px' }}>{s.label}</div>
              <div className="value-big">{s.value}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Legend color="var(--lived)" label="lived" />
        <Legend color="transparent" border="var(--border)" label="future" />
        <Legend color="var(--accent2)" label="current week" pulse />
        {settings.showBirthday && <Legend color="#8b5cf6" label="birthday week" />}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="label" style={{ padding: '40px 0' }}>
          <span style={{ animation: 'pulse 1.5s infinite' }}>loading...</span>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <LifespanGrid user={user} weeksData={weeksData} milestones={milestones} />
        </motion.div>
      )}

      <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span className="label">hover any week to preview · click to reflect</span>
      </div>
    </div>
  );
}

function Legend({ color, border, label, pulse }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <div style={{
        width: 11, height: 11, flexShrink: 0,
        background: color,
        border: `1px solid ${border || color}`,
        animation: pulse ? 'cellPulse 2.5s ease-in-out infinite' : 'none',
      }} />
      <span className="label" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: '11px' }}>{label}</span>
    </div>
  );
}
