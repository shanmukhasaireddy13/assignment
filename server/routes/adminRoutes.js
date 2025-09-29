import express from 'express';
import userAuth from '../middleware/userAuth.js';
import requireRole from '../middleware/requireRole.js';
import { listAudits, listUsers, getUserDetail, updateUserProfile, changeUserPassword, deleteUser, adminCreateTaskForUser, adminUpdateTaskForUser, adminDeleteTaskForUser, createAdmin } from '../controllers/adminController.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin-only management APIs
 */
router.use(userAuth, requireRole('admin'));
/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users with counts
 */
router.get('/users', listUsers);
/**
 * @openapi
 * /api/v1/admin/audits:
 *   get:
 *     tags: [Admin]
 *     summary: List recent audit logs
 */
router.get('/audits', listAudits);
/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user details
 *   put:
 *     tags: [Admin]
 *     summary: Update user profile
 */
const userIdParams = { params: z.object({ id: z.string().min(1) }) };
router.get('/users/:id', validate(userIdParams), getUserDetail);
const updateUserSchema = { ...userIdParams, body: z.object({ name: z.string().optional(), email: z.string().email().optional() }) };
router.put('/users/:id', validate(updateUserSchema), updateUserProfile);
/**
 * @openapi
 * /api/v1/admin/users/{id}/password:
 *   put:
 *     tags: [Admin]
 *     summary: Change user password
 */
const changePasswordSchema = { ...userIdParams, body: z.object({ newPassword: z.string().min(6) }) };
router.put('/users/:id/password', validate(changePasswordSchema), changeUserPassword);
/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
 */
router.delete('/users/:id', validate(userIdParams), deleteUser);
/**
 * @openapi
 * /api/v1/admin/users/{id}/tasks:
 *   post:
 *     tags: [Admin]
 *     summary: Create task for user
 */
const createUserTaskSchema = { ...userIdParams, body: z.object({ title: z.string().min(1), description: z.string().optional(), status: z.enum(['todo','in_progress','done']).optional() }) };
router.post('/users/:id/tasks', validate(createUserTaskSchema), adminCreateTaskForUser);
/**
 * @openapi
 * /api/v1/admin/tasks/{taskId}:
 *   put:
 *     tags: [Admin]
 *     summary: Update task (admin)
 *   delete:
 *     tags: [Admin]
 *     summary: Delete task (admin)
 */
const taskIdParams = { params: z.object({ taskId: z.string().min(1) }) };
const adminUpdateTaskSchema = { ...taskIdParams, body: z.object({ title: z.string().optional(), description: z.string().optional(), status: z.enum(['todo','in_progress','done']).optional() }) };
router.put('/tasks/:taskId', validate(adminUpdateTaskSchema), adminUpdateTaskForUser);
router.delete('/tasks/:taskId', validate(taskIdParams), adminDeleteTaskForUser);
/**
 * @openapi
 * /api/v1/admin/create-admin:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new admin
 */
const createAdminSchema = { body: z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) }) };
router.post('/create-admin', validate(createAdminSchema), createAdmin);

export default router;


