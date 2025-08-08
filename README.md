# Figma Make to React Converter

Transform Figma Make designs into pixel-perfect React applications automatically! 🚀

## 🎯 Features

- **Drag & Drop Interface**: Upload Figma exports directly through a web interface
- **Pixel-Perfect Conversion**: Maintains exact design fidelity
- **Auto-Open in Cursor**: Seamlessly opens converted projects in Cursor IDE
- **Desktop App**: Native macOS app for easy access
- **TypeScript Support**: Full type safety for generated components
- **Tailwind CSS**: Modern, responsive styling
- **Asset Optimization**: Automatic image optimization and WebP conversion
- **Storybook Integration**: Component documentation and testing
- **Accessibility**: Built-in a11y checks and improvements

## 🚀 Quick Start

### Web Interface
```bash
npm run dev
# Open http://127.0.0.1:3001
```

### Desktop App
```bash
# Build the native macOS app
npm run build-app

# Install to Applications
cp -r dist/mac/Figma\ Converter.app /Applications/

# Run the app
open dist/mac/Figma\ Converter.app
```

## 📁 Project Structure

```
figma-project/
├── figma-exports/          # Your Figma Make exports
│   ├── assets/            # Images, SVGs, etc.
│   └── code/              # HTML files
├── src/
│   ├── components/
│   │   ├── generated/     # Auto-generated React components
│   │   └── ui/           # Shared UI components
│   ├── app/              # Next.js app router
│   └── generated/        # Auto-generated files
├── scripts/              # Conversion pipeline
└── electron/             # Desktop app files
```

## 🔧 Available Scripts

### Core Conversion
- `npm run build-all` - Complete conversion pipeline
- `npm run convert` - Convert Figma HTML to React
- `npm run assets` - Optimize images and assets
- `npm run icons` - Build SVG icon registry

### Development
- `npm run dev` - Start web interface
- `npm run storybook` - Component documentation
- `npm run test` - Run tests
- `npm run format` - Format code

### Desktop App
- `npm run build-app` - Build native macOS app
- `npm run electron-dev` - Run in development mode
- `npm run electron-dist` - Create distributable

## 🎨 How It Works

1. **Upload**: Drag your Figma Make export (ZIP file) to the web interface
2. **Process**: The system extracts files and runs the conversion pipeline
3. **Convert**: HTML is transformed into React components with Tailwind CSS
4. **Optimize**: Images are converted to WebP/AVIF and optimized
5. **Generate**: TypeScript types, Storybook stories, and documentation
6. **Open**: Automatically opens the converted project in Cursor IDE

## 🛠️ Conversion Features

- **Smart Class Mapping**: Maps Figma classes to Tailwind utilities
- **Responsive Design**: Maintains responsive behavior
- **Type Safety**: Generates TypeScript interfaces for props
- **CSS Modules**: Handles complex styles not covered by Tailwind
- **Grid System**: Preserves layout structure and spacing
- **Semantic HTML**: Converts to proper semantic elements
- **Asset Management**: Optimizes and organizes images/icons

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Manual Build
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run Storybook
npm run storybook

# Accessibility audit
npm run a11y
```

## 📱 Desktop App

The desktop app provides a native macOS experience:

- **Dock Icon**: Keep it in your dock for quick access
- **Native Menus**: Standard macOS application menus
- **Keyboard Shortcuts**: Cmd+Q to quit, etc.
- **Window Management**: Native window controls
- **Auto-Updates**: Built-in update mechanism

### Building the Desktop App

```bash
# Install dependencies
npm install

# Build the app
npm run build-app

# Install to Applications
cp -r dist/mac/Figma\ Converter.app /Applications/
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` - For AI-powered enhancements (optional)

### Customization
- Modify `scripts/convert-figma.mjs` for custom conversion rules
- Update `tailwind.config.js` for custom styling
- Edit `electron/main.js` for desktop app behavior

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for the Figma community**
