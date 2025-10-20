const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// OAuth2 setup for Gmail
const setupOAuth2Transporter = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USER || 'cavebeatindia@gmail.com',
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: oauth2Client.getAccessToken()
    }
  });
};

module.exports = { setupOAuth2Transporter };
