import express from "express"

import { newTask } from "../controllers/task.controller.js"
import { getTasks } from "node-cron"

const router = express.Router()

/**
 * @param {GET - tasks}
 */
router.get("/:id", getTasks)


/**
 * @param {POST - tasks}
 */

router.post('/:id/new', newTask)


export default router