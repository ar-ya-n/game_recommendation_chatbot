# Game Recommendation Chatbot - API Review

## 📋 Overview

The Game Recommendation Chatbot is a full-stack JavaScript application with a React frontend (73.2% JS) and Express.js backend. The API uses a clean request-response architecture with automatic fallback mechanisms when services (Supabase, Groq) aren't configured.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19, Vite, React Router
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI Service**: Groq API (Llama-3.3-70b)
- **HTTP Client**: Native Fetch API (Axios installed but unused)

### Core Philosophy
- Graceful degradation when services unavailable
- In-memory fallbacks for testing without databases
- User context passed via `x-user-id` header
- All responses follow consistent JSON format

---

## 🔐 Authentication System

### How It Works
1. **Signup/Login**: Credentials sent to `/auth/signup` or `/auth/login`
2. **Password Security**: SHA-256 hashing (⚠️ production should use bcrypt)
3. **User Storage**: User ID stored in localStorage as `userId`
4. **Protected Routes**: All chat/profile endpoints require `x-user-id` header
5. **Fallback**: In-memory user store when Supabase unavailable

### Current Weakness
Simple header-based auth. Should use JWT tokens with expiration for production.

---

## 💬 Chat API Flow

### Message Send Process
1. Frontend sends message to `/chat/message` endpoint
2. Backend validates message (not empty)
3. Creates new conversation if needed
4. Saves user message to database
5. Retrieves conversation history (context window)
6. Fetches user profile (preferences, genres, platforms)
7. Calls Groq AI with system prompt + profile context + message history
8. Saves AI response to database
9. Returns response with conversation ID and metadata

### Response Includes
- `conversationId`: UUID or local-timestamp fallback
- `isNewConversation`: Boolean flag
- `message`: Assistant response with timestamp
- Error message if AI generation fails

### Groq AI Configuration
- Model: Llama-3.3-70b-versatile
- Temperature: 0.6 (balanced creativity)
- Top-p: 0.8 (nucleus sampling)
- Max tokens: 1000
- Context: Last ~10 messages for in-memory, full history for database

---

## 📚 Conversation Management

### Available Operations
- **Get all conversations**: `GET /chat/conversations` - Returns active conversations for user
- **Get single conversation**: `GET /chat/conversation/:id` - Returns conversation + all messages
- **Delete conversation**: `DELETE /chat/conversation/:id` - Soft deletes (marks inactive)
- **New conversation**: Automatically created on first message if no ID provided

### Data Storage
- **Database path**: Messages stored in Supabase with timestamps
- **Fallback path**: In-memory objects for development
- **Ordering**: Conversations sorted by `updated_at` (newest first)

---

## 👤 User Profiles

### Profile Data Stored
- Favorite genres (RPG, Action, Strategy, etc.)
- Preferred platforms (PC, PlayStation, Xbox, Mobile, Switch)
- Budget range (free, budget, premium, any)
- Difficulty preference (casual, normal, hard)
- Playtime availability (casual, regular, hardcore)
- Multiplayer interest (boolean)

### Profile Usage
Profile data is injected into Groq AI system prompt to personalize game recommendations based on user preferences.

### Operations
- `GET /user/profile`: Fetch user preferences
- `PUT /user/profile`: Update user preferences

---

## 🛠️ Error Handling

### Frontend Error Handling
- Try-catch blocks around all API calls
- Network errors logged to console
- User sees fallback message: "⚠️ Sorry, something went wrong. Please try again."
- Loading states properly managed (sending, loading flags)

### Backend Error Handling
- Global error handler middleware catches all exceptions
- Specific validation errors return 400 status
- Authentication failures return 401 status
- Duplicate email returns 409 status
- Unhandled errors return 500 with error message
- Development mode includes stack traces

### Validation
- Message cannot be empty
- Email and password required for auth
- User must exist in database for protected routes

---

## 📡 API Endpoints Summary

| Endpoint | Method | Protected | Purpose |
|----------|--------|-----------|---------|
| `/auth/signup` | POST | No | Register new user |
| `/auth/login` | POST | No | Authenticate user |
| `/auth/logout` | POST | Yes | End session |
| `/chat/message` | POST | Yes | Send message, get AI response |
| `/chat/conversations` | GET | Yes | List user's conversations |
| `/chat/conversation/:id` | GET | Yes | Get specific conversation |
| `/chat/conversation/:id` | DELETE | Yes | Delete conversation |
| `/user/profile` | GET | Yes | Get user preferences |
| `/user/profile` | PUT | Yes | Update user preferences |
| `/health` | GET | No | Server health check |

---

## 🔄 Response Treatment Pattern

### Standard Response Flow
1. All endpoints return JSON
2. Success responses include data object
3. Error responses include `error` field with message
4. HTTP status codes indicate outcome (200, 201, 400, 401, 409, 500)
5. Timestamps in ISO 8601 format
6. Frontend automatically parses JSON and throws on non-200 status

### Response Structure Examples
- **Success**: `{ data: {...} }` or direct object like `{ user: {...}, conversations: [...] }`
- **Error**: `{ error: "Human-readable message" }`
- **Chat response**: `{ conversationId, isNewConversation, message }`

---

## ⚙️ Service Initialization

### Startup Sequence
1. Load environment variables from .env
2. Initialize Supabase client (returns null if credentials missing)
3. Initialize Groq AI client (returns null if API key missing)
4. Start Express server on port 5001

### Graceful Degradation
- **No Supabase**: Uses in-memory object storage
- **No Groq API**: Returns mock AI responses with disclaimer
- **Missing profile**: Continues AI generation without profile context

### Environment Variables Required
- `GROQ_API_KEY`: Groq API authentication
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase public key
- `PORT`: Server port (defaults to 5001)
- `NODE_ENV`: Environment (development/production)

---

## 🌐 CORS & Connectivity

### Allowed Origins (Hardcoded)
- `http://localhost:5173` (Vite frontend)
- `http://localhost:3000` (Fallback)

### Request Flow
- Frontend uses Fetch API with relative URLs (no domain needed)
- Backend sets `Content-Type: application/json` automatically
- User ID passed in `x-user-id` header for protected routes
- Credentials allowed (cookies, auth headers)

---

## ⚠️ Known Issues & Security Concerns

### High Priority
- **Weak password hashing**: SHA-256 instead of bcrypt
- **Simple auth**: Header-based without token expiration
- **No input validation**: Missing schema validation (joi/zod)

### Medium Priority
- **No rate limiting**: Endpoints vulnerable to brute force
- **CORS hardcoded**: Development URLs only
- **No request timeout**: Long requests may hang
- **Axios unused**: Install size waste

### Low Priority
- **Soft deletes only**: Can't fully remove user data
- **No API versioning**: Harder to maintain backward compatibility
- **Limited logging**: Hard to debug in production
- **No request ID tracking**: Difficult to trace issues

---

## 🎯 How Data Flows

### Message Creation (Happy Path)
User types message → Frontend sends to `/chat/message` → Backend checks if conversation exists → Creates if new → Saves user message → Gets conversation history → Fetches user profile → Calls Groq with full context → Saves AI response → Returns to frontend → Frontend adds to message list

### Conversation Loading
User opens app → Frontend calls `/chat/conversations` → Backend fetches user's active conversations → Returns list → Frontend displays sidebar → User clicks conversation → Frontend calls `/chat/conversation/:id` → Backend returns conversation + all messages → Frontend displays chat history

---

## 📊 Response Expectations

- **Auth endpoints**: ~100-200ms
- **Chat message**: 2-10 seconds (Groq API latency)
- **Get conversations**: ~50-100ms
- **Profile operations**: ~50-100ms

---

## ✅ Strengths

- Clear frontend/backend separation
- Optimistic UI updates for better UX
- Consistent error handling
- Fallback mechanisms for development
- Profile-based AI personalization
- Protected routes with middleware
- User context injection in AI prompts

## ❌ Areas for Improvement

- Security hardening (JWT, bcrypt)
- Input validation library
- Rate limiting
- API documentation
- TypeScript support
- Comprehensive logging
- Request timeouts
- Production CORS config
