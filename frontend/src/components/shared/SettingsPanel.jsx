import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../store/settings.jsx';
import { useAuth } from '../../store/auth.jsx';

const TOGGLES = [
  {
    section: 'grid display',
    items: [
      { key: 'showYearLabels', label: 'Year labels', desc: 'Show year numbers beside each row' },
      { key: 'showMonthMarkers', label: 'Month markers', desc: 'Show month lines across the grid' },
      { key: 'highlightLogged', label: 'Highlight logged weeks', desc: 'Brighter cells when you\'ve written a reflection' },
    ],
  },
  {
    section: 'special weeks',
    items: [
      { key: 'showBirthday', label: 'Birthday weeks', desc: 'Mark your birthday week in purple each year' },
      { key: 'showMilestones', label: 'Milestone borders', desc: 'Show border on weeks with pinned milestones' },
    ],
  },
  {
    section: 'insights',
    items: [
      { key: 'showStats', label: 'Life stats panel', desc: 'Show weeks elapsed, remaining etc. on grid page' },
    ],
  },
];

export default function SettingsPanel({ onClose }) {
  const { settings, toggle } = useSettings();
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      <motion.div className="settings-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div className="settings-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.22 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label mb-1">settings</div>
            <div className="serif text-text" style={{ fontSize: '1.3rem' }}>{user?.name}</div>
          </div>
          <button onClick={onClose} className="btn" style={{ padding: '6px 10px' }}>✕</button>
        </div>

        {/* Toggle groups */}
        {TOGGLES.map(group => (
          <div key={group.section} className="mb-8">
            <div className="label mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              {group.section}
            </div>
            <div className="space-y-5">
              {group.items.map(item => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <div style={{ color: 'var(--text)', fontSize: '12px', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ color: 'var(--sub)', fontSize: '11px', lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                  <button
                    className={`toggle ${settings[item.key] ? 'on' : ''}`}
                    onClick={() => toggle(item.key)}
                    style={{ marginTop: '2px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Profile info */}
        <div className="mb-8" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div className="label mb-4">account</div>
          <div style={{ color: 'var(--sub)', fontSize: '11px', lineHeight: 1.8 }}>
            <div>{user?.email}</div>
            <div>born {user?.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</div>
            <div>lifespan set to {user?.expectedLifespan} years</div>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={logout} className="btn w-full" style={{ justifyContent: 'center', color: 'var(--sub)' }}>
          sign out
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
