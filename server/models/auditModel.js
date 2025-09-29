import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    action: { type: String, required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    targetTask: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

const auditModel = mongoose.models.audit || mongoose.model('audit', auditSchema);
export default auditModel;


