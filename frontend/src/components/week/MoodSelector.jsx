import React from 'react';

const MOODS = [
  { value: 1, label: 'difficult' },
  { value: 2, label: 'low' },
  { value: 3, label: 'neutral' },
  { value: 4, label: 'good' },
  { value: 5, label: 'great' },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex gap-3 items-center">
      {MOODS.map(m => (
        <button key={m.value} onClick={() => onChange(value === m.value ? null : m.value)}
          className="flex flex-col items-center gap-1 group">
          <div className={`mood-dot ${value === m.value ? 'active' : ''} group-hover:opacity-60`}
            style={{ width: '10px', height: '10px' }} />
          <span className={`label-mono text-[9px] transition-opacity ${value === m.value ? 'text-bone' : 'text-mist/50 group-hover:text-mist'}`}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}
