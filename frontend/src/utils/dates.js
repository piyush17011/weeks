export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
export const MS_PER_DAY  = 24 * 60 * 60 * 1000;

// Return the Monday of the week containing a given date
function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // getDay(): 0=Sun,1=Mon,...,6=Sat  →  offset to Monday
  const day = d.getDay();
  const diff = (day === 0) ? -6 : 1 - day; // Sun wraps back 6, others shift to Mon
  d.setDate(d.getDate() + diff);
  return d;
}

// Week 1 always starts on the Monday of the birth week
function getEpoch(dob) {
  return getMondayOf(new Date(dob));
}

export function getWeekDates(dob, weekNumber) {
  const epoch = getEpoch(dob);
  const startDate = new Date(epoch.getTime() + (weekNumber - 1) * MS_PER_WEEK);
  const endDate   = new Date(startDate.getTime() + 6 * MS_PER_DAY);
  return { startDate, endDate };
}

export function getWeeksLived(dob) {
  const epoch = getEpoch(dob);
  const now   = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now - epoch) / MS_PER_WEEK);
}

export function getCurrentWeek(dob) {
  return getWeeksLived(dob) + 1;
}

export function getAgeAtWeek(dob, weekNumber) {
  const { startDate } = getWeekDates(dob, weekNumber);
  const dobDate = new Date(dob);
  const years = (startDate - dobDate) / (365.25 * MS_PER_DAY);
  return Math.floor(years);
}

export function getYearFromWeek(weekNumber) {
  return Math.ceil(weekNumber / 52);
}

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}