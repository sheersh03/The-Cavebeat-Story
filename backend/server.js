const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'cavebeatindia@gmail.com',
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const createTeamNotificationEmail = (submission) => {
  return {
    from: `"CaveBeat Notifications" <${process.env.SMTP_USER}>`,
    to: 'cavebeatindia@gmail.com',
    subject: '🚀 New Hire Team Submission - CaveBeat',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New Hire Team Submission</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0;">CaveBeat Expert Team Request</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">👤 Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${submission.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${submission.email}" style="color: #0ea5e9; text-decoration: none;">${submission.email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${submission.phone}" style="color: #0ea5e9; text-decoration: none;">${submission.phone}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td><td style="padding: 8px 0; color: #1f2937;">${submission.company}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Preferred Contact:</td><td style="padding: 8px 0; color: #1f2937;">${submission.preferredContact}</td></tr>
            </table>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📋 Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Project Type:</td><td style="padding: 8px 0; color: #1f2937;">${submission.projectType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Budget Range:</td><td style="padding: 8px 0; color: #1f2937;">${submission.budget}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Timeline:</td><td style="padding: 8px 0; color: #1f2937;">${submission.timeline}</td></tr>
            </table>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">💬 Project Description</h2>
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; white-space: pre-wrap; color: #1f2937; line-height: 1.6;">${submission.message}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">
            Submitted on: ${new Date(submission.submittedAt).toLocaleString()}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">
            CaveBeat Team Notification System
          </p>
        </div>
      </div>
    `,
    text: `
🚀 NEW HIRE TEAM SUBMISSION - CaveBeat

CONTACT INFORMATION:
• Name: ${submission.name}
• Email: ${submission.email}
• Phone: ${submission.phone}
• Company: ${submission.company}
• Preferred Contact: ${submission.preferredContact}

PROJECT DETAILS:
• Project Type: ${submission.projectType}
• Budget Range: ${submission.budget}
• Timeline: ${submission.timeline}

PROJECT DESCRIPTION:
${submission.message}

Submitted on: ${new Date(submission.submittedAt).toLocaleString()}

---
CaveBeat Team Notification System
    `.trim()
  };
};

const createClientConfirmationEmail = (submission) => {
  return {
    from: `"CaveBeat Team" <${process.env.SMTP_USER}>`,
    to: submission.email,
    subject: 'Thank you for your interest in CaveBeat! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${submission.name}! 🚀</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0;">Your project request has been received</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">What Happens Next?</h2>
            <ul style="color: #1f2937; line-height: 1.6;">
              <li>✅ Your submission has been received and reviewed</li>
              <li>✅ Our experts will analyze your requirements</li>
              <li>✅ We'll contact you within 24 hours via ${submission.preferredContact}</li>
              <li>✅ We'll discuss your project in detail</li>
            </ul>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Your Project Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Project Type:</td><td style="padding: 8px 0; color: #1f2937;">${submission.projectType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Budget Range:</td><td style="padding: 8px 0; color: #1f2937;">${submission.budget}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Timeline:</td><td style="padding: 8px 0; color: #1f2937;">${submission.timeline}</td></tr>
            </table>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #1e293b; margin-top: 0;">Ready to Build Something Extraordinary?</h3>
            <p style="color: #1f2937; margin-bottom: 0;">We're committed to turning your innovative ideas into reality. Our team of experts is excited to work with you!</p>
          </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">
            Best regards,<br>The CaveBeat Team
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">
            CaveBeat - Building Tomorrow's Technology Today
          </p>
        </div>
      </div>
    `,
    text: `
Hi ${submission.name},

Thank you for your interest in CaveBeat's expert team! 🚀

We've received your project request and our team is excited to learn more about your vision. Here's what happens next:

✅ Your submission has been received
✅ Our experts will review your requirements
✅ We'll contact you within 24 hours via ${submission.preferredContact}

Project Summary:
• Type: ${submission.projectType}
• Budget: ${submission.budget}
• Timeline: ${submission.timeline}

We're committed to building something extraordinary together!

Best regards,
The CaveBeat Team

---
CaveBeat - Building Tomorrow's Technology Today
    `.trim()
  };
};

// WhatsApp notification function
const sendWhatsAppNotification = async (submission) => {
  try {
    const message = `🚀 *NEW HIRE TEAM SUBMISSION*

👤 *Client Details:*
• Name: ${submission.name}
• Email: ${submission.email}
• Phone: ${submission.phone}
• Company: ${submission.company}

📋 *Project Details:*
• Type: ${submission.projectType}
• Budget: ${submission.budget}
• Timeline: ${submission.timeline}

💬 *Project Description:*
${submission.message}

⏰ Submitted: ${new Date(submission.submittedAt).toLocaleString()}

---
CaveBeat Team Notification System`;

    // In production, you would use WhatsApp Business API here
    // For now, we'll just log it
    console.log('📱 WhatsApp notification would be sent to +918448802078:');
    console.log(message);
    
    return { success: true, message: 'WhatsApp notification logged' };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { success: false, error: error.message };
  }
};

// API Routes
app.post('/api/hire-team', async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, timeline, message, preferredContact } = req.body;
    
    // Validation
    if (!name || !email || !phone || !company || !projectType || !budget || !timeline || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Phone validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Please use international format (e.g., +918448802078)'
      });
    }

    const submission = {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message,
      preferredContact,
      submittedAt: new Date().toISOString()
    };

    // Create email transporter
    const transporter = createTransporter();
    
    // Send team notification email
    const teamEmail = createTeamNotificationEmail(submission);
    await transporter.sendMail(teamEmail);
    console.log('✅ Team notification email sent to cavebeatindia@gmail.com');

    // Send client confirmation email
    const clientEmail = createClientConfirmationEmail(submission);
    await transporter.sendMail(clientEmail);
    console.log('✅ Client confirmation email sent to', email);

    // Send WhatsApp notification
    await sendWhatsAppNotification(submission);

    res.json({
      success: true,
      message: 'Submission received successfully',
      submissionId: Date.now()
    });

  } catch (error) {
    console.error('Error processing hire team submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CaveBeat Backend Server running on port ${PORT}`);
  console.log(`📧 Email configured for: ${process.env.SMTP_USER || 'cavebeatindia@gmail.com'}`);
  console.log(`📱 WhatsApp notifications enabled`);
});

module.exports = app;
