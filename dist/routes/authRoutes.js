"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords dont match');
    }
    return true;
}), (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'), validation_1.handleInputError, AuthController_1.AuthController.createAccount);
router.post('/confirm-account', (0, express_validator_1.body)('token').notEmpty().withMessage('Token is required'), validation_1.handleInputError, AuthController_1.AuthController.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'), (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'), validation_1.handleInputError, AuthController_1.AuthController.login);
router.post('/forgot-password', (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'), validation_1.handleInputError, AuthController_1.AuthController.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token').notEmpty().withMessage('Token is required'), validation_1.handleInputError, AuthController_1.AuthController.validateToken);
router.post('/update-password/:token', (0, express_validator_1.param)('token')
    .isNumeric().withMessage('Token is required'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords dont match');
    }
    return true;
}), validation_1.handleInputError, AuthController_1.AuthController.updatePasswordWithToken);
router.get('/user', auth_1.authenticate, AuthController_1.AuthController.user);
/** Profiles */
router.put('/profile', auth_1.authenticate, (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'), (0, express_validator_1.body)('email').isEmail().withMessage('Email is not valid'), validation_1.handleInputError, AuthController_1.AuthController.updateProfile);
router.post('/update-password', auth_1.authenticate, (0, express_validator_1.body)('current_password').notEmpty().withMessage('Current password is required'), (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'), (0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords dont match');
    }
    return true;
}), validation_1.handleInputError, AuthController_1.AuthController.updateCurrentUserPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map