import React, { useState } from 'react';
import { api } from '../../utils/api.js';

const ICONS = ['◆', '○', '△', '★', '♦', '●', '◇', '❋', '✦', '⬡'];

export default function MilestonePanel({ weekNumber, milestones, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', icon: '◆' });
  const [saving, setSaving] = useState(false);

  const weekMilestones = milestones.filter(m => m.weekNumber === weekNumber);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await api.createMilestone({ weekNumber, ...form });
      await onUpdate();
      setForm({ title: '', description: '', icon: '◆' });
      setAdding(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const remove = async (id) => {
    try { await api.deleteMilestone(id); await onUpdate(); } catch {}
  };

  return (
    <div>
      <div className="label" style={{
        marginBottom: '14px', paddingBottom: '10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>milestones</span>
        <button
          onClick={() => setAdding(a => !a)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace",
            fontSize: '11px', color: adding ? 'var(--sub)' : 'var(--accent)',
            letterSpacing: '0.06em',
          }}
        >
          {adding ? 'cancel' : '+ pin'}
        </button>
      </div>

      {/* List */}
      {weekMilestones.length === 0 && !adding && (
        <div className="label" style={{ fontStyle: 'italic', color: 'var(--dim)', textTransform: 'none', letterSpacing: 0 }}>
          no milestones yet
        </div>
      )}

      {weekMilestones.map(m => (
        <div key={m._id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          marginBottom: '10px', padding: '8px 0',
          borderBottom: '1px solid var(--border)',
        }}
          className="group">
          <span style={{ color: 'var(--accent)', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{m.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginBottom: m.description ? '2px' : 0 }}>
              {m.title}
            </div>
            {m.description && (
              <div style={{ color: 'var(--sub)', fontSize: '11px' }}>{m.description}</div>
            )}
          </div>
          <button onClick={() => remove(m._id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--dim)', fontSize: '12px', flexShrink: 0,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--sub)'}
            onMouseLeave={e => e.target.style.color = 'var(--dim)'}
          >✕</button>
        </div>
      ))}

      {/* Add form */}
      {adding && (
        <div style={{ marginTop: '12px' }}>
          {/* Icon picker */}
          <div className="field-label" style={{ marginBottom: '8px' }}>icon</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                style={{
                  width: '28px', height: '28px', border: '1px solid',
                  borderColor: form.icon === ic ? 'var(--accent)' : 'var(--border2)',
                  background: form.icon === ic ? 'rgba(201,169,110,0.1)' : 'transparent',
                  color: form.icon === ic ? 'var(--accent)' : 'var(--sub)',
                  cursor: 'pointer', fontSize: '13px', transition: 'all 0.12s',
                }}>
                {ic}
              </button>
            ))}
          </div>

          <div className="field" style={{ marginBottom: '10px' }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="milestone title"
              style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
          </div>

          <div className="field" style={{ marginBottom: '14px' }}>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="description (optional)"
              style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
          </div>

          <button onClick={save} disabled={saving || !form.title.trim()} className="btn btn-primary" style={{ fontSize: '11px' }}>
            {saving ? 'saving...' : 'pin milestone'}
          </button>
        </div>
      )}
    </div>
  );
}
