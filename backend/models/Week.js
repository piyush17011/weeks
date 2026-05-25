import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayOfWeek: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  notes: { type: String, default: '' },
  mood: { type: Number, min: 1, max: 5, default: null },
  meaningfulActivity: { type: String, default: '' },
  wastedTime: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
}, { _id: false });

const weekSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  summary: { type: String, default: '' },
  meaningfulScore: { type: Number, min: 0, max: 10, default: null },
  wastedScore: { type: Number, min: 0, max: 10, default: null },
  // Weekly reflections
  matteredMost: { type: String, default: '' },
  drainedEnergy: { type: String, default: '' },
  intentional: { type: Boolean, default: null },
  changeNextWeek: { type: String, default: '' },
  days: [daySchema],
}, { timestamps: true });

weekSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });

weekSchema.methods.getStats = function() {
  const filledDays = this.days.filter(d => d.mood !== null);
  const avgMood = filledDays.length
    ? filledDays.reduce((s, d) => s + d.mood, 0) / filledDays.length
    : null;
  return { avgMood, daysLogged: filledDays.length };
};

export default mongoose.model('Week', weekSchema);
