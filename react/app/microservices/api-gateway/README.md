# API Gateway

Central entry point for all client requests, routing them to appropriate microservices.

## Features
- Request routing based on path prefixes
- Load balancing
- SSL termination
- Rate limiting (to be implemented)
- Authentication (to be implemented)
- CORS handling
- Request/response logging

## Routes Mapping

| Path Prefix | Service | Port |
|-------------|---------|------|
| `/api/auth/` | Auth Service | 8001 |
| `/api/bookings/` | Booking Service | 8002 |
| `/api/payments/` | Payment Service | 8003 |
| `/api/wallet/` | Payment Service | 8003 |
| `/api/chat/` | Chatbot Service | 8004 |
| `/api/notifications/` | Notification Service | 8005 |
| `/api/thekedar/` | Thekedar Service | 8006 |
| `/api/analytics/` | Analytics Service | 8007 |

## Development

```bash
docker build -t rahi-api-gateway .
docker run -p 80:80 rahi-api-gateway
```
