# CaveBeat Backend API

This backend handles form submissions and sends real emails and WhatsApp notifications.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Email (Required)
1. **Enable 2-Factor Authentication** on your Gmail account (`cavebeatindia@gmail.com`)
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env file**:
   ```env
   SMTP_PASS=your_16_character_app_password
   ```

### 3. Start the Server
```bash
npm start
# or for development
npm run dev
```

## 📧 Email Configuration

The backend sends two types of emails:

### Team Notification Email
- **To**: `cavebeatindia@gmail.com`
- **Content**: Complete form submission details
- **Format**: Professional HTML email with project details

### Client Confirmation Email
- **To**: Client's email address
- **Content**: Thank you message and next steps
- **Format**: Branded confirmation email

## 📱 WhatsApp Integration

Currently logs WhatsApp messages to console. To enable real WhatsApp notifications:

1. Get WhatsApp Business API access
2. Update `.env` file:
   ```env
   WHATSAPP_TOKEN=your_whatsapp_token
   WHATSAPP_PHONE_ID=your_phone_id
   ```

## 🔧 API Endpoints

### POST `/api/hire-team`
Handles hire team form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+918448802078",
  "company": "Example Corp",
  "projectType": "Web Development",
  "budget": "$10,000 - $25,000",
  "timeline": "3-6 months",
  "message": "Project description...",
  "preferredContact": "email"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission received successfully",
  "submissionId": 1234567890
}
```

### GET `/api/health`
Health check endpoint.

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Email and phone format validation

## 🔍 Troubleshooting

### Email Not Sending
1. Check Gmail app password is correct
2. Verify 2FA is enabled on Gmail account
3. Check server logs for SMTP errors

### CORS Issues
Update `CORS_ORIGIN` in `.env` file to match your frontend URL.

### Rate Limiting
If hitting rate limits, increase `RATE_LIMIT_MAX` in `.env` file.

## 📊 Monitoring

Check server logs for:
- ✅ Email delivery confirmations
- 📱 WhatsApp notification logs
- ❌ Error messages and stack traces

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**:
   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Process Manager**: Use PM2 or similar
3. **Reverse Proxy**: Use Nginx or Apache
4. **SSL Certificate**: For HTTPS
5. **Database**: Add MongoDB/PostgreSQL for data persistence

## 📞 Support

For issues with email delivery or API functionality, check:
1. Server logs in terminal
2. Gmail account security settings
3. Network connectivity
4. Environment variable configuration
