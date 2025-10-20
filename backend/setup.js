const fs = require('fs');
const path = require('path');

console.log('🚀 CaveBeat Backend Setup');
console.log('========================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📧 Email Configuration Required:');
console.log('1. Go to your Gmail account (cavebeatindia@gmail.com)');
console.log('2. Enable 2-Factor Authentication');
console.log('3. Generate an App Password:');
console.log('   - Go to Google Account Settings');
console.log('   - Security → 2-Step Verification → App passwords');
console.log('   - Generate password for "Mail"');
console.log('4. Update .env file with the app password:');
console.log('   SMTP_PASS=your_16_character_app_password');

console.log('\n📱 WhatsApp Configuration (Optional):');
console.log('1. Get WhatsApp Business API access');
console.log('2. Update .env file with your credentials');

console.log('\n🔧 Next Steps:');
console.log('1. Update .env file with your credentials');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Backend will be available at http://localhost:3001');

console.log('\n📋 Environment Variables to Configure:');
console.log('- SMTP_PASS: Your Gmail app password');
console.log('- WHATSAPP_TOKEN: Your WhatsApp Business API token (optional)');
console.log('- WHATSAPP_PHONE_ID: Your WhatsApp phone ID (optional)');

console.log('\n✨ Setup complete! Check the .env file and update the credentials.');
