import { Router } from "express";
import passport from "passport";
import {
    register,
    login,
    refreshAccessToken,
    logout,
    getCurrentUser,
    googleCallback
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallback
);

export default router;