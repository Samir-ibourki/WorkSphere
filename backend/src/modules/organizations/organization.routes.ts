import { Router } from "express";
import { getOrganization, getOrganizationUsers, updateOrganization } from "./organization.controller.js";
import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import { updateOrganizationSchema } from "./organization.schema.js";

const organizationRouter = Router()

organizationRouter.use(authenticate)

organizationRouter.get("/me", getOrganization)
organizationRouter.patch("/me",validate(updateOrganizationSchema) ,updateOrganization)
organizationRouter.get("/me/users", getOrganizationUsers)

export default organizationRouter