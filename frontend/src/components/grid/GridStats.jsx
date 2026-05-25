import React from 'react';

export default function GridStats({ user }) {
  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(1);
  const yearsLeft = Math.floor(user.remainingWeeks / 52);

  const stats = [
    { label: 'weeks lived', value: user.weeksLived.toLocaleString() },
    { label: 'weeks remaining', value: user.remainingWeeks.toLocaleString() },
    { label: 'total weeks', value: user.totalWeeks.toLocaleString() },
    { label: 'elapsed', value: `${pct}%` },
    { label: 'years remaining', value: yearsLeft },
  ];

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-3">
      {stats.map(s => (
        <div key={s.label}>
          <div className="label-mono text-mist text-xs mb-0.5">{s.label}</div>
          <div className="heading-serif text-bone text-2xl">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
