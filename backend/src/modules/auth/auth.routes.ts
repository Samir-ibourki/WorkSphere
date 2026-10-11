import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const authRouter = Router();

// publicc routes
authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

// protected route (requires valid JWT token)
authRouter.get("/me", authenticate, getMe);

export default authRouter;