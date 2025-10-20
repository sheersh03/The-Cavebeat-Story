const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
const testEmailConfiguration = async () => {
  console.log('🔧 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`SMTP_HOST: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`SMTP_PORT: ${process.env.SMTP_PORT || '587'}`);
  console.log(`SMTP_USER: ${process.env.SMTP_USER || 'cavebeatindia@gmail.com'}`);
  console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? '***configured***' : 'NOT SET'}`);
  console.log('');

  if (!process.env.SMTP_PASS) {
    console.log('❌ SMTP_PASS not configured! Please set your Gmail app password in .env file');
    return false;
  }

  try {
    // Create transporter
    console.log('📧 Creating email transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'cavebeatindia@gmail.com',
        pass: process.env.SMTP_PASS
      }
    });

    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: `"CaveBeat Test" <${process.env.SMTP_USER}>`,
      to: 'cavebeatindia@gmail.com',
      subject: '🧪 CaveBeat Email System Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🧪 Email System Test</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0;">CaveBeat Backend Email Verification</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0;">✅ Email System Status</h2>
              <ul style="color: #1f2937; line-height: 1.6;">
                <li>✅ SMTP Connection: Working</li>
                <li>✅ Gmail Authentication: Success</li>
                <li>✅ Email Templates: Ready</li>
                <li>✅ Form Processing: Active</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #1e293b; margin-top: 0;">🚀 System Ready!</h3>
              <p style="color: #1f2937; margin-bottom: 0;">The CaveBeat email system is fully operational and ready to process form submissions.</p>
            </div>
          </div>
          
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              Test completed at: ${new Date().toLocaleString()}
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">
              CaveBeat Email System
            </p>
          </div>
        </div>
      `,
      text: `
🧪 CaveBeat Email System Test

✅ Email System Status:
• SMTP Connection: Working
• Gmail Authentication: Success  
• Email Templates: Ready
• Form Processing: Active

🚀 System Ready!
The CaveBeat email system is fully operational and ready to process form submissions.

Test completed at: ${new Date().toLocaleString()}
---
CaveBeat Email System
      `.trim()
    };

    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📬 Sent to: ${testEmail.to}`);
    console.log('');

    return true;

  } catch (error) {
    console.log('❌ Email test failed:');
    console.log(`Error: ${error.message}`);
    console.log('');
    
    if (error.code === 'EAUTH') {
      console.log('🔐 Authentication Error:');
      console.log('• Check your Gmail app password');
      console.log('• Ensure 2FA is enabled on Gmail');
      console.log('• Verify the password in .env file');
    } else if (error.code === 'ECONNECTION') {
      console.log('🌐 Connection Error:');
      console.log('• Check your internet connection');
      console.log('• Verify SMTP settings');
    }
    
    return false;
  }
};

// Run the test
testEmailConfiguration()
  .then(success => {
    if (success) {
      console.log('🎉 Email system is working perfectly!');
      console.log('📧 Check your Gmail inbox at cavebeatindia@gmail.com');
    } else {
      console.log('❌ Email system needs configuration');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
