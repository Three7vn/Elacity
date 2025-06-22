# Elacity - Your Real-time Research Copilot

Elacity is a browser-native assistant that activates as you read academic papers, arXiv preprints, or scientific articles. It parses full content (even embedded PDFs), extracting key findings within the browser experience. More than just a summarizer, Elacity helps you read faster, critique deeper, and think clearer.

## 🗂️ Repository Structure

### 📁 `/website/`
The public-facing landing page for Elacity.
- **Tech**: Vanilla HTML, CSS, JavaScript
- **Deployment**: Static hosting

### 📁 `/extension/`
The browser extension that provides real-time paper analysis.
- **Tech**: React, Vite, Manifest V3
- **Target**: arXiv papers with plans to expand

### 📁 `/ai/`
AI/LLM integration for analyzing academic papers.
- **Tech**: Python, OpenAI API, prompt engineering
- **Features**: Full analysis, quick summaries, ELI12 mode

## 🚀 Quick Start

### 1. Set up the Extension
```bash
cd extension
npm install
npm run build
```

### 2. Set up AI Analysis
```bash
cd ai
pip install -r requirements.txt
cp ../.env.example ../.env
# Add your OpenAI API key to .env
python server.py
```

### 3. View the Website
```bash
cd website
# Open index.html in your browser
```

## 🌟 Features

- **🎯 Real-time Analysis**: Instant insights as you browse research papers
- **📚 Smart Parsing**: Extracts methodology, results, citations automatically  
- **🧠 AI-Powered**: Uses advanced LLMs for deep comprehension
- **🧒 ELI12 Mode**: Explains complex concepts in simple terms
- **⚡ Fast**: 32x faster reading through intelligent analysis
- **🔧 Open Source**: Transparent, community-driven development

## 📖 How It Works

1. **Visit arXiv paper** → Extension detects and activates
2. **AI analyzes content** → Extracts key findings, methodology, results  
3. **Get instant insights** → Structured analysis in floating panel
4. **Read smarter** → Focus on what matters most

## 🤝 Contributing

1. Fork the repository
2. Choose your component (`website`, `extension`, or `ai`)
3. Make your changes
4. Submit a pull request

See individual README files for component-specific 
contribution guidelines.

## 🛠️ Professional Setup Service

**Don't want to deal with the technical setup?** 

Email **avram@beesumbodi.com** with subject **"SETUP"** and get:
- ✅ Complete 1-on-1 setup assistance 
- ✅ Extension installed and configured
- ✅ AI backend running perfectly
- ✅ Personal walkthrough and training
- ✅ **Only $99** - Setup guaranteed within 24 hours
- ✅ Response within a few hours of your email

Perfect for researchers who want to start using Elacity immediately without any technical hassle.

## 🔮 Future Work

- **Mathematical Formatting**: Fix LaTeX/mathematical notation rendering in LLM summaries
- **Section-by-Section Analysis**: Explain different paper sections as you scroll with contextual insights
- **Interactive Q&A**: Ask follow-up questions about specific sections or concepts
- **Related Paper Discovery**: Explore similar papers through LLM-powered recommendations and web scraping
- **Beyond arXiv**: Support for all academic databases, journals, and dense technical documents

## 📧 Contact

- **Email**: avram@beesumbodi.com

---

*Elacity is your cognitive extension for academic research. Read papers 32x faster, intelligently.* 