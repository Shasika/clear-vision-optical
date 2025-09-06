# 🚀 Deployment Guide for Optical Website

This guide covers multiple deployment options for the Optical Website project, including GitHub Pages, Render, Railway, and Docker deployments.

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git repository pushed to GitHub
- GitHub account with repository access

## 🌐 Deployment Options

### 1. GitHub Pages (Frontend Only - Recommended for Static Demo)

#### Automatic Deployment
The project is configured with GitHub Actions for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Navigate to `Settings > Pages`
   - Under "Source", select "GitHub Actions"

2. **Automatic Deployment:**
   - Push changes to the `main` branch
   - The workflow automatically builds and deploys to GitHub Pages
   - Your site will be available at: `https://yourusername.github.io/optical-website`

#### Manual Steps (if needed):
```bash
# Build the project
npm install
npm run build

# The dist/ folder contains your built website
```

### 2. Render.com (Full Stack - Recommended)

#### Prerequisites:
- Create a [Render.com](https://render.com) account
- Connect your GitHub repository to Render

#### Deployment Steps:

1. **Automatic Deployment with render.yaml:**
   - The project includes a `render.yaml` file for automatic setup
   - In Render dashboard, create a new "Blueprint" 
   - Select your GitHub repository
   - Render will automatically deploy both frontend and backend

2. **Manual Setup (Alternative):**
   
   **Frontend Service:**
   - Create new "Static Site"
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   
   **Backend Service:**
   - Create new "Web Service"
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render default)

### 3. Railway (Full Stack Alternative)

1. **Setup Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend:**
   ```bash
   railway new
   cd server
   railway deploy
   ```

3. **Deploy Frontend:**
   - Use Railway's static site hosting
   - Build command: `npm run build`
   - Output directory: `dist`

### 4. Docker Deployment

#### Local Development:
```bash
# Start development servers
docker-compose up

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

#### Production Build:
```bash
# Build production image
docker build -t optical-website .

# Run production container
docker run -p 3001:3001 optical-website
```

#### Docker Hub Deployment:
```bash
# Tag and push to Docker Hub
docker tag optical-website yourusername/optical-website
docker push yourusername/optical-website
```

### 5. Vercel (Frontend + Serverless Functions)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Configure:**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### 6. Netlify (Frontend + Functions)

1. **Manual Upload:**
   - Build locally: `npm run build`
   - Drag and drop the `dist` folder to Netlify

2. **Git Integration:**
   - Connect your GitHub repository
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## 🔧 Configuration

### Environment Variables

For production deployments, set these environment variables:

**Backend (.env):**
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (Vite):**
```
VITE_API_URL=https://your-backend-domain.com
```

### GitHub Secrets (for GitHub Actions)

Set these in your repository Settings > Secrets and Variables > Actions:

- `RAILWAY_TOKEN` - For Railway deployment
- `RENDER_API_KEY` - For Render deployment  
- `RENDER_SERVICE_ID` - For Render deployment

## 📁 Project Structure

```
optical-website/
├── .github/workflows/          # GitHub Actions workflows
│   ├── ci.yml                 # Continuous Integration
│   ├── deploy-frontend.yml    # GitHub Pages deployment
│   └── deploy-backend.yml     # Backend deployment
├── server/                    # Backend API server
├── src/                       # Frontend React application
├── public/                    # Static assets
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose for development
├── render.yaml               # Render.com deployment config
└── DEPLOYMENT.md             # This file
```

## 🔍 Monitoring and Health Checks

### Backend Health Check
```
GET /api/health
```
Should return: `{ "status": "ok", "timestamp": "..." }`

### Frontend Health
Check that the site loads and displays the company information correctly.

## 🚨 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (18+ required)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

2. **CORS Issues:**
   - Ensure backend CORS is configured for your frontend domain
   - Check environment variables are set correctly

3. **Image Upload Issues:**
   - Ensure the `public/images/` directory exists and has write permissions
   - Check file size limits on your hosting platform

4. **GitHub Actions Failing:**
   - Check the Actions tab in your GitHub repository
   - Verify all required secrets are set
   - Check Node.js version compatibility

### Getting Help:

- Check the GitHub Issues tab for common problems
- Review deployment service logs (Render, Railway, etc.)
- Verify all environment variables are correctly set

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Test locally with `npm run build && npm run preview`
- [ ] Test backend with `cd server && npm start`
- [ ] Update environment variables for production
- [ ] Test file upload functionality
- [ ] Check responsive design on mobile devices
- [ ] Verify all navigation links work
- [ ] Test admin panel functionality
- [ ] Configure domain name (if using custom domain)
- [ ] Set up SSL certificate (usually automatic on hosting platforms)
- [ ] Configure monitoring and alerts

## 🎉 Success!

Your optical website should now be deployed and accessible! Remember to:

- Monitor your deployments for any issues
- Keep dependencies updated
- Regularly backup your data
- Monitor performance and user experience

For additional help or questions, refer to the main README.md file or create an issue in the GitHub repository.