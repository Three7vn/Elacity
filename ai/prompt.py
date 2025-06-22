#!/usr/bin/env python3
"""
Elacity Paper Analysis Prompt Generator
Generates prompts for LLM analysis of academic papers from URLs.
"""

import os
import re
import sys
import requests
import io
from urllib.parse import urlparse
from dotenv import load_dotenv
from openai import OpenAI
from PyPDF2 import PdfReader

# Load environment variables from root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def extract_arxiv_id(url):
    """Extract arXiv ID from URL."""
    patterns = [
        r'arxiv\.org/abs/(\d+\.\d+)',
        r'arxiv\.org/pdf/(\d+\.\d+)',
        r'arxiv\.org/abs/(cs/\d+)',
        r'arxiv\.org/pdf/(cs/\d+)',
        r'(\d{4}\.\d{4,5})',
        r'(cs/\d+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def fetch_arxiv_paper_text(url):
    """Fetch and extract text from arXiv paper."""
    try:
        # Convert to PDF URL if it's an abstract URL
        if '/abs/' in url:
            pdf_url = url.replace('/abs/', '/pdf/') + '.pdf'
        elif '/pdf/' in url and not url.endswith('.pdf'):
            pdf_url = url + '.pdf'
        else:
            pdf_url = url
        
        # Download the PDF
        response = requests.get(pdf_url, timeout=30)
        response.raise_for_status()
        
        # Extract text from PDF
        pdf_file = io.BytesIO(response.content)
        pdf_reader = PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        # Clean up the text
        text = re.sub(r'\s+', ' ', text)  # Replace multiple whitespace with single space
        text = text.strip()
        
        # Limit text length to avoid token limits (keep first ~15000 chars)
        if len(text) > 15000:
            text = text[:15000] + "... [truncated]"
        
        return text
        
    except Exception as e:
        print(f"Error fetching paper: {e}")
        return None



def generate_analysis_prompt(url, eli12=False):
    """Generate analysis prompt for academic paper URL that matches the extension UI structure."""
    
    arxiv_id = extract_arxiv_id(url) if 'arxiv' in url else None
    
    # Fetch the actual paper text
    paper_text = fetch_arxiv_paper_text(url) if 'arxiv' in url else None
    
    eli12_instruction = """
    
🧒 **IMPORTANT: Explain Like I'm 12 Mode**
When providing the summary and key insights, also include ELI12 versions that explain technical concepts using simple language that a 12-year-old could understand. Use analogies, everyday examples, and avoid jargon. Make it engaging and fun while still being accurate.
""" if eli12 else ""

    if paper_text:
        print(f"DEBUG: Successfully fetched paper text, length: {len(paper_text)}")
        print(f"DEBUG: First 200 chars: {paper_text[:200]}")
        arxiv_id_value = arxiv_id if arxiv_id else '[Not arXiv paper]'
        
        base_prompt = """You are Elacity, an AI research copilot that helps users read academic papers faster and more intelligently. 

Please analyze this academic paper:{eli12_instruction}

PAPER CONTENT:
{paper_text}

CRITICAL: Respond with ONLY raw JSON. Do NOT use markdown code blocks. Do NOT use ```json. Start directly with {{ and end with }}. Use this EXACT format:

{{
  "title": "[Extract exact paper title]",
  "authors": "[REQUIRED: First author's name] et al." or "[Full author list if 3 or fewer authors]",
  "arxiv_id": "{arxiv_id_value}",
  "scores": {{
    "methodological_rigor": [Score 1-10],
    "data_quality": [Score 1-10], 
    "innovation_level": [Score 1-10]
  }},
  "summary": {{
    "regular": "[2-3 paragraph summary of the paper in technical language]",
    "eli12": "[2-3 paragraph summary explaining the paper like to a 12-year-old with analogies and simple terms]"
  }},
  "key_insights": [
    {{
      "insight": "[Brief insight category like 'key_findings', 'methodology_strength', 'data_concern', 'innovation_highlight']",
      "level": "[Either 'Insight' or 'Flaw']",
      "description": "[Technical description of the insight]",
      "eli12_description": "[Simple explanation of the insight for a 12-year-old]",
      "color": "[#3b82f6 for Insight, #ef4444 for Flaw]"
    }}
  ]
}}

## SCORING GUIDELINES:

**Methodological Rigor (1-10):**
- 9-10: Rigorous experimental design, proper controls, statistical significance testing
- 7-8: Good methodology with minor limitations
- 5-6: Adequate methodology but notable weaknesses
- 1-4: Poor methodology, significant flaws

**Data Quality (1-10):**
- 9-10: Large, diverse, high-quality datasets with proper validation
- 7-8: Good data quality with some limitations
- 5-6: Adequate data but concerns about size/diversity/quality
- 1-4: Poor data quality, small samples, or questionable sources

**Innovation Level (1-10):**
- 9-10: Groundbreaking novel approach, paradigm-shifting insights
- 7-8: Significant innovation building on existing work
- 5-6: Moderate innovation, incremental improvements
- 1-4: Limited novelty, primarily reproduces existing work

## KEY INSIGHTS GUIDELINES:
- Provide 2-4 key insights
- Mix of "Insight" (positive findings) and "Flaw" (limitations/concerns)
- Each insight should be specific and actionable
- ELI12 versions should use analogies and simple language

Focus on accuracy and providing actionable insights that help researchers quickly understand the paper's value, methodology, and limitations."""
        
        prompt = base_prompt.format(eli12_instruction=eli12_instruction, paper_text=paper_text, arxiv_id_value=arxiv_id_value)
    else:
        print(f"DEBUG: Failed to fetch paper text for URL: {url}")
        arxiv_id_value = arxiv_id if arxiv_id else '[Not arXiv paper]'
        
        # Use string formatting to avoid f-string issues with nested braces
        base_prompt = """You are Elacity, an AI research copilot that helps users read academic papers faster and more intelligently. 

Please analyze the academic paper at this URL: {url}

IMPORTANT: You must analyze the ACTUAL paper at this URL. If you cannot access the URL directly, use your knowledge of the paper if you know it, but be accurate about the specific paper at this URL.{eli12_instruction}

CRITICAL: Respond with ONLY raw JSON. Do NOT use markdown code blocks. Do NOT use ```json. Start directly with {{ and end with }}. Use this EXACT format:

{{
  "title": "[Extract exact paper title]",
  "authors": "[REQUIRED: First author's name] et al." or "[Full author list if 3 or fewer authors]",
  "arxiv_id": "{arxiv_id_value}",
  "scores": {{
    "methodological_rigor": [Score 1-10],
    "data_quality": [Score 1-10], 
    "innovation_level": [Score 1-10]
  }},
  "summary": {{
    "regular": "[2-3 paragraph summary of the paper in technical language]",
    "eli12": "[2-3 paragraph summary explaining the paper like to a 12-year-old with analogies and simple terms]"
  }},
  "key_insights": [
    {{
      "insight": "[Brief insight category like 'key_findings', 'methodology_strength', 'data_concern', 'innovation_highlight']",
      "level": "[Either 'Insight' or 'Flaw']",
      "description": "[Technical description of the insight]",
      "eli12_description": "[Simple explanation of the insight for a 12-year-old]",
      "color": "[#3b82f6 for Insight, #ef4444 for Flaw]"
    }}
  ]
}}

## SCORING GUIDELINES:

**Methodological Rigor (1-10):**
- 9-10: Rigorous experimental design, proper controls, statistical significance testing
- 7-8: Good methodology with minor limitations
- 5-6: Adequate methodology but notable weaknesses
- 1-4: Poor methodology, significant flaws

**Data Quality (1-10):**
- 9-10: Large, diverse, high-quality datasets with proper validation
- 7-8: Good data quality with some limitations
- 5-6: Adequate data but concerns about size/diversity/quality
- 1-4: Poor data quality, small samples, or questionable sources

**Innovation Level (1-10):**
- 9-10: Groundbreaking novel approach, paradigm-shifting insights
- 7-8: Significant innovation building on existing work
- 5-6: Moderate innovation, incremental improvements
- 1-4: Limited novelty, primarily reproduces existing work

## KEY INSIGHTS GUIDELINES:
- Provide 2-4 key insights
- Mix of "Insight" (positive findings) and "Flaw" (limitations/concerns)
- Each insight should be specific and actionable
- ELI12 versions should use analogies and simple language

Focus on accuracy and providing actionable insights that help researchers quickly understand the paper's value, methodology, and limitations."""

        prompt = base_prompt.format(url=url, eli12_instruction=eli12_instruction, arxiv_id_value=arxiv_id_value)

    return prompt


def generate_quick_summary_prompt(url, eli12=False):
    """Generate a shorter summary prompt for quick analysis."""
    
    eli12_instruction = " Use simple language that anyone can understand - avoid technical jargon and use everyday analogies." if eli12 else ""
    
    prompt = f"""Please provide a quick 2-minute summary of the academic paper at: {url}{eli12_instruction}

Return ONLY a JSON object with this structure:

{{
  "title": "[Paper title]",
  "quick_summary": "[2-3 sentence summary of what the paper does and why it matters]",
  "main_finding": "[One key result with specific numbers/metrics if available]",
  "relevance": "[Why should researchers care about this work?]"
}}

Keep it concise but informative - perfect for busy researchers who need to quickly assess if this paper is relevant to their work."""

    return prompt


def analyze_paper_with_openai(url, analysis_type="full", eli12=False):
    """Analyze paper using OpenAI API."""
    
    try:
        # Generate appropriate prompt
        if analysis_type == "quick":
            prompt = generate_quick_summary_prompt(url, eli12)
        else:
            prompt = generate_analysis_prompt(url, eli12)
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model=os.getenv('OPENAI_MODEL', 'gpt-4o-mini'),
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are Elacity, an expert AI research copilot. CRITICAL: You MUST respond with ONLY valid JSON. NO markdown. NO code blocks. NO ```json. NO ``` at all. Just pure JSON starting with { and ending with }. The response_format is set to json_object so you MUST return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_completion_tokens=int(os.getenv('OPENAI_MAX_TOKENS', 4000))
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return f"Error analyzing paper: {str(e)}"


def main():
    """Main function for command line usage."""
    if len(sys.argv) < 2:
        print("Usage: python ai/prompt.py <paper_url> [analysis_type] [--eli12]")
        print("Analysis types: full (default), quick")
        print("Add --eli12 for Explain Like I'm 12 mode")
        return
    
    url = sys.argv[1]
    analysis_type = "full"
    eli12 = False
    
    # Parse arguments
    for arg in sys.argv[2:]:
        if arg == "--eli12":
            eli12 = True
        elif arg in ["full", "quick"]:
            analysis_type = arg
    
    # Check if we should use OpenAI API or just generate prompt
    if os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your-actual-api-key-here':
        # Use OpenAI API
        result = analyze_paper_with_openai(url, analysis_type, eli12)
        print(result)
    else:
        # Just generate prompt
        if analysis_type == "quick":
            prompt = generate_quick_summary_prompt(url, eli12)
        else:
            prompt = generate_analysis_prompt(url, eli12)
        
        print("=== GENERATED PROMPT ===")
        print(prompt)
        print("\n=== NOTE ===")
        print("Set up your .env file with OPENAI_API_KEY to get actual analysis results!")


if __name__ == "__main__":
    main()


# Example usage in your extension:
"""
// In your contentScript.js, you could call your backend:
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    url: window.location.href,
    type: 'full',
    eli12: false
  })
});

const data = await response.json();
// data will have the structure that matches showResults() and showBreakdown()

// Example response:
{
  "title": "Attention Is All You Need",
  "arxiv_id": "1706.03762",
  "scores": {
    "methodological_rigor": 9,
    "data_quality": 8,
    "innovation_level": 10
  },
  "summary": {
    "regular": "This paper introduces the Transformer...",
    "eli12": "Imagine your brain trying to understand a sentence..."
  },
  "key_insights": [
    {
      "insight": "key_findings",
      "level": "Insight", 
      "description": "Self-attention mechanism enables parallelization",
      "eli12_description": "The robot learned to look at all words at once",
      "color": "#3b82f6"
    }
  ]
}
""" 