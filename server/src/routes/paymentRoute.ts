import { Router } from "express";
import paymentController from "../controllers/paymentController";

const router = Router();
router.post("/", paymentController.createPayments);
router.get("/verify-payment", paymentController.verifyPayment);

export default router;
