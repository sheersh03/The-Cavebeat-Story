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
    
    // Create submission record
    const submission: HireTeamSubmission = {
      ...formData,
      submittedAt: new Date().toISOString()
    }
    
    // Store submission (in production, save to database)
    submissions.push(submission)
    
    // Send email notification to team
    await sendTeamNotification(submission)
    
    // Send confirmation email to client
    await sendClientConfirmation(submission)
    
    return {
      success: true,
      message: 'Submission received successfully',
      submissionId: submissions.length
    }
    
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
    // In production, use a service like SendGrid, AWS SES, or Nodemailer
    const emailContent = `
🚀 NEW HIRE TEAM SUBMISSION

Client Details:
• Name: ${submission.name}
• Email: ${submission.email}
• Phone: ${submission.phone}
• Company: ${submission.company}
• Preferred Contact: ${submission.preferredContact}

Project Details:
• Type: ${submission.projectType}
• Budget: ${submission.budget}
• Timeline: ${submission.timeline}

Project Description:
${submission.message}

Submitted: ${new Date(submission.submittedAt).toLocaleString()}

---
CaveBeat Team Notification System
    `.trim()
    
    console.log('📧 TEAM NOTIFICATION EMAIL:')
    console.log(emailContent)
    
    // In production, implement actual email sending:
    // await sendEmail({
    //   to: 'team@cavebeat.com',
    //   subject: '🚀 New Hire Team Submission',
    //   html: formatEmailHTML(submission),
    //   text: emailContent
    // })
    
  } catch (error) {
    console.error('Error sending team notification:', error)
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
