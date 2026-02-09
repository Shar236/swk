# RAHI Booking Manager MCP Server

This MCP server allows AI agents (like Claude or the RAHI Assistant) to manage bookings, find workers, and check status directly from the database.

## 🛠️ Setup

1.  **Install Dependencies**:
    You need Python installed.
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    The server tries to read `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` from your environment.
    If not found, it falls back to the hardcoded public keys (which might only allow Read-Only access due to RLS).
    
    For full Admin capabilities, create a `.env` file in this folder with your service key:
    ```
    SUPABASE_SERVICE_KEY=your_secret_service_role_key
    ```

## 🚀 Running the Server

**Using Helper Script (Windows):**
Double click `start_mcp.bat` (create it if missing) or run:
```bash
python server.py
```

**Using MCP Inspector (for testing):**
```bash
npx @modelcontextprotocol/inspector python server.py
```

## 🧰 Available Tools

| Tool | Description |
| :--- | :--- |
| `list_bookings` | List recent bookings with optional filtering. |
| `get_booking_details` | Get full info including customer name for a booking. |
| `update_booking_status` | Change a booking to 'matched', 'completed', etc. |
| `find_available_workers` | Find active workers in a city for a job. |
