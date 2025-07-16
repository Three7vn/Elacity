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
from bs4 import BeautifulSoup

# Load environment variables from root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def extract_paper_id(url):
    """Extract paper ID from various sources."""
    # arXiv patterns
    arxiv_patterns = [
        r'arxiv\.org/abs/(\d+\.\d+)',
        r'arxiv\.org/pdf/(\d+\.\d+)',
        r'arxiv\.org/abs/(cs/\d+)',
        r'arxiv\.org/pdf/(cs/\d+)',
        r'(\d{4}\.\d{4,5})',
        r'(cs/\d+)'
    ]
    
    for pattern in arxiv_patterns:
        match = re.search(pattern, url)
        if match:
            return f"arXiv:{match.group(1)}"
    
    # PhilPapers patterns
    if 'philpapers.org' in url:
        # Extract paper ID from PhilPapers URLs
        phil_patterns = [
            r'philpapers\.org/archive/([A-Z0-9]+)',
            r'philpapers\.org/rec/([A-Z0-9]+)',
            r'philpapers\.org/browse/([A-Z0-9]+)'
        ]
        for pattern in phil_patterns:
            match = re.search(pattern, url)
            if match:
                return f"PhilPapers:{match.group(1)}"
    
    # Harvard Math patterns
    if 'people.math.harvard.edu' in url:
        # Extract author/paper info from Harvard URLs
        harvard_match = re.search(r'people\.math\.harvard\.edu/~([^/]+)', url)
        if harvard_match:
            return f"Harvard:{harvard_match.group(1)}"
    
    # Personal site patterns
    if 'abrahamdada.com/essays' in url:
        # Extract essay ID from personal site
        essay_match = re.search(r'abrahamdada\.com/essays/([^/]+)', url)
        if essay_match:
            return f"Essay:{essay_match.group(1)}"
    
    return None


def fetch_arxiv_paper_text(url):
    """Fetch and extract text from arXiv paper PDF."""
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
        print(f"Error fetching arXiv paper: {e}")
        return None


def fetch_philpapers_text(url):
    """Fetch and extract text from PhilPapers page or PDF."""
    try:
        # Check if this is a PDF URL
        if url.endswith('.pdf'):
            # Handle PDF directly
            response = requests.get(url, timeout=30)
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
        
        # Handle HTML page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = ""
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Extract abstract or description
        abstract = ""
        abstract_selectors = [
            '.abstract',
            '.description',
            '.summary',
            '[class*="abstract"]',
            '[class*="description"]'
        ]
        
        for selector in abstract_selectors:
            abstract_elem = soup.select_one(selector)
            if abstract_elem:
                abstract = abstract_elem.get_text().strip()
                break
        
        # Extract main content
        content = ""
        content_selectors = [
            '.content',
            '.main-content',
            '.paper-content',
            '.entry-content',
            'main',
            'article'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                content = content_elem.get_text().strip()
                break
        
        # If no specific content found, get all paragraphs
        if not content:
            paragraphs = soup.find_all('p')
            content = '\n'.join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
        
        # Combine all text
        full_text = f"Title: {title}\n\nAbstract: {abstract}\n\nContent: {content}"
        
        # Clean up the text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = full_text.strip()
        
        # Limit text length
        if len(full_text) > 15000:
            full_text = full_text[:15000] + "... [truncated]"
        
        return full_text
        
    except Exception as e:
        print(f"Error fetching PhilPapers content: {e}")
        return None


def fetch_harvard_paper_text(url):
    """Fetch and extract text from Harvard Math department page."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # If URL is a direct PDF, extract from PDF immediately
        if url.lower().endswith('.pdf'):
            try:
                pdf_response = requests.get(url, headers=headers, timeout=30)
                pdf_response.raise_for_status()
                
                pdf_file = io.BytesIO(pdf_response.content)
                pdf_reader = PdfReader(pdf_file)
                
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text() + "\n"
                
                if pdf_text.strip():
                    # Clean up the text
                    pdf_text = re.sub(r'\s+', ' ', pdf_text)
                    pdf_text = pdf_text.strip()
                    
                    # Limit text length
                    if len(pdf_text) > 15000:
                        pdf_text = pdf_text[:15000] + "... [truncated]"
                    
                    return pdf_text
            except Exception as pdf_e:
                print(f"Error fetching PDF directly from Harvard: {pdf_e}")
                return None
        
        # Otherwise, try HTML parsing first
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = ""
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Extract paper content
        content = ""
        
        # Look for common academic page structures
        content_selectors = [
            '.paper',
            '.abstract',
            '.content',
            '.main',
            'main',
            'article',
            '.publication',
            '.research'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                content = content_elem.get_text().strip()
                break
        
        # If no specific content found, get all paragraphs
        if not content:
            paragraphs = soup.find_all('p')
            content = '\n'.join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
        
        # Look for PDF links and try to extract from PDF if HTML content is insufficient
        pdf_links = soup.find_all('a', href=re.compile(r'\.pdf$', re.I))
        if pdf_links and not content:
            pdf_url = pdf_links[0]['href']
            if not pdf_url.startswith('http'):
                pdf_url = requests.compat.urljoin(url, pdf_url)
            
            try:
                pdf_response = requests.get(pdf_url, headers=headers, timeout=30)
                pdf_response.raise_for_status()
                
                pdf_file = io.BytesIO(pdf_response.content)
                pdf_reader = PdfReader(pdf_file)
                
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text() + "\n"
                
                if pdf_text.strip():
                    content = pdf_text
            except Exception as pdf_e:
                print(f"Error fetching PDF from Harvard page: {pdf_e}")
        
        # Combine all text
        full_text = f"Title: {title}\n\nContent: {content}"
        
        # Clean up the text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = full_text.strip()
        
        # Limit text length
        if len(full_text) > 15000:
            full_text = full_text[:15000] + "... [truncated]"
        
        return full_text
        
    except Exception as e:
        print(f"Error fetching Harvard content: {e}")
        return None


def fetch_personal_essay_text(url):
    """Fetch and extract text from personal essay site."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = ""
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Extract essay content
        content = ""
        
        # Look for common blog/essay structures
        content_selectors = [
            '.essay',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.content',
            'main',
            'article',
            '.post',
            '.blog-post'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                content = content_elem.get_text().strip()
                break
        
        # If no specific content found, get all paragraphs
        if not content:
            paragraphs = soup.find_all('p')
            content = '\n'.join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
        
        # Combine all text
        full_text = f"Title: {title}\n\nContent: {content}"
        
        # Clean up the text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = full_text.strip()
        
        # Limit text length
        if len(full_text) > 15000:
            full_text = full_text[:15000] + "... [truncated]"
        
        return full_text
        
    except Exception as e:
        print(f"Error fetching personal essay: {e}")
        return None


def fetch_paper_text(url):
    """Fetch and extract text from various paper sources."""
    try:
        # Determine source type and use appropriate fetcher
        if 'arxiv.org' in url:
            return fetch_arxiv_paper_text(url)
        elif 'philpapers.org' in url:
            return fetch_philpapers_text(url)
        elif 'people.math.harvard.edu' in url:
            return fetch_harvard_paper_text(url)
        elif 'abrahamdada.com/essays' in url:
            return fetch_personal_essay_text(url)
        else:
            # Generic web page fetcher for other sources
            print(f"DEBUG: Unknown source, attempting generic web fetch for: {url}")
            return fetch_generic_web_text(url)
            
    except Exception as e:
        print(f"Error in fetch_paper_text: {e}")
        return None


def fetch_generic_web_text(url):
    """Generic web page text fetcher for unknown sources."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = ""
        title_elem = soup.find('h1') or soup.find('title')
        if title_elem:
            title = title_elem.get_text().strip()
        
        # Extract main content
        content = ""
        
        # Try common content selectors
        content_selectors = [
            'main',
            'article',
            '.content',
            '.main-content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '#main'
        ]
        
        for selector in content_selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                content = content_elem.get_text().strip()
                break
        
        # If no specific content found, get all paragraphs
        if not content:
            paragraphs = soup.find_all('p')
            content = '\n'.join([p.get_text().strip() for p in paragraphs if p.get_text().strip()])
        
        # Combine all text
        full_text = f"Title: {title}\n\nContent: {content}"
        
        # Clean up the text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = full_text.strip()
        
        # Limit text length
        if len(full_text) > 15000:
            full_text = full_text[:15000] + "... [truncated]"
        
        return full_text
        
    except Exception as e:
        print(f"Error fetching generic web content: {e}")
        return None



def generate_analysis_prompt(url, eli12=False):
    """Generate analysis prompt for academic paper URL that matches the extension UI structure."""
    
    paper_id = extract_paper_id(url)
    
    # Fetch the actual paper text from any supported source
    paper_text = fetch_paper_text(url)
    
    eli12_instruction = """
    
🧒 **IMPORTANT: Explain Like I'm 12 Mode**
When providing the summary and key insights, also include ELI12 versions that explain technical concepts using simple language that a 12-year-old could understand. Use analogies, everyday examples, and avoid jargon. Make it engaging and fun while still being accurate.
""" if eli12 else ""

    if paper_text:
        print(f"DEBUG: Successfully fetched paper text, length: {len(paper_text)}")
        print(f"DEBUG: First 200 chars: {paper_text[:200]}")
        paper_id_value = paper_id if paper_id else '[Unknown source]'
        
        base_prompt = """You are Elacity, an AI research copilot that helps users read academic papers faster and more intelligently. 

Please analyze this academic paper:{eli12_instruction}

PAPER CONTENT:
{paper_text}

CRITICAL: Respond with ONLY raw JSON. Do NOT use markdown code blocks. Do NOT use ```json. Start directly with {{ and end with }}. Use this EXACT format:

{{
  "title": "[Extract exact paper title]",
  "authors": "[REQUIRED: First author's name] et al." or "[Full author list if 3 or fewer authors]",
  "paper_id": "{paper_id_value}",
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
        
        prompt = base_prompt.format(eli12_instruction=eli12_instruction, paper_text=paper_text, paper_id_value=paper_id_value)
    else:
        print(f"DEBUG: Failed to fetch paper text for URL: {url}")
        paper_id_value = paper_id if paper_id else '[Unknown source]'
        
        # Use string formatting to avoid f-string issues with nested braces
        base_prompt = """You are Elacity, an AI research copilot that helps users read academic papers faster and more intelligently. 

Please analyze the academic paper at this URL: {url}

IMPORTANT: You must analyze the ACTUAL paper at this URL. If you cannot access the URL directly, use your knowledge of the paper if you know it, but be accurate about the specific paper at this URL.{eli12_instruction}

CRITICAL: Respond with ONLY raw JSON. Do NOT use markdown code blocks. Do NOT use ```json. Start directly with {{ and end with }}. Use this EXACT format:

{{
  "title": "[Extract exact paper title]",
  "authors": "[REQUIRED: First author's name] et al." or "[Full author list if 3 or fewer authors]",
  "paper_id": "{paper_id_value}",
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

        prompt = base_prompt.format(url=url, eli12_instruction=eli12_instruction, paper_id_value=paper_id_value)

    return prompt


def generate_quick_summary_prompt(url, eli12=False):
    """Generate a shorter summary prompt for quick analysis."""
    
    # Fetch the actual paper text from any supported source
    paper_text = fetch_paper_text(url)
    
    eli12_instruction = " Use simple language that anyone can understand - avoid technical jargon and use everyday analogies." if eli12 else ""
    
    if paper_text:
        prompt = f"""Please provide a quick 2-minute summary of this academic paper:{eli12_instruction}

PAPER CONTENT:
{paper_text}

Return ONLY a JSON object with this structure:

{{
  "title": "[Paper title]",
  "quick_summary": "[2-3 sentence summary of what the paper does and why it matters]",
  "main_finding": "[One key result with specific numbers/metrics if available]",
  "relevance": "[Why should researchers care about this work?]"
}}

Keep it concise but informative - perfect for busy researchers who need to quickly assess if this paper is relevant to their work."""
    else:
        prompt = f"""I was unable to fetch the content from {url}. Please return an error message in JSON format:

{{
  "title": "Error: Unable to fetch paper",
  "quick_summary": "Could not retrieve paper content from the provided URL",
  "main_finding": "No analysis available",
  "relevance": "Please check the URL and try again"
}}"""

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