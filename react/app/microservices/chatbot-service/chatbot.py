from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
import os

# 1. Define state
class ChatState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]


# 2. Initialize LLM with proper error handling and fallback for GROQ
def initialize_llm():
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    
        # Try to get from env file
        # api 
    
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY environment variable not set properly")
        
    # Try multiple GROQ models in order of preference
    models_to_try = [
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant", 
        "llama3-groq-70b-8192-tool-use-preview", 
        "llama3-groq-8b-8192-tool-use-preview", 
        "gemma2-9b-it"
    ]
    
    for model_name in models_to_try:
        try:
            llm = ChatGroq(
                model=model_name,
                temperature=0.7,
                groq_api_key=groq_api_key,
                max_retries=2
            )
            # Test the model with a simple call to verify it works
            test_response = llm.invoke([HumanMessage(content="Test")])
            print(f"Successfully initialized with GROQ model: {model_name}")
            return llm
        except Exception as e:
            print(f"GROQ Model {model_name} not available or failed: {str(e)}")
            continue
    
    # If no GROQ models are available, create a mock/fallback LLM
    print("No GROQ models available. Creating fallback response handler.")
    
    # Create a mock-like object that behaves like an LLM for fallback
    class FallbackLLM:
        def invoke(self, messages):
            # Extract user message content
            user_message = ""
            for msg in messages:
                if hasattr(msg, 'content'):
                    user_message = str(msg.content)
                    break
            
            # Generate a helpful response based on the user's message
            if user_message.lower().startswith("hello") or user_message.lower().startswith("hi"):
                response_text = "Hello! I'm the RAHI Assistant. How can I help you find services or navigate our platform today? 🇮🇳"
            elif "plumber" in user_message.lower() or "electrician" in user_message.lower() or "carpenter" in user_message.lower():
                response_text = f"I can help you find a {user_message.lower()}! Please visit our Services page (/services) to browse professionals in your area. RAHI connects you with trusted local workers. 🛠️"
            elif "book" in user_message.lower() or "hire" in user_message.lower():
                response_text = "To book a service, please visit our Services page (/services) where you can find and hire skilled professionals like electricians, plumbers, and carpenters. Easy booking with fair prices! 💼"
            elif "track" in user_message.lower() or "status" in user_message.lower():
                response_text = "You can track your bookings and check status on the Tracking page (/tracking). Enter your booking ID to see real-time updates! 📍"
            elif "payment" in user_message.lower() or "pay" in user_message.lower():
                response_text = "RAHI ensures fair payments with transparent pricing. Workers receive same-day payouts with our low 8-12% commission. Payments are secure and timely! 💰"
            else:
                response_text = f"I understand you're asking about '{user_message}'. As RAHI Assistant, I can help you navigate our platform. Visit /services to find professionals, /tracking to monitor bookings, or /login to manage your account. How else can I assist? 🤝"
            
            # Return a mock response object with content attribute
            class MockResponse:
                def __init__(self, content):
                    self.content = content
            
            return MockResponse(response_text)
    
    return FallbackLLM()


# Initialize the LLM - this will use the first working model or fallback
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
        error_message = AIMessage(content=f"I'm having trouble processing your request right now. Please try again later. Error: {str(e)}")
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
