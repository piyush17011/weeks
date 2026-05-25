import React, { useRef, useEffect } from 'react';

const MOODS = [
  { value: 1, label: 'rough',   color: '#6b4c4c' },
  { value: 2, label: 'low',     color: '#6b5c3e' },
  { value: 3, label: 'okay',    color: '#4a5568' },
  { value: 4, label: 'good',    color: '#3d5a4a' },
  { value: 5, label: 'great',   color: '#c9a96e' },
];

export default function DayLogPanel({ day, dayIndex, dayName, date, onChange, onClose }) {
  const notesRef = useRef(null);

  // Auto-focus notes on open
  useEffect(() => {
    const t = setTimeout(() => notesRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [dayIndex]);

  const upd = (field) => (e) => onChange(dayIndex, { [field]: e.target.value });
  const updMood = (val) => onChange(dayIndex, { mood: day.mood === val ? null : val });
  const updTags = (e) => onChange(dayIndex, {
    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
  });

  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--accent)',
      borderTop: 'none',
      padding: '28px 28px 24px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: '28px',
      }}>
        <div>
          <div className="serif" style={{ fontSize: '1.6rem', color: 'var(--text)', marginBottom: '3px' }}>
            {dayName}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--sub)' }}>
            {dateStr}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Geist Mono', monospace", fontSize: '11px',
          color: 'var(--dim)', letterSpacing: '0.06em',
          padding: '4px 8px',
        }}>close ✕</button>
      </div>

      {/* Mood */}
      <div style={{ marginBottom: '24px' }}>
        <div className="field-label" style={{ marginBottom: '10px' }}>how was today?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => updMood(m.value)}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: `1px solid ${day.mood === m.value ? m.color : 'var(--border2)'}`,
                background: day.mood === m.value ? `${m.color}22` : 'transparent',
                cursor: 'pointer',
                fontFamily: "'Geist Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: day.mood === m.value ? m.color : 'var(--sub)',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: day.mood === m.value ? m.color : 'var(--dim)',
                transition: 'background 0.15s',
              }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '20px' }}>
        <div className="field-label">notes</div>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
          <textarea
            ref={notesRef}
            value={day.notes || ''}
            onChange={upd('notes')}
            placeholder="what happened today..."
            style={{
              width: '100%', minHeight: '80px', resize: 'none',
              fontSize: '13px', color: 'var(--text)', lineHeight: '1.7',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: "'Geist Mono', monospace",
            }}
          />
        </div>
      </div>

      {/* Meaningful + Wasted side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <div className="field-label">meaningful activity</div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <input
              value={day.meaningfulActivity || ''}
              onChange={upd('meaningfulActivity')}
              placeholder="what made it worthwhile..."
              style={{
                width: '100%', color: 'var(--text)', fontSize: '13px',
                fontFamily: "'Geist Mono', monospace",
              }}
            />
          </div>
        </div>
        <div>
          <div className="field-label">wasted time</div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <input
              value={day.wastedTime || ''}
              onChange={upd('wastedTime')}
              placeholder="where did time go..."
              style={{
                width: '100%', color: 'var(--text)', fontSize: '13px',
                fontFamily: "'Geist Mono', monospace",
              }}
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="field-label">tags</div>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
          <input
            value={(day.tags || []).join(', ')}
            onChange={updTags}
            placeholder="work, family, health, creative..."
            style={{
              width: '100%', color: 'var(--text)', fontSize: '13px',
              fontFamily: "'Geist Mono', monospace",
            }}
          />
        </div>
        {(day.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {day.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'Geist Mono', monospace", fontSize: '10px',
                color: 'var(--accent)', border: '1px solid rgba(201,169,110,0.3)',
                padding: '2px 8px', letterSpacing: '0.06em',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Auto-save note */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <span className="label" style={{ color: 'var(--dim)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>
          changes save automatically as you type
        </span>
      </div>
    </div>
  );
}
