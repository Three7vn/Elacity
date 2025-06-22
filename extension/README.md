# Elacity Browser Extension

The core browser extension that provides real-time analysis of academic papers on arXiv.

## 🚀 Features

- **Real-time Analysis**: Activates automatically on arXiv PDF pages
- **Smart UI**: Beautiful floating panel with analysis results
- **Loading States**: Engaging animations while processing
- **Error Handling**: Graceful fallbacks and user feedback
- **Modern Stack**: React 18 + Vite + Manifest V3

## 📖 How It Works - User Flow

```
📄 arXiv Paper
    │
    ▼
┌─────────────────────────┐
│  "Start Research"       │
│  Button Click           │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Research Analysis      │
│  • Methodological Rigor │
│  • Data Quality         │
│  • Innovation Level     │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ "See Detailed Insights" │
│ Button Click            │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Detailed Breakdown View                 │
├─────────────────────────────────────────────────────────────┤
│ Header: Research Analysis + Back Button                    │
│ Paper Title                                                 │
│                                                             │
│ ┌─────────────────────┐                                     │
│ │ ELI12 Toggle        │                                     │
│ │ "Explain like I'm 12"│                                     │
│ └─────────────────────┘                                     │
│          │                                                  │
│          ├─── OFF (Gray) ──┐                               │
│          │                 │                               │
│          └─── ON (Blue) ───┤                               │
│                            │                               │
│ ┌──────────────────────────┼──────────────────────────────┐ │
│ │        REGULAR MODE      │        ELI12 MODE            │ │
│ │                          │                              │ │
│ │ 📝 Summary Section       │ 📝 Summary Section           │ │
│ │ "This paper presents     │ "Imagine you have a super    │ │
│ │  a novel approach to     │  smart robot that reads      │ │
│ │  transformer attention   │  really long books..."       │ │
│ │  mechanisms..."          │                              │ │
│ │ [Read more] ──────────── │ [Read more] ─────────────────│ │
│ │                          │                              │ │
│ │ 🔍 Key Insights          │ 🔍 Key Insights              │ │
│ │ • "Novel sparse attention│ • "The robot learned a super │ │
│ │   pattern reduces        │   smart way to read that     │ │
│ │   computational          │   makes it much faster"      │ │
│ │   complexity"            │                              │ │
│ │ • "Two-stage training    │ • "Scientists taught the     │ │
│ │   process with           │   robot using a two-step     │ │
│ │   lightweight scorer"    │   method that works well"    │ │
│ │ • "40% computational     │ • "The new robot uses 40%    │ │
│ │   savings achieved"      │   less energy but is just    │ │
│ │                          │   as smart"                  │ │
│ └──────────────────────────┴──────────────────────────────┘ │
│                                                             │
│ [Explore related papers] Button                            │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Loading in Browser

#### Chrome/Edge
1. Open `chrome://extensions/`
2. Enable "Developer mode"  
3. Click "Load unpacked"
4. Select the `dist/` folder

#### Firefox
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `dist/manifest.json`

## 📁 Project Structure

```
extension/
├── src/
│   ├── popup/           # Extension popup UI
│   │   ├── index.html
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── contentScript.js # Injected into arXiv pages
│   ├── background.js    # Service worker
│   └── components/      # Shared React components
├── public/
│   ├── manifest.json    # Extension manifest
│   ├── elacity.png     # Extension icon
│   └── ...
├── dist/               # Built extension (auto-generated)
├── package.json
└── vite.config.js
```

## 🎯 How It Works

1. **Content Script Injection**: Automatically runs on `arxiv.org/pdf/*`
2. **Paper Detection**: Extracts paper URL and metadata  
3. **Analysis Request**: Sends URL to AI backend for processing
4. **Results Display**: Shows analysis in floating panel
5. **User Interaction**: Expandable sections, ELI12 toggle, etc.

## 🔧 Configuration

### Manifest Settings
- **Permissions**: `activeTab`, `storage`, `tabs`
- **Host Permissions**: `*://arxiv.org/pdf/*`
- **Content Scripts**: Auto-inject on arXiv PDF pages

### Build Configuration
- **Vite**: Modern bundler with React support
- **Rollup**: Multiple entry points for extension files
- **ESLint**: Code quality and consistency

## 📱 Extension Architecture

### Content Script (`contentScript.js`)
- Detects arXiv papers
- Creates floating analysis panel
- Handles user interactions
- Manages loading/error states

### Popup (`src/popup/`)
- Extension settings and preferences
- User account management (future)
- Quick paper analysis (future)

### Background Script (`background.js`)
- Manages extension lifecycle
- Handles API requests
- Cross-tab communication

## 🎨 UI Components

### Analysis Panel
- **Header**: Paper title and close button
- **Loading State**: Animated blob with status messages
- **Results**: Structured analysis with sections
- **ELI12 Toggle**: Switch between technical and simple explanations

### Visual Design
- **Glass-morphism**: Modern blur effects
- **Poppins Font**: Consistent with brand
- **Responsive**: Works across different screen sizes
- **Animations**: Smooth transitions and loading states

## 🧪 Testing

### Manual Testing
1. Navigate to any arXiv paper (e.g., `https://arxiv.org/pdf/2301.00001.pdf`)
2. Look for "Elacity Active" badge
3. Click "Start Research" button
4. Verify analysis panel appears
5. Test ELI12 toggle functionality

### Test Papers
- **ML Paper**: https://arxiv.org/pdf/1706.03762.pdf (Attention Is All You Need)
- **Physics**: https://arxiv.org/pdf/2301.00001.pdf
- **CS Theory**: https://arxiv.org/pdf/2302.00001.pdf

## 🔗 Integration with AI Backend

The extension communicates with the AI analysis system:

```javascript
// Example: Trigger analysis
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    url: window.location.href,
    type: 'full',
    eli12: false
  })
});
```

See the [`../ai/`](../ai/) folder for backend implementation.

## 🚀 Deployment

### Chrome Web Store
1. Build: `npm run build`
2. Zip the `dist/` folder
3. Upload to Chrome Developer Dashboard
4. Submit for review

### Firefox Add-ons
1. Build: `npm run build`  
2. Create signed XPI
3. Submit to addons.mozilla.org

## 🤝 Contributing

1. **Setup**: Follow development setup above
2. **Make Changes**: Edit files in `src/`
3. **Test**: Load extension and test on arXiv papers
4. **Submit**: Create pull request with description

### Code Style
- Use ESLint configuration
- Follow React best practices
- Add comments for complex logic
- Test on multiple browsers

## 📝 Known Issues

- Currently only supports arXiv papers
- Requires internet connection for analysis
- Large papers may take longer to process

## 🔮 Future Features

- Support for more academic platforms
- Offline analysis capabilities  
- Paper comparison tools
- Citation network visualization
- Collaborative annotations

---

For questions or issues, see the main [repository README](../README.md). 