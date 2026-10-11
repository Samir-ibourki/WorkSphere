import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "./project.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "./project.schema.js";

const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.get("/", getProjects);
projectRouter.post("/", validate(createProjectSchema), createProject);

projectRouter.get("/:id", getProjectById);
projectRouter.patch("/:id", validate(updateProjectSchema), updateProject);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
