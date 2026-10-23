import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), register);
authRouter.post("/login", authLimiter, validate(loginSchema), login);

authRouter.get("/me", authenticate, getMe);

export default authRouter;