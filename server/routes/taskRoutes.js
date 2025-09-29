import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/taskController.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Tasks
 *     description: Task CRUD APIs
 */
router.use(userAuth);
/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks
 *   post:
 *     tags: [Tasks]
 *     summary: Create task
 */
router.get('/', listTasks);
const createTaskSchema = { body: z.object({ title: z.string().min(1), description: z.string().optional(), status: z.enum(['todo','in_progress','done']).optional() }) };
router.post('/', validate(createTaskSchema), createTask);
/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get task
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 */
router.get('/:id', getTask);
const idParams = { params: z.object({ id: z.string().min(1) }) };
const updateTaskSchema = { ...idParams, body: z.object({ title: z.string().optional(), description: z.string().optional(), status: z.enum(['todo','in_progress','done']).optional() }) };
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;


