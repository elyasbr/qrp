// JWT helper: safe, dependency-free decoding of JWT payload and role checks
export interface JwtPayload {
  sub?: string;
  role?: string | string[];
  exp?: number;
  iat?: number;
  name?: string;
  email?: string;
  [key: string]: any;
}

function atobPolyfill(s: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(s);
  }
  // Node.js fallback (SSR)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const buf = Buffer.from(s, 'base64');
  return buf.toString('binary');
}

function base64UrlDecode(input: string): string | null {
  try {
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
      str += '='.repeat(4 - pad);
    }
    const decoded = atobPolyfill(str);
    // try to handle UTF-8
    try {
      // percent-encode bytes then decode
      return decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return decoded;
    }
  } catch {
    return null;
  }
}

export function decodeJwt<T = JwtPayload>(token?: string): T | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;
  try {
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
  // Dispatch custom event to notify axios interceptor about token update
  window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token } }));
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  // Dispatch custom event to notify axios interceptor about token removal
  window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: { token: null } }));
}

export function getAuthPayload<T = JwtPayload>(): T | null {
  const token = getToken();
  return decodeJwt<T>(token || undefined);
}

export function getRole(): string | string[] | undefined {
  const p = getAuthPayload();
  return p?.role;
}

export function hasRole(role: string): boolean {
  const r = getRole();
  if (!r) return false;
  if (Array.isArray(r)) return r.includes(role);
  return r === role;
}

export function isTokenExpired(): boolean {
  const p = getAuthPayload();
  if (!p?.exp) return true; // treat missing exp as expired
  return Date.now() / 1000 >= p.exp;
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired();
}
