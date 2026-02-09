import os
from langchain_google_genai import ChatGoogleGenerativeAI
gemini_api_key = "AIzaSyAd5LBSi28Z4cB-4dPX_b7BbG8kf2mkJIU"
try:
    llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=gemini_api_key)
    print("Trying gemini-pro...")
    print(llm.invoke("hi").content)
except Exception as e:
    print(f"gemini-pro failed: {e}")

try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key)
    print("Trying gemini-1.5-flash...")
    print(llm.invoke("hi").content)
except Exception as e:
    print(f"gemini-1.5-flash failed: {e}")
