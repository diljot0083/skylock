import { Router } from "express";
import { register, login, refreshAccessToken, logout } from "../controllers/auth.controller";
import { veriJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", veriJWT, logout);

export default router;