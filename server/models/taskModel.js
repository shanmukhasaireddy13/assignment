import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo','in_progress','done'], default: 'todo' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
}, { timestamps: true });

const taskModel = mongoose.models.task || mongoose.model('task', taskSchema);
export default taskModel;


