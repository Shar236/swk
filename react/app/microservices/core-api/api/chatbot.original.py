from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# 1. Define state
class ChatState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]


# 2. Initialize LLM with proper error handling
def initialize_llm():
    gemini_api_key = os.getenv("GOOGLE_API_KEY")
    # Priority: Env var -> Hardcoded fallback (for testing)
    if not gemini_api_key or gemini_api_key == "YOUR_GEMINI_API_KEY_HERE":
        gemini_api_key = "AIzaSyCcMuaZ2558vPeBBgsRVcDmVHIyC_hU1Pw"
    
    if not gemini_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set properly")
        
    return ChatGoogleGenerativeAI(
        model="gemini-1.0-pro",
        temperature=0.7,
        google_api_key=gemini_api_key
    )

llm = initialize_llm()

# RAHI System Prompt
RAHI_SYSTEM_PROMPT = """
You are RAHI's intelligent assistant. RAHI is an ethical platform connecting gig workers with customers.
You help users navigate the platform and answer questions about our services.

Navigation Links:
- Booking/Services: /services
- Login/Register: /login
- Tracking: /tracking
- Home: /

Key Information:
- Services: Electrician, Plumber, Carpenter, Cleaning, etc.
- Payouts: Same-day payouts for workers.
- Commission: Fair 8-12% commission.
- Mission: Worker dignity and fair work.

Guidelines:
- If a user wants to book or find a professional (like an electrician), tell them to go to the Services section (/services).
- Be helpful, concise, and professional.
- Use emojis occasionally to be friendly. 🇮🇳
"""

# 3. Chat node
def chat_node(state: ChatState):
    messages = state["messages"]
    
    # Prepend system message if it's the start
    if len(messages) == 1:
        messages = [SystemMessage(content=RAHI_SYSTEM_PROMPT)] + messages
        
    try:
        response = llm.invoke(messages)
        return {"messages": [response]}
    except Exception as e:
        # Return a helpful error message
        from langchain_core.messages import AIMessage
        error_message = AIMessage(content=f"RAHI Assistant V2 is having connectivity issues. Please visit /services for help. Error: {str(e)}")
        return {"messages": [error_message]}


# 4. Build graph
graph = StateGraph(ChatState)
graph.add_node("chat", chat_node)

graph.add_edge(START, "chat")
graph.add_edge("chat", END)

chatbot = graph.compile()


# 5. Helper function (important for API usage)
def ask_chatbot(user_input: str) -> str:
    initial_state = {
        "messages": [HumanMessage(content=user_input)]
    }
    try:
        result = chatbot.invoke(initial_state)
        # Ensure we return a string
        content = result["messages"][-1].content
        if isinstance(content, list):
            # Handle possible list-format content in some LLM types
            return " ".join([part.get('text', '') if isinstance(part, dict) else str(part) for part in content])
        return str(content)
    except Exception as e:
        return f"I'm having trouble processing your request: {str(e)}. You can try navigating to /services for bookings."
