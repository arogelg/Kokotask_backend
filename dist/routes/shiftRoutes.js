"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ShiftController_1 = require("../controllers/ShiftController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/create-shift', (0, express_validator_1.body)("date")
    .notEmpty().withMessage("Date is required")
    .isDate().withMessage("Date must be a valid date"), (0, express_validator_1.body)("startTime")
    .notEmpty().withMessage("Start time is required")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Start time must be in HH:mm format"), (0, express_validator_1.body)("endTime")
    .notEmpty().withMessage("End time is required")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("End time must be in HH:mm format"), (0, express_validator_1.body)("user")
    .notEmpty().withMessage("User is required")
    .isMongoId().withMessage("User must be a valid ID"), validation_1.handleInputError, ShiftController_1.ShiftController.createShift);
exports.default = router;
//# sourceMappingURL=shiftRoutes.js.map