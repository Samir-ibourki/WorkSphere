import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "./task.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";

const taskRouter = Router();

taskRouter.use(authenticate);

taskRouter.get("/", getTasks);
taskRouter.post("/", validate(createTaskSchema), createTask);

taskRouter.get("/:id", getTaskById);
taskRouter.patch("/:id", validate(updateTaskSchema), updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
