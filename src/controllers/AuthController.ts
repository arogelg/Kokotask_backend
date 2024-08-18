import { Request, Response } from 'express';

import User from '../models/user';
import { checkPassword, hashPassword } from '../utils/auth';
import Token from '../models/token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmails';
import { generateJWT } from '../utils/jwt';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const {password, email} = req.body

            // Prevent duplicate email
            const userExists = await User.findOne({email});
            if(userExists) {
                const error = new Error('Email already has an account');
                error.message = 'Email already has an account';
                return res.status(409).json({error: error.message});
            }

            //Create user
            const user = new User(req.body);

            //Hash password
            user.password = await hashPassword(password);

            //Generate email verification token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Send email verification
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('User created, check your email to verify your account');
        } catch (error) {
            res.status(500).json({error: 'There was an error creating your account'});
            
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Invalid token');
                return res.status(401).json({error: error.message});
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed correctly')

            //Find token
        }catch (error) {
            res.status(500).json({error: 'There was an error confirming your email'})

        }
    }

    static login = async (req: Request, res: Response) => {
        try { 
            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('User not found');
                return res.status(404).json({error: error.message});
            }

            if(!user.confirmed) {
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Account has not been confirmed, a new confirmation email has been sent');
                return res.status(401).json({error: error.message});
            } 

            //Check password

            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('Invalid password');
                return res.status(401).json({error: error.message});
            }

            const token = generateJWT({id: user.id})

            res.send(token)

        }catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const {email} = req.body

            // Existing User
            const user = await User.findOne({email});
            if(!user) {
                const error = new Error('User not found');
                return res.status(404).json({error: error.message});
            }

            if(user.confirmed) {
                const error = new Error('Account already confirmed');
                return res.status(403).json({error: error.message});
            }

            //Generate email verification token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Send email verification
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('New confirmation code sent to your email');
        } catch (error) {
            res.status(500).json({error: 'There was an error sending the confirmation code'});
            
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const {email} = req.body

            // Existing User
            const user = await User.findOne({email});
            if(!user) {
                const error = new Error('User not registered');
                return res.status(404).json({error: error.message});
            }

            //Generate email verification token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Send email verification
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Check your email to reset your password');
        } catch (error) {
            res.status(500).json({error: 'There was an error '});
            
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.body

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Invalid token');
                return res.status(401).json({error: error.message});
            }

            res.send('Token is valid. You can reset your password')

            //Find token
        }catch (error) {
            res.status(500).json({error: 'There was an error confirming your email'})

        }
    }


    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.params

            const tokenExists = await Token.findOne({token})

            if(!tokenExists) {
                const error = new Error('Invalid token');
                return res.status(401).json({error: error.message});
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])


            res.send('Password updated correctly')

            //Find token
        }catch (error) {
            res.status(500).json({error: 'There was an error updating your password'});

        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req: Request, res: Response) => {
        const {name, email} = req.body

        const userExists = await User.findOne({email})

        if(userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('Email already has an account');
            return res.status(409).json({error: error.message});
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Profile updated correctly')
        } catch (error) {
            res.status(500).json({error: 'There was an error updating your profile'});
            
        }
    }


    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const {current_password, password} = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)

        if(!isPasswordCorrect) {
            const error = new Error('Current password is incorrect');
            return res.status(401).json({error: error.message});
        }


        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Password updated correctly')
        } catch (error) {
            res.status(500).json({error: 'There was an error'});
        }

    }

}