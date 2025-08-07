import express from "express"
import { createTenantSchema, forgotPassword, login, setPassword, signUp } from "../controllers/user.js"
import { authentication } from "../middlewares/auth.js"

const router = express.Router()

router.post("/sign-up", signUp)
router.post("/create-tenant", createTenantSchema)
router.patch("/set-password", authentication, setPassword)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)

export default router