import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSelector from './MoodSelector.jsx';
import { formatDate } from '../../utils/dates.js';

export default function DayCard({ day, dayIndex, weekNumber, onChange }) {
  const [open, setOpen] = useState(false);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const update = (field) => (e) => onChange(dayIndex, { [field]: e.target.value });
  const updateMood = (mood) => onChange(dayIndex, { mood });
  const updateTags = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    onChange(dayIndex, { tags });
  };

  const hasContent = day.notes || day.mood || day.meaningfulActivity || day.wastedTime;

  return (
    <div className="border border-white/8 hover:border-white/15 transition-colors">
      {/* Day header */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-4">
          <span className="heading-serif text-bone text-lg">{dayNames[dayIndex]}</span>
          {day.date && <span className="label-mono text-mist text-xs">{formatDate(day.date)}</span>}
          {day.mood && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < day.mood ? 'bg-bone/80' : 'bg-white/10'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasContent && <div className="w-1.5 h-1.5 rounded-full bg-bone/40" />}
          <span className="label-mono text-mist text-xs">{open ? '↑' : '↓'}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-4 pb-5 space-y-5 border-t border-white/8 pt-4">
              {/* Mood */}
              <div>
                <div className="label-mono text-mist text-xs mb-2">mood</div>
                <MoodSelector value={day.mood} onChange={updateMood} />
              </div>

              {/* Notes */}
              <div>
                <div className="label-mono text-mist text-xs mb-1">notes</div>
                <textarea value={day.notes || ''} onChange={update('notes')}
                  placeholder="what happened today..."
                  className="w-full text-bone text-sm placeholder-mist/25 resize-none leading-relaxed min-h-[60px] bg-transparent"
                  style={{ outline: 'none', borderBottom: '1px solid rgba(240,237,232,0.08)' }}
                />
              </div>

              {/* Meaningful activity */}
              <div>
                <div className="label-mono text-mist text-xs mb-1">meaningful activity</div>
                <input value={day.meaningfulActivity || ''} onChange={update('meaningfulActivity')}
                  placeholder="what made today worthwhile..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>

              {/* Wasted time */}
              <div>
                <div className="label-mono text-mist text-xs mb-1">wasted time</div>
                <input value={day.wastedTime || ''} onChange={update('wastedTime')}
                  placeholder="where did time disappear..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>

              {/* Tags */}
              <div>
                <div className="label-mono text-mist text-xs mb-1">tags (comma separated)</div>
                <input value={(day.tags || []).join(', ')} onChange={updateTags}
                  placeholder="work, family, health..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
