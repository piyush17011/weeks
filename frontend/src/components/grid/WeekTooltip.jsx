import React from 'react';
import { formatShortDate, getAgeAtWeek } from '../../utils/dates.js';

export default function WeekTooltip({ week, weekData, milestone, position, user }) {
  if (!position) return null;
  const { startDate, endDate } = week;
  const age = getAgeAtWeek(user.dob, week.number);
  const year = Math.ceil(week.number / 52);

  const style = {
    left: Math.min(position.x + 12, window.innerWidth - 210),
    top: position.y - 10,
    transform: 'translateY(-100%)',
  };

  return (
    <div className="week-tooltip" style={style}>
      <div className="label-mono text-mist text-xs mb-2">week {week.number}</div>
      <div className="heading-serif text-bone text-lg mb-1">age {age}</div>
      <div className="label-mono text-mist text-xs mb-1">year {year} of life</div>
      <div className="label-mono text-mist text-xs">
        {formatShortDate(startDate)} — {formatShortDate(endDate)}
      </div>
      {milestone && (
        <div className="mt-2 pt-2 border-t border-white/10 label-mono text-bone text-xs">
          {milestone.icon} {milestone.title}
        </div>
      )}
      {weekData?.summary && (
        <div className="mt-2 pt-2 border-t border-white/10 text-bone/60 text-xs font-mono line-clamp-2">
          {weekData.summary}
        </div>
      )}
    </div>
  );
}
