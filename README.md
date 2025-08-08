# 🎨 Figma Make → React Converter

Convert your Figma Make designs into pixel-perfect React applications with automatic TypeScript support, Storybook integration, and deployment-ready code.

## ✨ Features

- **Drag & Drop Interface**: Upload Figma Make exports directly through the web interface
- **Pixel-Perfect Conversion**: Maintains exact spacing, colors, typography, and layout
- **TypeScript Support**: Auto-generated typed props for all components
- **Storybook Integration**: Interactive component stories for testing
- **Asset Optimization**: Automatic image optimization and SVG processing
- **Deployment Ready**: One-click deployment to Vercel
- **Desktop App**: Native desktop application for easy access

## 🚀 Quick Start

### Option 1: Web Interface
1. Visit the live app: [Figma Make Converter](https://your-app.vercel.app)
2. Drag & drop your Figma Make export (ZIP or folder)
3. Watch the conversion process in real-time
4. Preview your React components instantly

### Option 2: Desktop App
1. Download the desktop app from the releases
2. Launch the app and upload your Figma Make export
3. The app will automatically open in Cursor for editing

### Option 3: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/figma-make-to-react.git
cd figma-make-to-react

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://127.0.0.1:3001
```

## 📁 Project Structure

```
figma-make-to-react/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── upload/            # Upload interface
│   │   └── preview/           # Component preview
│   ├── components/
│   │   ├── generated/         # Auto-generated components
│   │   └── ui/               # Reusable UI components
│   └── styles/               # Global styles and themes
├── figma-exports/            # Uploaded Figma files
├── public/                   # Static assets
├── scripts/                  # Build and conversion scripts
└── electron/                 # Desktop app
```

## 🎯 Usage

### 1. Export from Figma Make
- In Figma Make, go to **Export → Download "Code"**
- This will give you a ZIP file with CSS and assets

### 2. Upload and Convert
- Drag the ZIP file or folder into the upload area
- The converter will:
  - Extract CSS and assets
  - Generate HTML structure from CSS
  - Convert to React components
  - Create TypeScript interfaces
  - Generate Storybook stories

### 3. Preview and Customize
- View components in the preview page
- Test interactions in Storybook
- Edit components in Cursor (auto-opens)

### 4. Deploy
- Push to GitHub
- Connect to Vercel for automatic deployment
- Your app is live! 🎉

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run storybook    # Start Storybook
npm run electron     # Launch desktop app
npm run test         # Run tests
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🎨 Generated Components

The converter creates React components with:
- **TypeScript interfaces** for all props
- **CSS Modules** for scoped styling
- **Storybook stories** for testing
- **Accessibility features** built-in
- **Responsive design** support

Example generated component:
```tsx
export interface GeneratedProps {
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  text6?: string;
}

export default function Generated(props: GeneratedProps) {
  return (
    <div className="custom-section">
      <header className="header">
        <nav className="nav">
          <div className="nav-item">{props.text1 ?? "Home"}</div>
          <div className="nav-item">{props.text2 ?? "About"}</div>
          <div className="nav-item">{props.text3 ?? "Contact"}</div>
        </nav>
      </header>
      <main className="main">
        <section className="hero">
          <h1 className="title">{props.text4 ?? "Welcome"}</h1>
          <p className="subtitle">{props.text5 ?? "Built with Figma Make"}</p>
        </section>
      </main>
    </div>
  )
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Deployment
```bash
# Build the project
npm run build

# Export static files
npm run export

# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Component stories with [Storybook](https://storybook.js.org/)
- Desktop app with [Electron](https://electronjs.org/)

---

**Made with ❤️ for the Figma community**
