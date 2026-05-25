import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/auth.jsx';
import SearchModal from './SearchModal.jsx';
import SettingsPanel from './SettingsPanel.jsx';

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { path: '/grid', label: 'grid' },
    { path: '/analytics', label: 'insights' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '52px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/grid" style={{ fontFamily: "'Libre Baskerville', serif", color: 'var(--text)', fontSize: '17px', textDecoration: 'none' }}>
          weeks
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: location.pathname === item.path ? 'var(--text)' : 'var(--sub)',
              transition: 'color 0.15s',
            }}>
              {item.label}
            </Link>
          ))}
          <button onClick={() => setSearchOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace", fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sub)',
          }}>search</button>
          <button onClick={() => setSettingsOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace", fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sub)',
          }}>settings</button>
        </div>
      </nav>

      {/* Main */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ paddingTop: '52px' }}
      >
        {children}
      </motion.main>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
