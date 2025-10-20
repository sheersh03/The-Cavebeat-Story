// Vercel serverless function for hire team form submission
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message,
      preferredContact
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'company', 'projectType', 'budget', 'timeline', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]?.trim());
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number format (international format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Please use international format (e.g., +918448802078)'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'cavebeatindia@gmail.com',
        pass: process.env.SMTP_PASS
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    // Create team notification email
    const teamEmail = {
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
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Name:</td><td style="padding: 8px 0; color: #1f2937;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0ea5e9; text-decoration: none;">${phone}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td><td style="padding: 8px 0; color: #1f2937;">${company}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Preferred Contact:</td><td style="padding: 8px 0; color: #1f2937;">${preferredContact}</td></tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 10px;">📋 Project Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Project Type:</td><td style="padding: 8px 0; color: #1f2937;">${projectType}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Budget Range:</td><td style="padding: 8px 0; color: #1f2937;">${budget}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Timeline:</td><td style="padding: 8px 0; color: #1f2937;">${timeline}</td></tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">💬 Project Description</h2>
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; white-space: pre-wrap; color: #1f2937; line-height: 1.6;">${message}</p>
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              Submitted on: ${new Date().toLocaleString()}
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
• Name: ${name}
• Email: ${email}
• Phone: ${phone}
• Company: ${company}
• Preferred Contact: ${preferredContact}

PROJECT DETAILS:
• Project Type: ${projectType}
• Budget Range: ${budget}
• Timeline: ${timeline}

PROJECT DESCRIPTION:
${message}

Submitted on: ${new Date().toLocaleString()}

---
CaveBeat Team Notification System
      `.trim()
    };

    // Create client confirmation email
    const clientEmail = {
      from: `"CaveBeat Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '✅ Thank you for your interest in CaveBeat!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Thank You!</h1>
            <p style="color: #e0f2fe; margin: 10px 0 0 0;">Your project inquiry has been received</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">🎉 What's Next?</h2>
              <p style="color: #1f2937; line-height: 1.6; margin-bottom: 15px;">
                Thank you for your interest in our vision! Let's build something great together. 
                Our experts will contact you shortly to discuss your project requirements.
              </p>
              
              <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">📋 Your Project Summary:</h3>
                <p style="margin: 5px 0; color: #374151;"><strong>Project Type:</strong> ${projectType}</p>
                <p style="margin: 5px 0; color: #374151;"><strong>Budget Range:</strong> ${budget}</p>
                <p style="margin: 5px 0; color: #374151;"><strong>Timeline:</strong> ${timeline}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">⏰ Expected Response Time:</h3>
                <p style="margin: 5px 0; color: #374151;">Our team typically responds within 2-4 hours during business hours.</p>
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              CaveBeat Digital Innovation Studio
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">
              Transforming ideas into reality
            </p>
          </div>
        </div>
      `,
      text: `
✅ Thank you for your interest in CaveBeat!

What's Next?
Thank you for your interest in our vision! Let's build something great together. 
Our experts will contact you shortly to discuss your project requirements.

Your Project Summary:
• Project Type: ${projectType}
• Budget Range: ${budget}
• Timeline: ${timeline}

Expected Response Time:
Our team typically responds within 2-4 hours during business hours.

---
CaveBeat Digital Innovation Studio
Transforming ideas into reality
      `.trim()
    };

    // Send both emails
    await transporter.sendMail(teamEmail);
    await transporter.sendMail(clientEmail);

    // Log WhatsApp notification (simulated)
    console.log('📱 WhatsApp notification (simulated):', {
      to: process.env.WHATSAPP_TO_NUMBER || '+918448802078',
      message: `New hire team submission from ${name} (${company}) - ${projectType} project`
    });

    res.status(200).json({
      success: true,
      message: 'Submission received successfully',
      submissionId: Date.now()
    });

  } catch (error) {
    console.error('Error processing hire team submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
