# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. **Click the Deploy Button**
   ```
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/figma-make-to-react)
   ```

2. **Connect GitHub**
   - Sign in with GitHub
   - Select your repository
   - Click "Deploy"

3. **Your app is live!** 🎉

### Option 2: Manual Deploy

#### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `figma-make-to-react`
3. Make it public
4. Don't initialize with README (we already have one)
5. Click "Create repository"

#### Step 2: Push to GitHub

```bash
# Add the remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/figma-make-to-react.git

# Push to GitHub
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `figma-make-to-react` repository
5. Click "Deploy"

#### Step 4: Configure Environment Variables (Optional)

In your Vercel project settings, add:
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🎯 Post-Deployment

### Your Live App
- **URL**: `https://your-app.vercel.app`
- **Upload Interface**: `https://your-app.vercel.app/upload`
- **Preview**: `https://your-app.vercel.app/preview`

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records

## 🔄 Automatic Deployments

The GitHub Actions workflow will automatically deploy:
- Every push to `main` branch
- Every pull request (preview deployment)

## 📱 Desktop App Deployment

### Build for Distribution
```bash
# Build the desktop app
npm run build-app

# The app will be in dist/mac/Figma Converter.app
```

### Distribute
1. Zip the `.app` file
2. Upload to GitHub Releases
3. Share the download link

## 🛠️ Troubleshooting

### Build Errors
- Check Node.js version (18+ required)
- Run `npm install` locally first
- Check for TypeScript errors

### Deployment Issues
- Verify all files are committed
- Check Vercel build logs
- Ensure environment variables are set

### Performance
- Images are automatically optimized
- CSS is minified
- JavaScript is bundled and compressed

## 🎉 Success!

Your Figma Make → React converter is now live and ready to use!

- **Share the URL** with your team
- **Upload Figma exports** to test
- **Customize components** as needed
- **Deploy updates** by pushing to GitHub

---

**Need help?** Open an issue on GitHub or check the [documentation](README.md).
