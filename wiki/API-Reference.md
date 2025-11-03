# API Reference

Complete reference for agent communication protocols supported by Multi-Agent Tester.

## Overview

Multi-Agent Tester supports three communication protocols:
1. **Custom HTTP** - Standard REST API
2. **A2A (Agent-to-Agent)** - Inter-agent protocol
3. **MCP (Model Context Protocol)** - JSON-RPC 2.0 based

## Custom HTTP Protocol

Standard REST API with Bearer token authentication.

### Request Format

```http
POST {endpoint_url}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "message": "user message text"
}
```

### Request Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | Yes | OAuth2 access token |
| `Content-Type` | `application/json` | Yes | JSON payload |
| `Accept` | `application/json` | Recommended | Expected response type |

### Request Body

**Schema:**
```json
{
  "message": "string"
}
```

**Fields:**
- `message` (string, required): User's message text

**Example:**
```json
{
  "message": "What is the status of my payment?"
}
```

### Response Format

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "response": "agent response text"
}
```

**Schema:**
```json
{
  "response": "string"
}
```

**Fields:**
- `response` (string, required): Agent's response text

**Example:**
```json
{
  "response": "Your payment was processed successfully on January 1, 2024."
}
```

### Error Handling

**Error Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "error message",
  "code": "ERROR_CODE"
}
```

**Common Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Invalid/expired token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Endpoint not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Implementation Example

**cURL:**
```bash
curl -X POST https://api.example.com/agent/payment \
  -H "Authorization: Bearer abc123token" \
  -H "Content-Type: application/json" \
  -d '{"message": "Check payment status"}'
```

**JavaScript:**
```javascript
const response = await fetch('https://api.example.com/agent/payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Check payment status'
  })
});

const data = await response.json();
console.log(data.response);
```

**Python:**
```python
import requests

response = requests.post(
    'https://api.example.com/agent/payment',
    headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    },
    json={'message': 'Check payment status'}
)

data = response.json()
print(data['response'])
```

## A2A (Agent-to-Agent) Protocol

Specialized protocol for inter-agent communication with context and intent support.

### Request Format

```http
POST {endpoint_url}
Authorization: Bearer {access_token}
A2A-Version: 1.0
A2A-Client-ID: {client_id}
Content-Type: application/json

{
  "intent": "query",
  "context": {
    "session": "session-id",
    "user": "user-id"
  },
  "message": "user message text"
}
```

### Request Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | Yes | OAuth2 access token |
| `A2A-Version` | `1.0` | Yes | Protocol version |
| `A2A-Client-ID` | `{client_id}` | Yes | Client identifier |
| `Content-Type` | `application/json` | Yes | JSON payload |
| `Accept` | `application/json` | Recommended | Expected response |

### Request Body

**Schema:**
```json
{
  "intent": "string",
  "context": {
    "session": "string",
    "user": "string",
    "additional": "any"
  },
  "message": "string"
}
```

**Fields:**
- `intent` (string, required): Conversation intent
  - Values: `query`, `command`, `information`, `confirmation`
- `context` (object, optional): Conversation context
  - `session` (string): Session identifier
  - `user` (string): User identifier
  - Additional fields: Custom context data
- `message` (string, required): User's message

**Example:**
```json
{
  "intent": "query",
  "context": {
    "session": "sess-abc123",
    "user": "user-xyz789",
    "previous_topic": "payments",
    "transaction_id": "txn-456"
  },
  "message": "What is the status of this transaction?"
}
```

### Response Format

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
A2A-Version: 1.0

{
  "response": "agent response text",
  "context": {
    "updated_field": "value"
  },
  "metadata": {
    "confidence": 0.95,
    "source": "database"
  }
}
```

**Schema:**
```json
{
  "response": "string",
  "context": "object",
  "metadata": "object"
}
```

**Fields:**
- `response` (string, required): Agent's response
- `context` (object, optional): Updated context
- `metadata` (object, optional): Response metadata

**Example:**
```json
{
  "response": "Transaction txn-456 was completed successfully.",
  "context": {
    "transaction_status": "completed",
    "last_updated": "2024-01-01T12:00:00Z"
  },
  "metadata": {
    "confidence": 0.98,
    "source": "payment_service",
    "processing_time_ms": 150
  }
}
```

### Intent Types

| Intent | Description | Use Case |
|--------|-------------|----------|
| `query` | Information request | Status checks, inquiries |
| `command` | Action request | Execute operations |
| `information` | Provide data | Submit information |
| `confirmation` | Confirm action | Verify operations |

### Implementation Example

**cURL:**
```bash
curl -X POST https://api.example.com/a2a/agent \
  -H "Authorization: Bearer abc123token" \
  -H "A2A-Version: 1.0" \
  -H "A2A-Client-ID: client-123" \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "query",
    "context": {"session": "sess-abc"},
    "message": "Check status"
  }'
```

**JavaScript:**
```javascript
const response = await fetch('https://api.example.com/a2a/agent', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'A2A-Version': '1.0',
    'A2A-Client-ID': 'client-123',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    intent: 'query',
    context: {
      session: 'sess-abc',
      user: 'user-xyz'
    },
    message: 'Check status'
  })
});

const data = await response.json();
console.log(data.response);
```

## MCP (Model Context Protocol)

JSON-RPC 2.0 based protocol for standardized model interactions.

### Request Format

```http
POST {endpoint_url}
Authorization: Bearer {access_token}
Content-Type: application/json-rpc

{
  "jsonrpc": "2.0",
  "method": "agent.query",
  "params": {
    "message": "user message text",
    "context": {}
  },
  "id": "unique-request-id"
}
```

### Request Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | Yes | OAuth2 access token |
| `Content-Type` | `application/json-rpc` | Yes | JSON-RPC content type |
| `Accept` | `application/json-rpc` | Recommended | Expected response |

### Request Body

**Schema:**
```json
{
  "jsonrpc": "2.0",
  "method": "string",
  "params": "object",
  "id": "string|number"
}
```

**Fields:**
- `jsonrpc` (string, required): Protocol version, must be "2.0"
- `method` (string, required): Method name to invoke
- `params` (object, optional): Method parameters
- `id` (string|number, required): Request identifier

**Example:**
```json
{
  "jsonrpc": "2.0",
  "method": "agent.query",
  "params": {
    "message": "What are my recent transactions?",
    "context": {
      "user_id": "user-123",
      "limit": 10
    }
  },
  "id": "req-001"
}
```

### Supported Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `agent.query` | Send query to agent | `message`, `context` |
| `agent.context` | Set conversation context | `context` |
| `agent.reset` | Reset conversation | `session_id` |
| `agent.status` | Get agent status | None |

### Response Format

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json-rpc

{
  "jsonrpc": "2.0",
  "result": {
    "response": "agent response text",
    "metadata": {}
  },
  "id": "unique-request-id"
}
```

**Schema:**
```json
{
  "jsonrpc": "2.0",
  "result": "any",
  "id": "string|number"
}
```

**Fields:**
- `jsonrpc` (string, required): Protocol version "2.0"
- `result` (any, required): Method result
- `id` (string|number, required): Matching request ID

**Example:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "response": "Here are your recent transactions: ...",
    "metadata": {
      "count": 5,
      "total_amount": 1500.00,
      "currency": "USD"
    }
  },
  "id": "req-001"
}
```

### Error Response

**Error Format:**
```http
HTTP/1.1 200 OK
Content-Type: application/json-rpc

{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {}
  },
  "id": "unique-request-id"
}
```

**Standard Error Codes:**
- `-32700`: Parse error
- `-32600`: Invalid Request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error
- `-32000` to `-32099`: Server-defined errors

### Implementation Example

**cURL:**
```bash
curl -X POST https://api.example.com/mcp \
  -H "Authorization: Bearer abc123token" \
  -H "Content-Type: application/json-rpc" \
  -d '{
    "jsonrpc": "2.0",
    "method": "agent.query",
    "params": {"message": "Check status"},
    "id": "req-001"
  }'
```

**JavaScript:**
```javascript
const response = await fetch('https://api.example.com/mcp', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json-rpc',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'agent.query',
    params: {
      message: 'Check status',
      context: {}
    },
    id: 'req-001'
  })
});

const data = await response.json();
if (data.error) {
  console.error('Error:', data.error);
} else {
  console.log(data.result.response);
}
```

## Authentication

All protocols use OAuth2 Bearer token authentication.

### Token Acquisition

**Token Endpoint Request:**
```http
POST {token_endpoint}
Content-Type: application/x-www-form-urlencoded

grant_type=password&
client_id={client_id}&
client_secret={client_secret}&
username={username}&
password={password}
```

**Token Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_value"
}
```

### Token Usage

Include in `Authorization` header:
```http
Authorization: Bearer {access_token}
```

### Token Refresh

**Refresh Request:**
```http
POST {token_endpoint}
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id={client_id}&
client_secret={client_secret}&
refresh_token={refresh_token}
```

## Best Practices

### Security
- ✅ Always use HTTPS
- ✅ Validate tokens on server
- ✅ Implement rate limiting
- ✅ Log API access
- ✅ Use short-lived tokens

### Performance
- ✅ Keep messages concise
- ✅ Implement timeouts
- ✅ Cache responses when appropriate
- ✅ Use connection pooling
- ✅ Monitor response times

### Error Handling
- ✅ Return meaningful error messages
- ✅ Use appropriate HTTP status codes
- ✅ Include error codes for client handling
- ✅ Log errors for debugging
- ✅ Implement retry logic

### API Design
- ✅ Follow REST principles (Custom HTTP)
- ✅ Be consistent with protocols
- ✅ Version your APIs
- ✅ Document all endpoints
- ✅ Provide examples

## Testing Your API

Use Multi-Agent Tester to test your agent API:

1. Configure token endpoint
2. Configure agent endpoint
3. Select appropriate protocol
4. Send test messages
5. Verify responses
6. Check response times
7. Test error scenarios

See [[Getting Started|Getting-Started]] for setup instructions.

## Protocol Comparison

| Feature | Custom HTTP | A2A | MCP |
|---------|-------------|-----|-----|
| **Complexity** | Simple | Medium | Complex |
| **Context Support** | No | Yes | Yes |
| **Intent Routing** | No | Yes | Via methods |
| **Standards-Based** | REST | Custom | JSON-RPC 2.0 |
| **Metadata Support** | Custom | Yes | Yes |
| **Error Handling** | HTTP codes | HTTP codes | RPC errors |
| **Best For** | Simple APIs | Multi-agent | Model services |

## Additional Resources

- **[OAuth 2.0 Specification](https://oauth.net/2/)**
- **[JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)**
- **[REST API Best Practices](https://restfulapi.net/)**

## Questions?

For API-related questions:
- 📖 Review this API reference
- 🐛 [Open an issue](https://github.com/chovancova/conversation-agent-t/issues)
- 💬 Tag as "api" or "protocol"

---

**Previous**: [[Features]]  
**Next**: [[Architecture]]
