import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
import { api } from '../utils/api.js';
import { formatDate, getAgeAtWeek, getWeekDates } from '../utils/dates.js';
import MilestonePanel from '../components/week/MilestonePanel.jsx';
import WeeklyReflection from '../components/week/WeeklyReflection.jsx';
import DayLogPanel from '../components/week/DayLogPanel.jsx';

const DAY_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_FULL   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const MOOD_COLORS = { 1:'#7c3d3d', 2:'#7a6030', 3:'#3d5068', 4:'#2d5c42', 5:'#c9a96e' };

// Always returns an array of 7 day objects built from startDate
function buildDays(startDate, existing = []) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(new Date(startDate).getTime() + i * 86400000);
    const found = existing[i] || {};
    return {
      date,
      dayOfWeek: DAY_SHORT[i],
      notes: found.notes || '',
      mood: found.mood || null,
      meaningfulActivity: found.meaningfulActivity || '',
      wastedTime: found.wastedTime || '',
      tags: found.tags || [],
    };
  });
}

export default function WeekPage() {
  const { weekNumber: wn } = useParams();
  const weekNumber = parseInt(wn);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [week, setWeek]               = useState(null);
  const [days, setDays]               = useState([]);   // always 7
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [milestones, setMilestones]   = useState([]);
  const [openDayIdx, setOpenDayIdx]   = useState(null);
  const [showReflection, setShowReflection] = useState(false);

  const { startDate, endDate } = getWeekDates(user.dob, weekNumber);
  const age        = getAgeAtWeek(user.dob, weekNumber);
  const isCurrent  = weekNumber === user.currentWeek;
  const isFuture   = weekNumber > user.currentWeek;
  const calYear    = new Date(startDate).getFullYear();
  const todayIdx   = isCurrent ? (new Date().getDay() + 6) % 7 : null;

  useEffect(() => {
    setLoading(true);
    setOpenDayIdx(isCurrent ? (new Date().getDay() + 6) % 7 : null);
    setShowReflection(false);

    Promise.all([api.getWeek(weekNumber), api.getMilestones()])
      .then(([{ week: w }, { milestones: ms }]) => {
        setWeek(w);
        // Always build exactly 7 days from startDate, merging saved data
        setDays(buildDays(startDate, w?.days || []));
        setMilestones(ms || []);
      })
      .catch(err => {
        console.error(err);
        // Even on error, show empty days
        setDays(buildDays(startDate, []));
      })
      .finally(() => setLoading(false));
  }, [weekNumber]);

  const handleDayChange = useCallback(async (dayIndex, changes) => {
    // Update local days immediately
    setDays(prev => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], ...changes };
      return next;
    });
    // Persist
    try { await api.saveDay(weekNumber, dayIndex, changes); }
    catch (err) { console.error(err); }
  }, [weekNumber]);

  const handleReflectionChange = useCallback((key, value) => {
    setWeek(prev => ({ ...prev, [key]: value }));
  }, []);

  const saveWeek = async () => {
    setSaving(true);
    try {
      // Strip Mongoose internals before sending
      const payload = {
        summary:        week?.summary        || '',
        meaningfulScore:week?.meaningfulScore ?? null,
        wastedScore:    week?.wastedScore     ?? null,
        matteredMost:   week?.matteredMost    || '',
        drainedEnergy:  week?.drainedEnergy   || '',
        intentional:    week?.intentional     ?? null,
        changeNextWeek: week?.changeNextWeek  || '',
        days: days.map(d => ({
          date:               d.date,
          dayOfWeek:          d.dayOfWeek,
          notes:              d.notes              || '',
          mood:               d.mood               || null,
          meaningfulActivity: d.meaningfulActivity || '',
          wastedTime:         d.wastedTime         || '',
          tags:               d.tags               || [],
        })),
      };
      const { week: w } = await api.saveWeek(weekNumber, payload);
      setWeek(w);
      setDays(buildDays(startDate, w?.days || []));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('saveWeek error:', err);
    }
    setSaving(false);
  };

  const refreshMilestones = async () => {
    const { milestones } = await api.getMilestones();
    setMilestones(milestones);
  };

  if (loading) return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="label">loading...</span>
    </div>
  );

  const loggedDays  = days.filter(d => d.mood || d.notes || d.meaningfulActivity);
  const moodVals    = days.filter(d => d.mood).map(d => d.mood);
  const avgMood     = moodVals.length ? (moodVals.reduce((a,b) => a+b,0) / moodVals.length).toFixed(1) : null;

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 28px' }}>

        {/* ── top nav ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <Link to="/grid" style={{ fontFamily:"'Geist Mono',monospace", fontSize:'11px', color:'var(--sub)', textDecoration:'none', letterSpacing:'0.06em' }}>
            ← grid
          </Link>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={() => navigate(`/week/${weekNumber-1}`)} disabled={weekNumber<=1} className="btn" style={{ padding:'5px 12px' }}>←</button>
            <button onClick={() => navigate(`/week/${weekNumber+1}`)} disabled={weekNumber>=user.totalWeeks} className="btn" style={{ padding:'5px 12px' }}>→</button>
          </div>
        </div>

        {/* ── header ── */}
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'36px' }}>
          <div className="label" style={{ marginBottom:'6px', display:'flex', gap:'10px', alignItems:'center' }}>
            <span>week {weekNumber}</span>
            <span style={{ color:'var(--dim)' }}>·</span>
            <span>{calYear}</span>
            {isCurrent && <span style={{ color:'var(--accent)' }}>· now</span>}
            {isFuture  && <span style={{ color:'var(--dim)', fontStyle:'italic' }}>· upcoming</span>}
          </div>
          <div className="serif" style={{ fontSize:'2.8rem', color:'var(--text)', lineHeight:1, marginBottom:'6px' }}>
            age {age}
          </div>
          <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:'12px', color:'var(--sub)' }}>
            {formatDate(startDate)} — {formatDate(endDate)}
          </div>
        </motion.div>

        {/* ── 7 day tiles ── */}
        <div style={{ marginBottom:'0' }}>
          <div className="label" style={{ marginBottom:'14px' }}>days — click to log</div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px' }}>
            {days.map((day, i) => {
              const date     = new Date(day.date);
              const hasLog   = day.mood || day.notes || day.meaningfulActivity;
              const isToday  = i === todayIdx;
              const isOpen   = openDayIdx === i;

              return (
                <motion.button
                  key={i}
                  onClick={() => setOpenDayIdx(isOpen ? null : i)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: isOpen ? 'rgba(201,169,110,0.08)' : 'var(--surface)',
                    border: `1px solid ${isOpen ? 'var(--accent)' : isToday ? 'rgba(201,169,110,0.35)' : 'var(--border)'}`,
                    borderBottom: isOpen ? '1px solid var(--surface)' : `1px solid ${isToday ? 'rgba(201,169,110,0.35)' : 'var(--border)'}`,
                    padding: '14px 8px 12px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
                    transition: 'border-color 0.15s, background 0.15s',
                    position: 'relative',
                    zIndex: isOpen ? 2 : 1,
                  }}
                >
                  {/* today pulse dot */}
                  {isToday && !isOpen && (
                    <div style={{
                      position:'absolute', top:'5px', right:'5px',
                      width:'5px', height:'5px', borderRadius:'50%',
                      background:'var(--accent)',
                      animation:'cellPulse 2.5s ease-in-out infinite',
                    }} />
                  )}

                  {/* day label */}
                  <span style={{
                    fontFamily:"'Geist Mono',monospace", fontSize:'9px',
                    letterSpacing:'0.12em', textTransform:'uppercase',
                    color: isOpen ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--sub)',
                  }}>
                    {DAY_SHORT[i]}
                  </span>

                  {/* date number — big and readable */}
                  <span className="serif" style={{
                    fontSize: '1.8rem', lineHeight: 1,
                    color: isOpen ? 'var(--accent)' : hasLog ? 'var(--text)' : isToday ? 'var(--text)' : 'var(--sub)',
                    fontWeight: 400,
                  }}>
                    {date.getDate()}
                  </span>

                  {/* month */}
                  <span style={{
                    fontFamily:"'Geist Mono',monospace", fontSize:'9px',
                    color:'var(--dim)', letterSpacing:'0.06em',
                  }}>
                    {date.toLocaleDateString('en-US',{ month:'short' }).toUpperCase()}
                  </span>

                  {/* mood bar / empty dot */}
                  <div style={{ width:'100%', height:'3px', borderRadius:'2px', marginTop:'2px',
                    background: day.mood ? MOOD_COLORS[day.mood] : hasLog ? 'var(--dim)' : 'var(--border)',
                    opacity: day.mood || hasLog ? 1 : 0.4,
                  }} />
                </motion.button>
              );
            })}
          </div>

          {/* ── inline day log panel ── */}
          <AnimatePresence mode="wait">
            {openDayIdx !== null && (
              <motion.div
                key={openDayIdx}
                initial={{ opacity:0, y:-4 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-4 }}
                transition={{ duration:0.18 }}
              >
                <DayLogPanel
                  day={days[openDayIdx]}
                  dayIndex={openDayIdx}
                  dayName={DAY_FULL[openDayIdx]}
                  date={new Date(days[openDayIdx].date)}
                  onChange={handleDayChange}
                  onClose={() => setOpenDayIdx(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── week summary ── */}
        <div style={{ marginTop:'32px', marginBottom:'12px', padding:'20px 20px', background:'var(--surface)', border:'1px solid var(--border)' }}>
          <div className="field-label" style={{ marginBottom:'8px' }}>week summary</div>
          <textarea
            value={week?.summary || ''}
            onChange={e => setWeek(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="in a sentence, what defined this week..."
            style={{
              width:'100%', minHeight:'44px', resize:'none',
              fontSize:'13px', color:'var(--text)', lineHeight:'1.7',
              background:'transparent', border:'none', outline:'none',
              fontFamily:"'Geist Mono',monospace",
            }}
          />
        </div>

        {/* ── logged stats ── */}
        {loggedDays.length > 0 && (
          <div style={{ display:'flex', gap:'1px', background:'var(--border)', marginBottom:'12px' }}>
            {[
              { label:'days logged',  value:`${loggedDays.length}/7` },
              avgMood && { label:'avg mood', value:`${avgMood}/5`, accent:true },
              week?.meaningfulScore != null && { label:'meaningful', value:`${week.meaningfulScore}/10` },
              week?.wastedScore     != null && { label:'wasted',     value:`${week.wastedScore}/10` },
            ].filter(Boolean).map(s => (
              <div key={s.label} style={{ flex:1, background:'var(--surface)', padding:'12px 14px' }}>
                <div className="label" style={{ marginBottom:'4px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize:'1.3rem', color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── weekly reflection (collapsible) ── */}
        <button onClick={() => setShowReflection(r => !r)} className="btn"
          style={{ width:'100%', justifyContent:'space-between', padding:'12px 16px', marginBottom:'0' }}>
          <span>weekly reflection</span>
          <span style={{ color:'var(--dim)', fontSize:'11px' }}>{showReflection ? '↑' : '↓'}</span>
        </button>
        <AnimatePresence>
          {showReflection && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:'12px' }}>
              <div style={{ padding:'22px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderTop:'none' }}>
                <WeeklyReflection data={week || {}} onChange={handleReflectionChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── milestones ── */}
        <div style={{ marginTop:'12px', marginBottom:'28px' }}>
          <div style={{ padding:'18px 20px', background:'var(--surface)', border:'1px solid var(--border)' }}>
            <MilestonePanel weekNumber={weekNumber} milestones={milestones} onUpdate={refreshMilestones} />
          </div>
        </div>

        {/* ── save ── */}
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <button onClick={saveWeek} disabled={saving} className="btn btn-primary">
            {saving ? 'saving...' : saved ? '✓ saved' : 'save week'}
          </button>
          {saved && <span className="label" style={{ color:'var(--accent)' }}>saved</span>}
        </div>

      </div>
    </div>
  );
}