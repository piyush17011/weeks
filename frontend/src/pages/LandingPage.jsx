import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TOTAL = 4680;
const LIVED = 1456;
const CURRENT = 1457;

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '56px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="serif" style={{ fontSize: '18px', color: 'var(--text)' }}>weeks</span>
        <Link to="/auth" style={{
          fontFamily: "'Geist Mono', monospace", fontSize: '11px',
          letterSpacing: '0.1em', color: 'var(--sub)', textDecoration: 'none',
          transition: 'color 0.15s',
        }}>
          enter →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '56px' }}
        >
          <h1 className="serif" style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: 'var(--text)', lineHeight: 1.15,
            marginBottom: '20px', fontWeight: 400,
          }}>
            your life<br /><em style={{ color: 'var(--accent)' }}>in weeks</em>
          </h1>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '12px', color: 'var(--sub)',
            lineHeight: 1.8, letterSpacing: '0.02em',
          }}>
            {TOTAL.toLocaleString()} squares.<br />
            each one, a week of your life.<br />
            finite. real. yours.
          </p>
        </motion.div>

        {/* Demo grid */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ marginBottom: '48px' }}
        >
          <DemoGrid />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <Link to="/auth">
            <button className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '12px', letterSpacing: '0.1em' }}>
              begin →
            </button>
          </Link>
        </motion.div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: 'var(--dim)', fontStyle: 'italic' }}>
          "the unexamined life is not worth living." — socrates
        </span>
      </div>
    </div>
  );
}

function DemoGrid() {
  const years = 90;
  const cols = 52;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {Array.from({ length: years }, (_, yr) => (
          <div key={yr} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {Array.from({ length: cols }, (_, wi) => {
              const wn = yr * cols + wi + 1;
              const isPast = wn < CURRENT;
              const isCurrent = wn === CURRENT;
              return (
                <div key={wi} style={{
                  width: 8, height: 8, flexShrink: 0,
                  background: isCurrent ? 'var(--accent2)' : isPast ? 'var(--accent)' : 'var(--future)',
                  border: `1px solid ${isCurrent ? 'var(--accent2)' : isPast ? 'var(--accent)' : 'var(--border)'}`,
                  opacity: isPast ? 0.7 : 1,
                  animation: isCurrent ? 'cellPulse 2.5s ease-in-out infinite' : 'none',
                }} />
              );
            })}
            {yr % 10 === 0 && (
              <span style={{
                fontFamily: "'Geist Mono', monospace", fontSize: '9px',
                color: 'var(--dim)', marginLeft: '8px', flexShrink: 0,
              }}>
                {yr + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '14px', alignItems: 'center' }}>
        <LegItem color="var(--accent)" label="lived" />
        <LegItem color="var(--future)" border="var(--border)" label="remaining" />
        <LegItem color="var(--accent2)" label="now" />
      </div>
    </div>
  );
}

function LegItem({ color, border, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: 8, height: 8, background: color, border: `1px solid ${border || color}`, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: 'var(--sub)', letterSpacing: '0.06em' }}>
        {label}
      </span>
    </div>
  );
}
