import { Router } from "express";
import express from "express";
import { handleMockWebhook, generateMockSignedPayload } from "../controllers/mockPayment.controller.js";

const router = Router();
router.get("/mock/sign", generateMockSignedPayload);
router.post("/mock-webhook", express.raw({ type: "application/json" }), handleMockWebhook);
export default router;