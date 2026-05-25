import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULTS = {
  showStats: false,
  showBirthday: true,
  showMilestones: true,
  showYearLabels: true,
  showMonthMarkers: false,
  highlightLogged: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('weeks_settings');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });

  useEffect(() => {
    localStorage.setItem('weeks_settings', JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  return (
    <SettingsContext.Provider value={{ settings, toggle, set }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
