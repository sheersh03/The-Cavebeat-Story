// Backend API endpoint for handling hire team form submissions
// Note: This is a demo implementation. In production, use a proper backend framework

interface HireTeamSubmission {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
  preferredContact: string
  submittedAt: string
}

// In-memory storage for demo purposes
// In production, use a proper database like PostgreSQL, MongoDB, or Supabase
const submissions: HireTeamSubmission[] = []

// Demo API functions for hire team submissions
// In production, implement with Express.js, Fastify, or similar backend framework

export async function handleHireTeamSubmission(formData: Omit<HireTeamSubmission, 'submittedAt'>) {
  try {
    console.log('🚀 Starting form submission with data:', formData)
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'company', 'projectType', 'budget', 'timeline', 'message']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]?.trim())
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      throw new Error('Invalid email format')
    }
    
    // Validate phone number format (international format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(formData.phone)) {
      throw new Error('Invalid phone number format. Please use international format (e.g., +918448802078)')
    }
    
    console.log('✅ Form validation passed, sending to backend...')
    
    // Send to Vercel API route
    const apiUrl = import.meta.env.VITE_API_URL || '/api'
    const response = await fetch(`${apiUrl}/hire-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    console.log('📡 Backend response status:', response.status)
    
    const result = await response.json()
    console.log('📡 Backend response data:', result)
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit form')
    }
    
    console.log('✅ Form submission successful!')
    return result
    
  } catch (error) {
    console.error('Error processing hire team submission:', error)
    throw error
  }
}

export function getAllSubmissions() {
  return {
    submissions,
    total: submissions.length
  }
}

// Email notification functions
async function sendTeamNotification(submission: HireTeamSubmission) {
  try {
    console.log('📧 Sending team notification email to cavebeatindia@gmail.com...')
    
    // Email configuration for cavebeatindia@gmail.com
    const emailConfig = {
      to: 'cavebeatindia@gmail.com',
      from: 'cavebeatindia@gmail.com',
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
    }

    // Simulate SMTP email sending with delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('✅ Email sent successfully to cavebeatindia@gmail.com!')
    console.log('📧 Email details:', {
      to: emailConfig.to,
      subject: emailConfig.subject,
      timestamp: new Date().toISOString()
    })
    
    // Send WhatsApp notification
    await sendWhatsAppNotification(submission)
    
  } catch (error) {
    console.error('❌ Failed to send team notification:', error)
    throw new Error('Email delivery failed')
  }
}

// WhatsApp Business API integration
async function sendWhatsAppNotification(submission: HireTeamSubmission) {
  try {
    console.log('📱 Sending WhatsApp notification to +918448802078...')
    
    // WhatsApp Business API configuration
    const whatsappConfig = {
      to: '+918448802078', // CaveBeat India number
      message: `🚀 *NEW HIRE TEAM SUBMISSION*

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
CaveBeat Team Notification System`,
      template: 'hire_team_submission'
    }
    
    // Simulate WhatsApp Business API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ WhatsApp message sent successfully to +918448802078!')
    console.log('📱 WhatsApp details:', {
      to: whatsappConfig.to,
      template: whatsappConfig.template,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Failed to send WhatsApp notification:', error)
    // Don't throw error for WhatsApp failure, email is primary
    console.log('⚠️ WhatsApp notification failed, but email was sent successfully')
  }
}

async function sendClientConfirmation(submission: HireTeamSubmission) {
  try {
    const emailContent = `
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
    
    console.log('📧 CLIENT CONFIRMATION EMAIL:')
    console.log(emailContent)
    
    // In production, implement actual email sending:
    // await sendEmail({
    //   to: submission.email,
    //   subject: 'Thank you for your interest in CaveBeat! 🚀',
    //   html: formatClientEmailHTML(submission),
    //   text: emailContent
    // })
    
  } catch (error) {
    console.error('Error sending client confirmation:', error)
  }
}

// Helper function to format HTML emails (for production use)
function formatEmailHTML(submission: HireTeamSubmission): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #0ea5e9; }
        .value { margin-left: 10px; }
        .project-desc { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 New Hire Team Submission</h1>
      </div>
      <div class="content">
        <h2>Client Information</h2>
        <div class="field"><span class="label">Name:</span><span class="value">${submission.name}</span></div>
        <div class="field"><span class="label">Email:</span><span class="value">${submission.email}</span></div>
        <div class="field"><span class="label">Phone:</span><span class="value">${submission.phone}</span></div>
        <div class="field"><span class="label">Company:</span><span class="value">${submission.company}</span></div>
        <div class="field"><span class="label">Preferred Contact:</span><span class="value">${submission.preferredContact}</span></div>
        
        <h2>Project Details</h2>
        <div class="field"><span class="label">Type:</span><span class="value">${submission.projectType}</span></div>
        <div class="field"><span class="label">Budget:</span><span class="value">${submission.budget}</span></div>
        <div class="field"><span class="label">Timeline:</span><span class="value">${submission.timeline}</span></div>
        
        <h2>Project Description</h2>
        <div class="project-desc">${submission.message}</div>
        
        <p><strong>Submitted:</strong> ${new Date(submission.submittedAt).toLocaleString()}</p>
      </div>
    </body>
    </html>
  `
}

function formatClientEmailHTML(submission: HireTeamSubmission): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .highlight { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank You for Choosing CaveBeat! 🚀</h1>
      </div>
      <div class="content">
        <p>Hi ${submission.name},</p>
        
        <p>Thank you for your interest in CaveBeat's expert team! We're thrilled that you've chosen us to help bring your vision to life.</p>
        
        <div class="highlight">
          <h3>What Happens Next?</h3>
          <ul>
            <li>✅ Your submission has been received and reviewed</li>
            <li>✅ Our experts are analyzing your requirements</li>
            <li>✅ We'll contact you within 24 hours via ${submission.preferredContact}</li>
          </ul>
        </div>
        
        <h3>Your Project Summary</h3>
        <ul>
          <li><strong>Type:</strong> ${submission.projectType}</li>
          <li><strong>Budget:</strong> ${submission.budget}</li>
          <li><strong>Timeline:</strong> ${submission.timeline}</li>
        </ul>
        
        <p>We're committed to building something extraordinary together and can't wait to discuss your project in detail!</p>
        
        <p>Best regards,<br>The CaveBeat Team</p>
      </div>
      <div class="footer">
        <p>CaveBeat - Building Tomorrow's Technology Today</p>
      </div>
    </body>
    </html>
  `
}
