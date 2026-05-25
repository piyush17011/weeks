import React from 'react';

const QUESTIONS = [
  { key: 'matteredMost',   label: 'what mattered most?',            placeholder: 'the moments that counted...' },
  { key: 'drainedEnergy',  label: 'what drained your energy?',      placeholder: 'what cost you this week...' },
  { key: 'changeNextWeek', label: 'what should change next week?',  placeholder: 'intentions going forward...' },
];

export default function WeeklyReflection({ data, onChange }) {
  return (
    <div>
      <div className="label" style={{
        marginBottom: '14px', paddingBottom: '10px',
        borderBottom: '1px solid var(--border)',
      }}>
        weekly reflection
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {QUESTIONS.map(q => (
          <div key={q.key}>
            <div className="field-label">{q.label}</div>
            <div className="field">
              <textarea
                value={data[q.key] || ''}
                onChange={e => onChange(q.key, e.target.value)}
                placeholder={q.placeholder}
                style={{
                  width: '100%', minHeight: '56px', resize: 'none',
                  fontSize: '13px', color: 'var(--text)', lineHeight: '1.6',
                  background: 'transparent', border: 'none', outline: 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Intentional binary */}
      <div style={{ marginBottom: '24px' }}>
        <div className="field-label" style={{ marginBottom: '10px' }}>
          did you spend your time intentionally?
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ val: true, label: 'yes' }, { val: false, label: 'no' }].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => onChange('intentional', data.intentional === opt.val ? null : opt.val)}
              className="btn"
              style={data.intentional === opt.val ? {
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                background: 'rgba(201,169,110,0.07)',
              } : {}}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <ScoreInput
          label="meaningful score"
          value={data.meaningfulScore}
          onChange={v => onChange('meaningfulScore', v)}
          accent
        />
        <ScoreInput
          label="wasted time score"
          value={data.wastedScore}
          onChange={v => onChange('wastedScore', v)}
        />
      </div>
    </div>
  );
}

function ScoreInput({ label, value, onChange, accent }) {
  return (
    <div>
      <div className="field-label" style={{ marginBottom: '8px' }}>{label} (0–10)</div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(value === i ? null : i)}
            style={{
              width: '22px', height: '22px',
              fontSize: '10px',
              fontFamily: "'Geist Mono', monospace",
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 0.12s',
              flexShrink: 0,
              borderColor: value === i ? (accent ? 'var(--accent)' : 'var(--sub)') : 'var(--border2)',
              background: value === i ? (accent ? 'var(--accent)' : 'var(--sub)') : 'transparent',
              color: value === i ? 'var(--bg)' : 'var(--sub)',
            }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
