# 🚀 CaveBeat Deployment Guide

## 📋 Prerequisites
- ✅ Domain purchased
- ✅ GitHub repository
- ✅ Gmail account (cavebeatindia@gmail.com)
- ✅ Gmail App Password configured

---

## 🎯 Deployment Architecture

```
Frontend (Vercel) → Backend (Railway) → Gmail SMTP
     ↓                    ↓                ↓
Your Domain        Railway URL      Email Delivery
```

---

## 🚀 Step 1: Deploy Backend (Railway)

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your repository

### 1.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the `backend` folder
5. Railway will auto-detect Node.js

### 1.3 Configure Environment Variables
In Railway dashboard, add these variables:

```env
NODE_ENV=production
PORT=3001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=cavebeatindia@gmail.com
SMTP_PASS=your_16_character_app_password
CORS_ORIGIN=https://your-domain.com
```

### 1.4 Get Backend URL
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Copy this URL for frontend configuration

---

## 🌐 Step 2: Deploy Frontend (Vercel)

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### 2.2 Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### 2.3 Set Environment Variables
In Vercel dashboard, add:

```env
VITE_API_URL=https://your-app-name.railway.app
VITE_APP_NAME=CaveBeat
VITE_APP_ENV=production
```

### 2.4 Deploy
- Click "Deploy"
- Vercel will build and deploy automatically
- You'll get a URL like: `https://your-app-name.vercel.app`

---

## 🌍 Step 3: Configure Domain

### 3.1 Update DNS Records
In your domain provider's DNS settings:

```
Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### 3.2 Add Domain to Vercel
1. Go to your Vercel project
2. Click "Domains"
3. Add your domain
4. Vercel will provide SSL certificate automatically

### 3.3 Update Backend CORS
Update Railway environment variable:
```env
CORS_ORIGIN=https://your-domain.com
```

---

## 🔧 Step 4: Final Configuration

### 4.1 Update Frontend API URL
Update the environment variable in Vercel:
```env
VITE_API_URL=https://your-backend-url.railway.app
```

### 4.2 Test Email Functionality
1. Go to your live website
2. Fill out the "Hire Team" form
3. Check `cavebeatindia@gmail.com` for emails

### 4.3 SSL Certificates
- ✅ Vercel: Automatic SSL
- ✅ Railway: Automatic SSL
- ✅ Your domain: Automatic SSL via Vercel

---

## 🧪 Step 5: Testing

### 5.1 Frontend Tests
- [ ] Website loads at your domain
- [ ] All pages work (Landing, Work, Contact)
- [ ] Mobile responsive
- [ ] Animations work

### 5.2 Backend Tests
- [ ] API health check: `https://your-backend.railway.app/api/health`
- [ ] Form submission works
- [ ] Emails are delivered
- [ ] CORS allows your domain

### 5.3 Email Tests
- [ ] Team notification emails arrive
- [ ] Client confirmation emails arrive
- [ ] Email formatting is correct

---

## 📊 Monitoring & Maintenance

### Health Checks
- **Frontend**: Vercel dashboard
- **Backend**: Railway dashboard
- **Email**: Gmail inbox monitoring

### Updates
1. Push changes to GitHub
2. Vercel auto-deploys frontend
3. Railway auto-deploys backend
4. Test on staging first

---

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Update `CORS_ORIGIN` in Railway
2. **Email Not Sending**: Check `SMTP_PASS` in Railway
3. **Domain Not Loading**: Check DNS propagation (up to 24 hours)
4. **Build Failures**: Check Vercel build logs

### Support
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Domain: Your domain provider's support

---

## 🎉 Success Checklist

- [ ] Domain points to Vercel
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] SSL certificates active
- [ ] Email functionality working
- [ ] Mobile responsive
- [ ] All animations working
- [ ] Form submissions working

**Your CaveBeat website is now live! 🚀**
