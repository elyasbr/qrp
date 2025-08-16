# JWT Token Management System

This document explains how the JWT token management system works in the Bimeh application.

## Overview

The system automatically handles JWT tokens for all API requests, storing them in localStorage and automatically including them in the Authorization header of all HTTP requests.

## How It Works

### 1. Token Storage
- Tokens are stored in `localStorage` under the key `authToken`
- The system uses a custom event system to notify components when tokens are updated
- All token operations go through the centralized `setToken()` and `removeToken()` functions

### 2. Automatic Header Injection
- The axios interceptor automatically adds `Authorization: Bearer {token}` to all requests
- When a token is updated, all subsequent requests automatically use the new token
- No manual token handling is required in individual API calls

### 3. Token Update Flow
```
User Login → Receive Token → Store Token → setRole() → Receive New Token → Update Token → All Future Requests Use New Token
```

## Key Components

### Auth Utilities (`src/services/api/auth.ts`)
- `setToken(token: string)`: Stores token and dispatches update event
- `getToken()`: Retrieves current token
- `removeToken()`: Removes token and dispatches removal event
- `isAuthenticated()`: Checks if user has valid token
- `isTokenExpired()`: Checks if token has expired

### API Interceptor (`src/services/api/api.ts`)
- Automatically adds Authorization header to all requests
- Handles 401 responses by clearing token and redirecting to login
- Uses TokenManager for efficient token access

### Custom Hook (`src/hooks/useAuth.ts`)
- Provides authentication state management
- Listens for token updates
- Exposes login/logout functions

### Context Provider (`src/contexts/AuthContext.tsx`)
- Global authentication state management
- Can be used throughout the application

## Usage Examples

### Basic Token Management
```typescript
import { setToken, getToken, removeToken } from '@/services/api/auth';

// Store token
setToken('your-jwt-token');

// Get token
const token = getToken();

// Remove token
removeToken();
```

### Using the Auth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isLoggedIn, userPayload, login, logout } = useAuth();
  
  const handleLogin = (token: string) => {
    login(token);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => handleLogin('token')}>Login</button>
      )}
    </div>
  );
}
```

### Using the Auth Context
```typescript
import { useAuthContext } from '@/contexts/AuthContext';

function MyComponent() {
  const { isLoggedIn, userPayload } = useAuthContext();
  
  return (
    <div>
      {isLoggedIn && <p>Welcome, {userPayload?.name}</p>}
    </div>
  );
}
```

## API Response Handling

The system automatically handles different API response formats:

```typescript
// These response formats are all supported:
{
  "statusCode": 201,
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Use the `extractToken()` utility function for consistent token extraction:

```typescript
import { extractToken } from '@/services/api/utils';

const response = await api.post('/login', credentials);
const token = extractToken(response);
if (token) {
  setToken(token);
}
```

## Security Features

1. **Automatic Token Expiration**: Checks token expiration on each request
2. **401 Handling**: Automatically redirects to login on authentication failures
3. **SSR Safe**: All functions work in both client and server environments
4. **Event-Based Updates**: Components automatically update when tokens change

## Best Practices

1. **Always use the provided functions**: Don't directly access localStorage
2. **Handle token updates**: Check for new tokens after operations like `setRole`
3. **Use the hook**: Prefer `useAuth()` over direct function calls
4. **Error handling**: Always handle authentication errors gracefully

## Troubleshooting

### Token not being sent
- Check if token is properly stored using `getToken()`
- Verify the axios interceptor is working
- Check browser console for errors

### Token not updating
- Ensure you're using `setToken()` or `login()` function
- Check if the custom event is being dispatched
- Verify the TokenManager is listening for updates

### 401 errors
- Check if token has expired
- Verify token format in localStorage
- Check if the backend expects a different header format 