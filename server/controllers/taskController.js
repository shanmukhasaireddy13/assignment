import taskModel from '../models/taskModel.js';
import auditModel from '../models/auditModel.js';

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ success: false, message: 'Title required' });
        const task = await taskModel.create({ title, description, owner: req.user.id });
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const listTasks = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { owner: req.user.id };
        const tasks = await taskModel.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getTask = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user.role !== 'admin' && task.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user.role !== 'admin' && task.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { title, description, status } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        await task.save();
        res.json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Not found' });
        if (req.user.role !== 'admin' && task.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        await task.deleteOne();
        try { await auditModel.create({ actor: req.user.id, action: 'task.delete', targetTask: task._id, metadata: { title: task.title } }); } catch {}
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


