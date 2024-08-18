import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputError } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account', 
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Passwords dont match')
        }
        return true
    }),
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputError,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputError,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').notEmpty().withMessage('Password is required'),
    handleInputError,
    AuthController.login
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputError,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputError,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Passwords dont match')
        }
        return true
    }),
    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profiles */

router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputError,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation').custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Passwords dont match')
        }
        return true
    }),
    handleInputError,
    AuthController.updateCurrentUserPassword
)
export default router
