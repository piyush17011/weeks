import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '', expectedLifespan: 90 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      mode === 'login' ? await login(form.email, form.password) : await register(form);
      navigate('/grid');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="serif" style={{
            fontSize: '2rem', color: 'var(--text)', textAlign: 'center',
            marginBottom: '48px', cursor: 'pointer',
          }}>weeks</div>
        </Link>

        {/* Mode tabs */}
        <div style={{
          display: 'flex', marginBottom: '32px',
          borderBottom: '1px solid var(--border)',
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, paddingBottom: '10px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Geist Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: mode === m ? 'var(--text)' : 'var(--sub)',
              borderBottom: `2px solid ${mode === m ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s', marginBottom: '-1px',
            }}>
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>

              {mode === 'register' && (
                <Field label="name">
                  <input value={form.name} onChange={set('name')} required
                    placeholder="your name" />
                </Field>
              )}

              <Field label="email">
                <input type="email" value={form.email} onChange={set('email')} required
                  placeholder="you@example.com" />
              </Field>

              <Field label="password">
                <input type="password" value={form.password} onChange={set('password')} required
                  placeholder="••••••••" />
              </Field>

              {mode === 'register' && (
                <>
                  <Field label="date of birth">
                    <input type="date" value={form.dob} onChange={set('dob')} required
                      style={{ colorScheme: 'dark', color: 'var(--text)', width: '100%', fontSize: '13px' }} />
                  </Field>
                  <Field label="expected lifespan (years)">
                    <input type="number" value={form.expectedLifespan} onChange={set('expectedLifespan')}
                      min="50" max="130" style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
                  </Field>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div style={{
              marginTop: '16px', padding: '10px 14px',
              background: 'rgba(201,169,110,0.06)',
              border: '1px solid rgba(201,169,110,0.2)',
              fontFamily: "'Geist Mono', monospace", fontSize: '11px',
              color: 'var(--accent)',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', padding: '10px', justifyContent: 'center', fontSize: '12px' }}>
            {loading
              ? <span style={{ opacity: 0.6 }}>...</span>
              : mode === 'login' ? 'enter →' : 'begin →'}
          </button>
        </form>

        <div style={{
          marginTop: '24px', textAlign: 'center',
          fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--sub)',
        }}>
          {mode === 'login' ? "no account? " : "have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontFamily: 'inherit', fontSize: 'inherit',
          }}>
            {mode === 'login' ? 'register' : 'login'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div className="field-label">{label}</div>
      <div className="field">{children}</div>
    </div>
  );
}
