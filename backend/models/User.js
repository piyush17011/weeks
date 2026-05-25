import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 6 },
  dob:              { type: Date, required: true },
  expectedLifespan: { type: Number, default: 90, min: 1, max: 150 },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.getLifespanStats = function() {
  const epoch      = getMondayOf(this.dob);
  const now        = new Date();
  now.setHours(0, 0, 0, 0);
  const totalWeeks     = this.expectedLifespan * 52;
  const weeksLived     = Math.floor((now - epoch) / MS_PER_WEEK);
  const currentWeek    = weeksLived + 1;
  const remainingWeeks = Math.max(0, totalWeeks - weeksLived);
  return { totalWeeks, weeksLived, currentWeek, remainingWeeks };
};

userSchema.methods.toPublic = function() {
  const obj = this.toObject();
  delete obj.password;
  return { ...obj, ...this.getLifespanStats() };
};

export default mongoose.model('User', userSchema);