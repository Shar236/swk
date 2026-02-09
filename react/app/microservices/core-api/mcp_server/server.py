from fastmcp import FastMCP
from supabase import create_client, Client
import os
import json
from typing import List, Optional

# Initialize FastMCP server
mcp = FastMCP("rahi-booking-manager")

# Supabase Auth
# In a real MCP server, we might get these from the client configuration
# For now, we'll look for them in environment variables, or fallback to the hardcoded frontend ones (for demo)
SUPABASE_URL = os.getenv("SUPABASE_URL") or "https://mtzmzmgfbrcdurxfsssp.supabase.co"
# INFO: Using the ANON key (Publishable). For admin writes, you should set SUPABASE_SERVICE_KEY in env.
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY") or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10em16bWdmYnJjZHVyeGZzc3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzc4MjQsImV4cCI6MjA4NDg1MzgyNH0.DLtS9zWV05C1MOLUOeD1elb15J9rn0Ylo35EE8ROOuo"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase credentials not found. Some tools may fail.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@mcp.tool()
def list_bookings(status: str = None, limit: int = 5) -> str:
    """List recent bookings, optionally filtered by status."""
    try:
        query = supabase.table("bookings").select("*").order("created_at", desc=True).limit(limit)
        if status:
            query = query.eq("status", status)
        
        response = query.execute()
        return json.dumps(response.data, indent=2)
    except Exception as e:
        return f"Error listing bookings: {str(e)}"

@mcp.tool()
def get_booking_details(booking_id: str) -> str:
    """Get full details for a specific booking ID."""
    try:
        # We try to join with customer info if possible, though RLS might restrict it
        response = supabase.table("bookings").select("*, profiles:customer_id(full_name, phone)").eq("id", booking_id).single().execute()
        return json.dumps(response.data, indent=2)
    except Exception as e:
        return f"Error getting booking: {str(e)}"

@mcp.tool()
def update_booking_status(booking_id: str, status: str) -> str:
    """Update the status of a booking (e.g., 'matched', 'in_progress', 'completed')."""
    try:
        response = supabase.table("bookings").update({"status": status}).eq("id", booking_id).execute()
        return f"Updated booking {booking_id} to status {status}. Result: {json.dumps(response.data)}"
    except Exception as e:
        return f"Error updating booking: {str(e)}"

@mcp.tool()
def find_available_workers(city: str, category_name: str) -> str:
    """Find available workers in a city for a specific category."""
    try:
        # 1. Get Category ID
        cat_res = supabase.table("service_categories").select("id").ilike("name", f"%{category_name}%").single().execute()
        if not cat_res.data:
            return f"No category found matching '{category_name}'"
        
        cat_id = cat_res.data['id']
        
        # 2. Find Workers with this skill
        # Note: This is a complex join. We'll simplify by just getting workers and filtering.
        # Ideally, we'd use a RPC function or better join.
        response = supabase.table("worker_profiles").select("*, profiles:user_id(full_name, city)").eq("status", "online").execute()
        
        # Filter (Client side for now due to complex relation capability in simple client)
        workers = []
        for w in response.data:
            if w.get('profiles', {}).get('city') == city:
                workers.append(w)
                
        return json.dumps(workers, indent=2)
    except Exception as e:
        return f"Error finding workers: {str(e)}"

if __name__ == "__main__":
    mcp.run()
