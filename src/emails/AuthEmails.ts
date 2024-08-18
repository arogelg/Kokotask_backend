import { transporter } from "../config/nodemailer"

interface IEmail{
    email: string
    name: string
    token: string
}


export class AuthEmail {
    static sendConfirmationEmail = async ( user: IEmail ) => {
        await transporter.sendMail({
            from: 'KokoTask <admin@Kokotask.com>',
            to: user.email,
            subject: 'KokoTask - Email Verification',
            text: `KokoTask - Email Verification`,
            html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        Hello ${user.name},
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        You've successfully created an account in 
                        <strong style="color: #2B0047;">KokoTask</strong>.
                        Things are almost done; you just need to verify your account to get started!
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        Please click the link below to verify your account:
                    </p>
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="background-color: #FFC1E3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px;">
                            Verify Account
                        </a>
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        After clicking the link, please enter your verification code: <strong style="color: #2B0047;">${user.token}</strong>
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #666;">
                        <em>This token will expire in 10 minutes.</em>
                    </p>`})

    }

    static sendPasswordResetToken = async ( user: IEmail ) => {
        await transporter.sendMail({
            from: 'KokoTask <admin@Kokotask.com>',
            to: user.email,
            subject: 'KokoTask - Password Reset',
            text: `KokoTask - Password Reset`,
            html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        Hello ${user.name},
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        We received a request to reset your password for your 
                        <strong style="color: #2B0047;">KokoTask</strong> account.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        If you requested this password reset, please click the link below and enter the following code:
                        ${user.token} to reset your password. 
                    </p>
                    <p style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.FRONTEND_URL}/auth/new-password" style="background-color: #FFC1E3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px;">
                            Reset Password
                        </a>
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        If you did not request a password reset, please ignore this email. Your password will not be changed.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #666;">
                        <em>This token will expire in 10 minutes.</em>
                    </p>`})
    }
}