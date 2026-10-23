import { Router } from "express";
import { getDashboard } from "./dashboard.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/", getDashboard);

export default dashboardRouter;
