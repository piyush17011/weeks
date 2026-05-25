import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date: { type: Date },
  icon: { type: String, default: '◆' },
}, { timestamps: true });

milestoneSchema.index({ userId: 1, weekNumber: 1 });

export default mongoose.model('Milestone', milestoneSchema);
