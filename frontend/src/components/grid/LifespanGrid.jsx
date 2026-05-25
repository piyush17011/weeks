import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../store/settings.jsx';
import { getWeekDates, formatShortDate, getAgeAtWeek } from '../../utils/dates.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CELL = 11;
const GAP = 2;

function getBirthdayWeeks(dob, totalWeeks) {
  const set = new Set();
  const dobDate = new Date(dob);
  for (let yr = 1; yr <= Math.ceil(totalWeeks / 52); yr++) {
    const bday = new Date(dobDate);
    bday.setFullYear(dobDate.getFullYear() + yr);
    const msFromBirth = bday - dobDate;
    const weekNum = Math.floor(msFromBirth / (7 * 24 * 60 * 60 * 1000)) + 1;
    if (weekNum <= totalWeeks) set.add(weekNum);
  }
  return set;
}

function getMonthStartWeeks(dob, totalWeeks) {
  // returns map of weekNumber -> month label for weeks where a new month starts
  const result = {};
  const dobDate = new Date(dob);
  let prevMonth = -1;
  for (let w = 1; w <= Math.min(totalWeeks, 52 * 95); w++) {
    const d = new Date(dobDate.getTime() + (w - 1) * 7 * 24 * 60 * 60 * 1000);
    const m = d.getMonth();
    if (m !== prevMonth) {
      result[w] = MONTHS[m];
      prevMonth = m;
    }
  }
  return result;
}

export default function LifespanGrid({ user, weeksData, milestones }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);

  const totalWeeks = user.totalWeeks;
  const currentWeek = user.currentWeek;
  const years = Math.ceil(totalWeeks / 52);

  const weekDataMap = useMemo(() => {
    const m = {};
    (weeksData || []).forEach(w => { m[w.weekNumber] = w; });
    return m;
  }, [weeksData]);

  const milestoneSet = useMemo(() => {
    const s = new Set();
    (milestones || []).forEach(ms => s.add(ms.weekNumber));
    return s;
  }, [milestones]);

  const milestoneMap = useMemo(() => {
    const m = {};
    (milestones || []).forEach(ms => { m[ms.weekNumber] = ms; });
    return m;
  }, [milestones]);

  const birthdayWeeks = useMemo(() =>
    settings.showBirthday ? getBirthdayWeeks(user.dob, totalWeeks) : new Set(),
    [user.dob, totalWeeks, settings.showBirthday]
  );

  const monthStartMap = useMemo(() =>
    settings.showMonthMarkers ? getMonthStartWeeks(user.dob, totalWeeks) : {},
    [user.dob, totalWeeks, settings.showMonthMarkers]
  );

  const handleMouseEnter = useCallback((e, weekNumber) => {
    clearTimeout(tooltipTimer.current);
    const { startDate, endDate } = getWeekDates(user.dob, weekNumber);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      weekNumber,
      startDate,
      endDate,
      age: getAgeAtWeek(user.dob, weekNumber),
      year: Math.ceil(weekNumber / 52),
      weekData: weekDataMap[weekNumber],
      milestone: milestoneMap[weekNumber],
      x: rect.left,
      y: rect.top,
    });
  }, [user.dob, weekDataMap, milestoneMap]);

  const handleMouseLeave = useCallback(() => {
    tooltipTimer.current = setTimeout(() => setTooltip(null), 80);
  }, []);

  const handleClick = useCallback((weekNumber) => {
    navigate(`/week/${weekNumber}`);
  }, [navigate]);

  // Right-side year/month sidebar data per row
  const getSideLabel = (yearIdx) => {
    const calYear = new Date(user.dob).getFullYear() + yearIdx;
    return calYear;
  };

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      {/* Grid */}
      <div style={{ position: 'relative' }}>
        {/* Month header row (week columns 1-52) */}
        {settings.showMonthMarkers && (
          <div style={{ display: 'flex', marginBottom: '4px', marginLeft: settings.showYearLabels ? '36px' : '0' }}>
            {Array.from({ length: 52 }, (_, i) => {
              const wn = i + 1;
              const label = monthStartMap[wn];
              return (
                <div key={i} style={{
                  width: CELL, height: 10, flexShrink: 0,
                  marginRight: i < 51 ? GAP : 0,
                  display: 'flex', alignItems: 'center',
                }}>
                  {label && (
                    <span className="month-label" style={{ fontSize: '7px', color: 'var(--dim)', position: 'absolute' }}>
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {Array.from({ length: years }, (_, yearIdx) => {
          const yearStart = yearIdx * 52 + 1;
          return (
            <div key={yearIdx} style={{ display: 'flex', alignItems: 'center', gap: GAP, marginBottom: GAP }}>
              {/* Left year label */}
              {settings.showYearLabels && (
                <div className="year-label" style={{
                  color: yearIdx % 10 === 0 ? 'var(--sub)' : yearIdx % 5 === 0 ? 'var(--dim)' : 'transparent',
                  fontSize: yearIdx % 10 === 0 ? '10px' : '9px',
                }}>
                  {yearIdx + 1}
                </div>
              )}

              {/* 52 cells */}
              {Array.from({ length: 52 }, (_, wi) => {
                const wn = yearStart + wi;
                if (wn > totalWeeks) {
                  return <div key={wi} style={{ width: CELL, height: CELL, flexShrink: 0 }} />;
                }
                const isPast    = wn < currentWeek;
                const isCurrent = wn === currentWeek;
                const hasEntry  = settings.highlightLogged && !!weekDataMap[wn]?.summary;
                const isBday    = birthdayWeeks.has(wn);
                const hasMile   = settings.showMilestones && milestoneSet.has(wn);

                let cls = 'cell';
                if (isBday)    cls += ' birthday';
                else if (isCurrent) cls += ' current';
                else if (isPast)    cls += ' lived' + (hasEntry ? ' has-entry' : '');
                if (hasMile && !isBday) cls += ' milestone-mark';

                return (
                  <div
                    key={wi}
                    className={cls}
                    onMouseEnter={(e) => handleMouseEnter(e, wn)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(wn)}
                  />
                );
              })}

              {/* Right side: calendar year + month */}
              <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: yearIdx % 5 === 0 ? '11px' : '9px',
                  color: yearIdx % 5 === 0 ? 'var(--sub)' : 'var(--dim)',
                  fontWeight: yearIdx % 10 === 0 ? '500' : '300',
                }}>
                  {getSideLabel(yearIdx)}
                </span>
                {yearIdx % 5 === 0 && (
                  <span style={{ fontSize: '9px', color: 'var(--dim)', fontFamily: "'Geist Mono', monospace" }}>
                    age {yearIdx + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div className="tooltip" style={{
          left: Math.min(tooltip.x + 16, window.innerWidth - 220),
          top: tooltip.y - 8,
          transform: 'translateY(-100%)',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <div className="label" style={{ marginBottom: '3px' }}>week {tooltip.weekNumber}</div>
            <div className="serif" style={{ fontSize: '1.5rem', color: 'var(--text)', lineHeight: 1 }}>
              age {tooltip.age}
            </div>
          </div>
          <div style={{ color: 'var(--sub)', fontSize: '11px', marginBottom: '4px' }}>
            {formatShortDate(tooltip.startDate)} — {formatShortDate(tooltip.endDate)}
          </div>
          <div style={{ color: 'var(--dim)', fontSize: '10px', marginBottom: tooltip.weekData?.summary ? '8px' : 0 }}>
            year {tooltip.year}
          </div>
          {tooltip.milestone && (
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '6px',
              fontSize: '11px', color: 'var(--accent)',
            }}>
              {tooltip.milestone.icon} {tooltip.milestone.title}
            </div>
          )}
          {tooltip.weekData?.summary && (
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '6px',
              fontSize: '11px', color: 'var(--sub)',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {tooltip.weekData.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
