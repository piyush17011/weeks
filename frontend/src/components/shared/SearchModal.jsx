import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api.js';

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try { const { results } = await api.searchWeeks(query); setResults(results); }
      catch {}
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);

  const go = (n) => { navigate(`/week/${n}`); onClose(); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '80px', padding: '80px 16px 16px',
      }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,15,0.8)', backdropFilter: 'blur(6px)' }} />
      <motion.div
        initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'relative', width: '100%', maxWidth: '520px',
          background: 'var(--surface)', border: '1px solid var(--border2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
        }}>
          <span className="label">search</span>
          <input
            ref={ref}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="weeks, reflections, memories..."
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{ flex: 1, fontSize: '13px', color: 'var(--text)' }}
          />
          {loading && <span className="label" style={{ opacity: 0.5 }}>...</span>}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {results.map(r => (
              <button key={r._id} onClick={() => go(r.weekNumber)} style={{
                width: '100%', textAlign: 'left',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="label" style={{ flexShrink: 0 }}>week {r.weekNumber}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'var(--sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.summary || '—'}
                </span>
              </button>
            ))}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div style={{ padding: '16px 18px' }}>
            <span className="label">no results</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
