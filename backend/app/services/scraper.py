import trafilatura
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

def extract_text(url: str) -> str:
    """
    Extracts clean article text from a URL.
    Handles news sites via trafilatura and social media via meta-tag extraction.
    """
    # 1. Try Trafilatura (Best for news articles)
    downloaded = trafilatura.fetch_url(url)
    if downloaded:
        result = trafilatura.extract(downloaded)
        if result and len(result.strip()) > 50:
            return result

    # 2. Fallback: Manual Meta-Tag Extraction (Useful for X/Twitter, LinkedIn, etc.)
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract from common social media meta tags
            meta_title = soup.find("meta", property="og:title")
            meta_desc = soup.find("meta", property="og:description")
            
            title = meta_title["content"] if meta_title else ""
            desc = meta_desc["content"] if meta_desc else ""
            
            # For X/Twitter specifically, the description often contains the tweet text
            if title or desc:
                return f"{title}. {desc}".strip()

    except Exception as e:
        print(f"Scraper fallback error: {e}")

    # 3. Last Resort: Parse URL parts to create a context
    parsed = urlparse(url)
    domain = parsed.netloc.replace("www.", "")
    path_parts = [p for p in parsed.path.split("/") if p]
    
    if "x.com" in domain or "twitter.com" in domain:
        user = path_parts[0] if len(path_parts) > 0 else "Unknown"
        return f"Social media post by user @{user} on {domain}. Forensic analysis restricted due to platform anti-scraping measures."

    return ""
