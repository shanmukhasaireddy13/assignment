import userModel from '../models/usermodel.js';
import auditModel from '../models/auditModel.js';
import taskModel from '../models/taskModel.js';
import bcrypt from 'bcryptjs';

export const listUsers = async (req, res) => {
    try {
        const users = await userModel.aggregate([
            { $project: { name:1, email:1, role:1, createdAt:1 } },
            { $lookup: { from: 'tasks', localField: '_id', foreignField: 'owner', as: 'tasks' } },
            { $addFields: { taskCount: { $size: '$tasks' } } },
            { $project: { tasks:0 } },
            { $sort: { createdAt: -1 } }
        ]);
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const listAudits = async (req, res) => {
    try {
        const logs = await auditModel.find({}).sort({ createdAt: -1 }).limit(200);
        res.json({ success: true, data: logs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id, { name:1, email:1, role:1, createdAt:1 });
        if (!user) return res.status(404).json({ success:false, message:'Not found' });
        const tasks = await taskModel.find({ owner: id }).sort({ createdAt: -1 });
        res.json({ success:true, data: { user, tasks, taskCount: tasks.length } });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success:false, message:'Not found' });
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        await user.save();
        await auditModel.create({ actor: req.user.id, action: 'user.update_profile', targetUser: user._id, metadata: { name, email } });
        res.json({ success:true });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const changeUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).json({ success:false, message:'newPassword required' });
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success:false, message:'Not found' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await auditModel.create({ actor: req.user.id, action: 'user.password_change', targetUser: user._id });
        res.json({ success:true });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success:false, message:'Not found' });
        await taskModel.deleteMany({ owner: id });
        await user.deleteOne();
        await auditModel.create({ actor: req.user.id, action: 'user.delete', targetUser: id });
        res.json({ success:true });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const adminCreateTaskForUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        if (!title) return res.status(400).json({ success:false, message:'Title required' });
        const task = await taskModel.create({ title, description, status, owner: id });
        res.status(201).json({ success:true, data: task });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const adminUpdateTaskForUser = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;
        const task = await taskModel.findById(taskId);
        if (!task) return res.status(404).json({ success:false, message:'Not found' });
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        await task.save();
        res.json({ success:true, data: task });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const adminDeleteTaskForUser = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await taskModel.findById(taskId);
        if (!task) return res.status(404).json({ success:false, message:'Not found' });
        await task.deleteOne();
        await auditModel.create({ actor: req.user.id, action: 'task.delete_by_admin', targetTask: taskId });
        res.json({ success:true });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success:false, message:'Missing fields' });
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).json({ success:false, message:'Email already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashed, role: 'admin' });
        await auditModel.create({ actor: req.user.id, action: 'user.create_admin', targetUser: user._id });
        res.status(201).json({ success:true });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
}


