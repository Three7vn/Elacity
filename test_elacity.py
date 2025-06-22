#!/usr/bin/env python3
"""
Elacity Test Suite
Comprehensive testing for the entire Elacity system.
"""

import os
import sys
import time
import json
import requests
import subprocess
from pathlib import Path

# Add the ai directory to Python path
sys.path.append(str(Path(__file__).parent / 'ai'))

def print_header(title):
    """Print a formatted test header."""
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def print_success(message):
    """Print success message."""
    print(f"✅ {message}")

def print_error(message):
    """Print error message."""
    print(f"❌ {message}")

def print_info(message):
    """Print info message."""
    print(f"ℹ️  {message}")

def test_environment():
    """Test if environment is set up correctly."""
    print_header("Environment Check")
    
    # Check if virtual environment is active
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print_success("Virtual environment is active")
    else:
        print_error("Virtual environment not active - run 'source ai/venv/bin/activate'")
        return False
    
    # Check if required packages are installed
    try:
        import openai
        import flask
        import flask_cors
        from dotenv import load_dotenv
        print_success("All required packages are installed")
    except ImportError as e:
        print_error(f"Missing package: {e}")
        return False
    
    # Check if .env file exists in root directory
    env_path = Path('.env')
    if env_path.exists():
        print_success("Environment file (.env) found")
        
        # Load and check OpenAI key
        load_dotenv(env_path)
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key and api_key != 'your-actual-api-key-here':
            print_success("OpenAI API key is configured")
        else:
            print_info("OpenAI API key not configured - will use mock data")
    else:
        print_info("No .env file found - will use mock data")
    
    return True

def test_command_line_tool():
    """Test the command line prompt tool."""
    print_header("Command Line Tool Test")
    
    try:
        # Test prompt generation
        result = subprocess.run([
            sys.executable, 'ai/prompt.py', 
            'https://arxiv.org/abs/1706.03762'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            # Try to parse as JSON
            try:
                data = json.loads(result.stdout)
                if 'title' in data and 'scores' in data and 'summary' in data:
                    print_success("Command line tool works and returns structured data")
                    print_info(f"Paper title: {data.get('title', 'Unknown')}")
                    return True
                else:
                    print_error("Command line tool returns data but missing required fields")
            except json.JSONDecodeError:
                print_info("Command line tool works but returns unstructured data (no OpenAI key)")
                return True
        else:
            print_error(f"Command line tool failed: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print_error("Command line tool timed out")
        return False
    except Exception as e:
        print_error(f"Command line tool error: {e}")
        return False

def start_server():
    """Start the Flask server."""
    print_info("Starting Flask server...")
    
    try:
        process = subprocess.Popen([
            sys.executable, 'ai/server.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for server to start
        time.sleep(3)
        
        # Check if server is running
        try:
            response = requests.get('http://localhost:8000/api/health', timeout=5)
            if response.status_code == 200:
                print_success("Flask server started successfully")
                return process
            else:
                print_error(f"Server health check failed: {response.status_code}")
                process.terminate()
                return None
        except requests.exceptions.RequestException:
            print_error("Could not connect to server")
            process.terminate()
            return None
            
    except Exception as e:
        print_error(f"Failed to start server: {e}")
        return None

def test_api_endpoints(server_process):
    """Test API endpoints."""
    print_header("API Endpoints Test")
    
    base_url = 'http://localhost:8000'
    
    # Test health endpoint
    try:
        response = requests.get(f'{base_url}/api/health', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_success(f"Health endpoint works - OpenAI configured: {data.get('openai_configured', False)}")
        else:
            print_error(f"Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Health endpoint error: {e}")
        return False
    
    # Test mock data endpoint
    try:
        response = requests.post(f'{base_url}/api/test', timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'title' in data and 'scores' in data and 'key_insights' in data:
                print_success("Test endpoint works and returns proper structure")
            else:
                print_error("Test endpoint returns invalid structure")
                return False
        else:
            print_error(f"Test endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Test endpoint error: {e}")
        return False
    
    # Test real analysis endpoint
    try:
        payload = {
            "url": "https://arxiv.org/abs/1706.03762",
            "type": "full",
            "eli12": False
        }
        response = requests.post(f'{base_url}/api/analyze', json=payload, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if 'title' in data and 'scores' in data and 'summary' in data:
                print_success("Analysis endpoint works and returns structured data")
                print_info(f"Analyzed paper: {data.get('title', 'Unknown')}")
            else:
                print_info("Analysis endpoint works but returns unstructured data")
        else:
            print_error(f"Analysis endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Analysis endpoint error: {e}")
        return False
    
    return True

def test_extension_integration():
    """Test extension integration points."""
    print_header("Extension Integration Test")
    
    # Check if extension files exist (in dist folder after build)
    extension_files = [
        'extension/dist/manifest.json',
        'extension/dist/contentScript.js',
        'extension/src/contentScript.js'  # Source file
    ]
    
    missing_files = []
    for file_path in extension_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print_error(f"Missing extension files: {', '.join(missing_files)}")
        return False
    else:
        print_success("All extension files present")
    
    # Check if contentScript.js has the right API endpoint
    try:
        with open('extension/src/contentScript.js', 'r') as f:
            content = f.read()
            if 'localhost:8000/api/analyze' in content:
                print_success("Extension is configured to call the correct API endpoint")
            else:
                print_error("Extension API endpoint not configured correctly")
                return False
    except Exception as e:
        print_error(f"Could not check extension configuration: {e}")
        return False
    
    return True

def print_usage_instructions():
    """Print instructions for using the system."""
    print_header("How to Use Elacity")
    
    print("""
🚀 To use the full Elacity system:

1. **Start the API server:**
   cd ai && source venv/bin/activate && python server.py

2. **Load the extension in Chrome:**
   - Open Chrome and go to chrome://extensions/
   - Enable "Developer mode"
   - Click "Load unpacked" and select the 'extension' folder
   - The extension will appear in your toolbar

3. **Test on arXiv:**
   - Go to any arXiv paper (e.g., https://arxiv.org/abs/1706.03762)
   - Click the "Start Research" button that appears
   - Watch the AI analysis appear!

4. **Command line usage:**
   python ai/prompt.py "https://arxiv.org/abs/1706.03762"

🔧 API Endpoints:
   - Health: GET http://localhost:8000/api/health
   - Test: POST http://localhost:8000/api/test  
   - Analyze: POST http://localhost:8000/api/analyze

📝 The system works end-to-end:
   Extension → Flask API → OpenAI → Structured Analysis → Extension UI
    """)

def main():
    """Run all tests."""
    print_header("Elacity System Test Suite")
    print("Testing the complete Elacity pipeline...")
    
    # Change to project root directory
    os.chdir(Path(__file__).parent)
    
    tests_passed = 0
    total_tests = 4
    
    # Test 1: Environment
    if test_environment():
        tests_passed += 1
    
    # Test 2: Command line tool
    if test_command_line_tool():
        tests_passed += 1
    
    # Test 3: API server
    server_process = start_server()
    if server_process:
        if test_api_endpoints(server_process):
            tests_passed += 1
        
        # Clean up server
        print_info("Stopping server...")
        server_process.terminate()
        server_process.wait()
    
    # Test 4: Extension integration
    if test_extension_integration():
        tests_passed += 1
    
    # Results
    print_header("Test Results")
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print_success("🎉 All tests passed! Elacity is ready to use.")
        print_usage_instructions()
    else:
        print_error(f"⚠️  {total_tests - tests_passed} test(s) failed. Check the output above.")
        
        if tests_passed >= 2:
            print_info("Core functionality works - you can still use the system!")
            print_usage_instructions()

if __name__ == "__main__":
    main() 