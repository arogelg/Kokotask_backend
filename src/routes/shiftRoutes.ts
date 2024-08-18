import { Router } from "express";
import { body, param } from "express-validator";
import { ShiftController } from "../controllers/ShiftController";
import { authenticate } from "../middleware/auth";
import { handleInputError } from "../middleware/validation";

const router = Router()

router.use(authenticate)

router.post('/create-shift',
    body("date")
        .notEmpty().withMessage("Date is required")
        .isDate().withMessage("Date must be a valid date"),
    body("startTime")
        .notEmpty().withMessage("Start time is required")
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Start time must be in HH:mm format"),
    body("endTime")
        .notEmpty().withMessage("End time is required")
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("End time must be in HH:mm format"),
    body("user")
        .notEmpty().withMessage("User is required")
        .isMongoId().withMessage("User must be a valid ID"),
    handleInputError,
    ShiftController.createShift
);

export default router;