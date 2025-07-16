#!/usr/bin/env python3
"""
Elacity Backend Server
Flask server that handles API requests from the browser extension.
"""

import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from prompt import analyze_paper_with_openai
from dotenv import load_dotenv

# Load environment variables from root directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))


app = Flask(__name__)
CORS(app)  # Enable CORS for browser extension requests


# Helper to strip markdown code fences
def _strip_code_fences(raw: str) -> str:
    """
    Remove ```json ... ``` or ``` ... ``` fences and leading/trailing whitespace.
    """
    match = re.match(r"```(?:json)?\s*(.*?)\s*```", raw, flags=re.DOTALL)
    return match.group(1) if match else raw.strip()

@app.route('/api/analyze', methods=['POST'])
def analyze_paper():
    """Analyze a paper from URL."""
    try:
        data = request.get_json()

        # Extract parameters
        url = data.get('url')
        analysis_type = data.get('type', 'full')
        eli12 = data.get('eli12', False)

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Analyze the paper
        result = analyze_paper_with_openai(url, analysis_type, eli12)
        
        # Debug: Print the raw result
        print(f"DEBUG: Raw OpenAI result: {repr(result)}")
        print(f"DEBUG: Result type: {type(result)}")
        print(f"DEBUG: Result length: {len(result) if result else 'None'}")

        # Check if result is empty or None
        if not result or result.strip() == "":
            print("DEBUG: Empty result from OpenAI API")
            return jsonify({
                'title': 'Analysis Error',
                'error': 'OpenAI API returned empty response',
                'raw_analysis': result
            })

        # Strip all markdown and parse JSON - BULLETPROOF approach
        clean_result = result.strip()
        
        # Remove any ```json or ``` at the start
        if clean_result.startswith('```json'):
            clean_result = clean_result[7:]  # Remove ```json
        elif clean_result.startswith('```'):
            clean_result = clean_result[3:]   # Remove ```
            
        # Remove any ``` at the end
        if clean_result.endswith('```'):
            clean_result = clean_result[:-3]  # Remove trailing ```
            
        # Strip whitespace and newlines
        clean_result = clean_result.strip()
        
        print(f"DEBUG: Clean result: {repr(clean_result)}")
        print(f"DEBUG: Clean result length: {len(clean_result)}")
        
        try:
            parsed_result = json.loads(clean_result)
            return jsonify(parsed_result)
        except json.JSONDecodeError as e:
            print(f"JSON parsing failed: {e}")
            print(f"DEBUG: Failed to parse: {repr(clean_result[:200])}")
            return jsonify({
                'title': 'Analysis Complete',
                'raw_analysis': result,
                'clean_result': clean_result,
                'error': 'Could not parse analysis as structured data'
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'openai_configured': bool(os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your-actual-api-key-here')
    })

@app.route('/api/test', methods=['POST'])
def test_analysis():
    """Test endpoint with mock data."""
    return jsonify({
        'title': 'Test Paper Analysis',
        'arxiv_id': '2023.01234',
        'scores': {
            'methodological_rigor': 8,
            'data_quality': 9,
            'innovation_level': 7
        },
        'summary': {
            'regular': 'This is a test summary of the paper with technical details about the methodology and findings.',
            'eli12': 'This is a simple explanation that a 12-year-old could understand, using analogies and simple language.'
        },
        'key_insights': [
            {
                'insight': 'key_findings',
                'level': 'Insight',
                'description': 'Novel approach shows significant improvements over baseline methods',
                'eli12_description': 'The new method works much better than old ways of doing things',
                'color': '#3b82f6'
            },
            {
                'insight': 'methodology_strength',
                'level': 'Insight',
                'description': 'Comprehensive evaluation across multiple datasets and metrics',
                'eli12_description': 'The scientists tested their idea in many different ways to make sure it works',
                'color': '#3b82f6'
            }
        ]
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting Elacity API server on port {port}")
    print(f"🔑 OpenAI API configured: {bool(os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your-actual-api-key-here')}")
    
    app.run(host='0.0.0.0', port=port, debug=debug) 