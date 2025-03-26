import { Router } from "express";
import profileController from "../controllers/profileController";

const router = Router();
router.get("/:userid", profileController.getProfile);
router.post("/", profileController.createProfile);
router.put("/:userid", profileController.updateProfile);

export default router;