<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address - MSL</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0b0e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0b0b0e; padding: 40px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #141419; border: 1px solid #2a2a33; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 36px 30px 20px; background: linear-gradient(180deg, rgba(234, 179, 8, 0.1) 0%, rgba(20, 20, 25, 0) 100%);">
                            <div style="font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #facc15; text-transform: uppercase;">
                                MSL PHILIPPINES
                            </div>
                            <div style="font-size: 11px; font-weight: 600; letter-spacing: 4px; color: #a1a1aa; text-transform: uppercase; margin-top: 4px;">
                                MOONTON STUDENT LEADER
                            </div>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 20px 40px 30px;">
                            <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 12px; text-align: center;">
                                Account Verification Code
                            </h1>
                            <p style="font-size: 14px; line-height: 22px; color: #a1a1aa; margin: 0 0 28px; text-align: center;">
                                Thank you for creating an account on the MSL Philippines Portal. Use the 6-digit verification code below to confirm your email address.
                            </p>

                            <!-- Code Box -->
                            <div style="background-color: #0b0b0e; border: 2px dashed #facc15; border-radius: 12px; padding: 22px 15px; text-align: center; margin: 0 0 28px;">
                                <div style="font-size: 11px; font-weight: 600; color: #eab308; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                                    Your Verification Code
                                </div>
                                <div style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 15px rgba(250, 204, 21, 0.4); padding-left: 12px;">
                                    {{ $verificationCode }}
                                </div>
                                <div style="font-size: 12px; color: #71717a; margin-top: 8px;">
                                    Expires in <strong style="color: #facc15;">10 minutes</strong>
                                </div>
                            </div>

                            <p style="font-size: 13px; line-height: 20px; color: #71717a; margin: 0 0 8px; text-align: center;">
                                If you did not request this verification code, please ignore this email or contact support. Never share this code with anyone.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; background-color: #0e0e12; border-top: 1px solid #1f1f26; text-align: center;">
                            <div style="font-size: 12px; color: #71717a;">
                                &copy; {{ date('Y') }} Moonton Student Leader (MSL) Philippines. All rights reserved.
                            </div>
                            <div style="font-size: 11px; color: #52525b; margin-top: 6px;">
                                This is an automated message, please do not reply to this email.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

