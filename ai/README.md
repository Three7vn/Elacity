# Elacity AI Integration

This folder contains the AI/LLM functionality for analyzing academic papers.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r ai/requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Get your OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Add it to your `.env` file

## Usage

### API Server (Recommended)

```bash
# Start the Flask API server
python ai/server.py

# Server runs on http://localhost:8000
# The browser extension automatically connects to this endpoint
```

**API Endpoints:**
- `GET /api/health` - Health check and configuration status
- `POST /api/test` - Test endpoint with mock data
- `POST /api/analyze` - Real paper analysis

**Test the API:**
```bash
# Health check
curl http://localhost:8000/api/health

# Test analysis with mock data
curl -X POST http://localhost:8000/api/test

# Real analysis (requires OpenAI API key)
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://arxiv.org/abs/1706.03762", "type": "full", "eli12": false}'
```

### Command Line Tool

```bash
# Full analysis
python ai/prompt.py "https://arxiv.org/abs/2301.00001"

# Quick summary
python ai/prompt.py "https://arxiv.org/abs/2301.00001" quick

# Explain Like I'm 12 mode
python ai/prompt.py "https://arxiv.org/abs/2301.00001" full --eli12

# Quick summary + ELI12
python ai/prompt.py "https://arxiv.org/abs/2301.00001" quick --eli12
```

### Extension Integration

The browser extension automatically calls the API server:

```javascript
// This happens automatically when you click "Start Research"
const response = await fetch('http://localhost:8000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: window.location.href,
    type: 'full',
    eli12: false
  })
});

const analysisData = await response.json();
// Data structure matches the extension UI exactly
```

## Features

- **🎯 Full Analysis**: Comprehensive breakdown with methodology, results, citations
- **⚡ Quick Summary**: 2-minute overview for busy researchers
- **🧒 ELI12 Mode**: Explains complex concepts in simple terms
- **📊 Smart Parsing**: Automatically extracts arXiv IDs and paper metadata
- **🔧 Configurable**: Adjust model, temperature, and token limits via environment variables

## Configuration

Environment variables in `.env`:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: gpt-4o-mini)
- `OPENAI_MAX_TOKENS`: Maximum response length (default: 4000)
- `OPENAI_TEMPERATURE`: Creativity level 0-1 (default: 0.3)

## Examples

### Full Analysis Output
```
## 📄 Paper Overview
- **Title**: Attention Is All You Need
- **Authors**: Vaswani et al.
- **arXiv ID**: 1706.03762

## 🎯 Key Findings
- Transformer architecture outperforms RNNs/CNNs
- Self-attention mechanism enables parallelization
- Achieves SOTA on translation tasks
...
```

### ELI12 Mode Output
```
## 🎯 Key Findings
- Imagine your brain trying to understand a sentence. Instead of reading 
  word by word like a robot, the Transformer is like a super-smart student 
  who can look at all the words at once and figure out which ones are 
  most important for understanding the whole sentence!
...
```

## How It Works

1. **Browser Extension** detects arXiv paper page
2. **User clicks "Start Research"** button
3. **Extension sends URL** to Flask API server (`http://localhost:8000/api/analyze`)
4. **API server calls OpenAI** with structured prompt
5. **OpenAI returns JSON** with scores, summary, and insights
6. **Extension displays results** in matching UI structure

```
Extension UI ←→ Flask API ←→ OpenAI API ←→ Analysis Results
```

**Data Flow:**
- **Scores**: Methodological rigor, data quality, innovation level (1-10 scale)
- **Summary**: Regular + ELI12 versions for accessibility
- **Insights**: Key findings and limitations with technical + simple explanations

The prompt is designed to return structured JSON that exactly matches what the extension UI expects, ensuring seamless integration between AI analysis and user interface. 