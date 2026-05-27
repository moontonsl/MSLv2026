<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .verification-code {
            background-color: #f8f9fa;
            border: 2px solid #FFD700;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #333;
            font-family: 'Courier New', monospace;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .instructions {
            background-color: #e7f3ff;
            border: 1px solid #b3d9ff;
            color: #0066cc;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MSL</div>
            <h2>Verify Your Email Address</h2>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            
            <p>Thank you for registering an account with MSL (Moonton Student Leaders) Philippines.</p>
            
            <p>To complete your account creation, please use the 6-digit verification code below in your signup form:</p>
            
            <div class="verification-code">
                {{ $verificationCode }}
            </div>
            
            <div class="warning">
                <strong>Important:</strong> This verification code will expire in 10 minutes. If you do not register within this time, you will need to request a new code.
            </div>
            
            <p>If you did not request this email, please ignore it.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent from the MSL registration portal.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
