# 🎨 Figma Make → React App: Quick Start Guide

## ✨ **Super Simple Process**

### **Step 1: Export from Figma Make**
1. Open your design in Figma Make
2. Click **"Export"** or **"Download"**
3. Choose **"Development"** or **"Code"** export
4. Save the ZIP file to your Downloads folder

### **Step 2: Drop Your Files**
**Option A: Using Finder (Easy)**
1. Double-click the ZIP file to extract it
2. Open Finder and navigate to: `/Users/geoffpeterson/Library/figma-project`
3. Drag all **HTML files** into the `figma-exports/code/` folder
4. Drag all **images/assets** into the `figma-exports/assets/` folder

**Option B: Using Terminal (Fast)**
```bash
cd /Users/geoffpeterson/Library/figma-project
unzip ~/Downloads/your-figma-export.zip -d /tmp/extract
cp /tmp/extract/*.html figma-exports/code/
cp -R /tmp/extract/assets/* figma-exports/assets/
```

### **Step 3: Convert to React App**
Open Terminal and run:
```bash
cd /Users/geoffpeterson/Library/figma-project
npm run build-all
```

That's it! ✨

### **Step 4: See Your App**
```bash
# View your app in browser
npm run dev

# View components in Storybook
npm run storybook
```

---

## 🚀 **Advanced Features (Optional)**

### **Make Your Design Interactive**
Add these attributes to your Figma Make HTML for better React components:

**For Dynamic Text:**
```html
<h1 data-prop="title">Default Title</h1>
<!-- Becomes: props.title -->
```

**For Dynamic Images:**
```html
<img src="photo.jpg" data-prop-src="hero" data-prop-alt="heroAlt">
<!-- Becomes: props.hero and props.heroAlt -->
```

**For Replaceable Content:**
```html
<div data-slot="content">Default content here</div>
<!-- Becomes: props.content (can be any React content) -->
```

**For SVG Icons as Components:**
```html
<img src="icon.svg" data-svg="component">
<!-- Becomes: <SvgIcon /> React component -->
```

---

## 📁 **Project Structure**
```
figma-project/
├── figma-exports/          # Your Figma Make files go here
│   ├── code/              # HTML files
│   └── assets/            # Images, SVGs, etc.
├── src/
│   ├── components/
│   │   └── generated/     # Your React components appear here!
│   └── app/               # Next.js app
└── public/                # Optimized images
```

---

## 🛠️ **Useful Commands**

| Command | What it does |
|---------|-------------|
| `npm run build-all` | Convert everything (tokens → components → assets) |
| `npm run dev` | Start development server |
| `npm run storybook` | View your components |
| `npm run qa` | Check for issues |
| `npm run convert:strict` | Pure Tailwind (no CSS modules) |

---

## 🎯 **Quick Tips**

1. **File Names**: Keep image filenames unique (no duplicates in subfolders)
2. **Preview First**: Always run `npm run dev` to see your app before deploying
3. **Check Quality**: Run `npm run qa` and `npm run a11y` for accessibility checks
4. **Re-convert**: Just drop new files and run `npm run build-all` again
5. **Customize**: Edit files in `src/components/generated/` if needed

---

## 🆘 **Need Help?**

**Common Issues:**
- **"Module not found"**: Run `npm install` first
- **"No files converted"**: Check that HTML files are in `figma-exports/code/`
- **"Images missing"**: Ensure assets are in `figma-exports/assets/`
- **"Build failed"**: Run `npm run qa` to see what's wrong

**Get More Help:**
Just type `enhance` in any Cursor terminal for AI assistance!

---

**🎉 That's it! Your Figma design is now a working React app!**