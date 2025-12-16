# SlideGen AI - Professional Presentation Generator

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

## 🚀 Overview

**SlideGen AI** is an intelligent presentation builder powered by Google's Gemini AI. Simply provide a topic or upload a PDF document, and our AI will automatically generate a professional, visually stunning PowerPoint presentation with relevant content, AI-generated images, and smooth animations.

View your app in AI Studio: https://ai.studio/apps/drive/1pm13qLyGleT7qazuh1UMPUv4IpToaM59

## ✨ Key Features

### 🤖 AI-Powered Content Generation
- **Smart Content Creation**: Gemini AI generates structured, professional content tailored to your topic
- **Automatic Slide Structuring**: Creates title slides, content slides, sections, and conclusions automatically
- **Speaker Notes**: Generates helpful presenter notes for each slide

### 🎨 Visual Excellence
- **AI Image Generation**: Automatically creates relevant, high-quality images for each slide using Gemini's image generation
- **Professional Themes**: 4 beautiful pre-designed themes (Modern Blue, Minimal Dark, Elegant Purple, Corporate Gray)
- **Smart Theme Selection**: Randomly selects professional themes with beautiful color schemes
- **Smooth Animations**: Multiple transition options (Fade, Push, Wipe, Cover, Uncover)

### 📄 PDF Integration
- **PDF Upload**: Extract text from PDF documents to base your presentation on
- **Smart Text Extraction**: Uses PDF.js to intelligently extract and process document content
- **Auto Topic Detection**: Automatically suggests topics based on PDF filename

### ✏️ Rich Editing Capabilities
- **Live Preview**: See your changes in real-time as you edit
- **Rich Text Formatting**: Bold, italic, and underline text support
- **Slide Management**: Add, remove, and reorder content points
- **Transition Control**: Customize slide transitions individually
- **Image Placeholders**: Visual indicators while AI generates images

### 📥 Export & Presentation
- **PPTX Export**: Download fully editable PowerPoint files
- **Play Mode**: Full-screen presentation mode with keyboard navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Technologies Used

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Google Gemini AI** - Content and image generation
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **PptxGenJS** - PowerPoint file generation
- **PDF.js** - PDF text extraction
- **Lucide Icons** - Beautiful icon library

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MD-Abdul-Raheem/PPT-Gen-AI.git
cd PPT-Gen-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## 📖 How to Use

### Step 1: Enter Your Topic
- Type in a topic in the input field (e.g., "The Future of Renewable Energy")
- OR upload a PDF document as your content source

### Step 2: Select Slide Count
- Choose how many slides you want: 5, 8, 12, or 15 slides
- The AI will structure content accordingly

### Step 3: Generate Presentation
- Click "Generate Presentation"
- AI will create your deck with auto-selected theme and animations
- Images will be generated in the background

### Step 4: Edit & Customize
- Click "Edit" to enter edit mode
- Modify slide titles and content
- Add or remove bullet points
- Apply rich text formatting (bold, italic, underline)
- Change individual slide transitions

### Step 5: Preview & Export
- Use "Play" mode to preview your presentation full-screen
- Navigate with arrow keys or on-screen buttons
- Click "Export PPTX" to download your presentation

## 🎨 Available Themes

1. **Modern Blue** - Clean and professional with blue accents
2. **Minimal Dark** - Sleek dark theme for modern presentations
3. **Elegant Purple** - Sophisticated purple gradient theme
4. **Corporate Gray** - Classic corporate gray theme

## ⌨️ Keyboard Shortcuts

### Presentation Mode
- `→` or `Space` - Next slide
- `←` - Previous slide
- `Esc` - Exit presentation mode

### Edit Mode
- `Ctrl+B` - Bold text
- `Ctrl+I` - Italic text
- `Ctrl+U` - Underline text

## 📁 Project Structure

```
ppt-gen-ai/
├── components/
│   ├── AboutPage.tsx       # About page component
│   ├── InputSection.tsx    # Topic input and PDF upload
│   └── PreviewSection.tsx  # Slide preview and editing
├── services/
│   ├── geminiService.ts    # AI content & image generation
│   ├── pdfService.ts       # PDF text extraction
│   └── pptxService.ts      # PowerPoint file generation
├── App.tsx                 # Main application component
├── constants.ts            # Theme and configuration constants
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── index.css               # Global styles
└── vite.config.ts          # Vite configuration
```

## 🔧 Configuration

### Slide Count Options
Modify `constants.ts` to change available slide counts:

```typescript
export const DEFAULT_SLIDE_COUNT = 8;
```

### Themes
Add or modify themes in `constants.ts`:

```typescript
export const THEMES: Theme[] = [
  {
    id: ThemeId.MODERN_BLUE,
    name: 'Modern Blue',
    colors: { /* ... */ },
    fonts: { /* ... */ }
  }
];
```

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Environment Variables
Remember to set `GEMINI_API_KEY` in your deployment platform's environment variables.

## 🐛 Troubleshooting

### Images Not Generating
- Ensure your Gemini API key has image generation enabled
- Check browser console for API errors
- Verify API quota limits

### PDF Upload Not Working
- Ensure PDF contains extractable text (not scanned images)
- Check file size limits
- Verify PDF.js worker is loading correctly

### Export Issues
- Check browser console for errors
- Ensure all images have loaded before exporting
- Try with a smaller presentation first

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content and image generation
- PptxGenJS for PowerPoint file generation
- PDF.js for PDF text extraction
- Lucide for beautiful icons
- Tailwind CSS for styling utilities

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Google AI Studio documentation](https://ai.google.dev/)

---

Built with ❤️ using Google AI Studio • Version 1.0.0
