export const decodeJWT = (token: string): any => {
  // Handle null/undefined tokens
  if (!token || typeof token !== 'string') {
    console.warn('Invalid token provided to decodeJWT');
    return null;
  }

  try {
    // Check if it's a mock token (doesn't have proper JWT format)
    if (token.startsWith('mock-jwt-token-')) {
      console.log('📝 Mock token detected, skipping decode');
      return { 
        mock: true, 
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expires in 24 hours
      };
    }

    // Real JWT decoding
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Token does not have 3 parts (not a valid JWT)');
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      console.warn('Token payload is empty');
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  // Handle null/undefined tokens
  if (!token) {
    return true;
  }

  // Mock tokens never expire
  if (token.startsWith('mock-jwt-token-')) {
    return false;
  }

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  return Date.now() >= decoded.exp * 1000;
};

export const getTokenFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log('📦 Getting token from storage:', token ? 'exists' : 'null');
    return token;
  }
  return null;
};

export const setTokenToStorage = (token: string): void => {
  if (typeof window !== 'undefined') {
    console.log('💾 Saving token to storage:', token);
    localStorage.setItem('token', token);
  }
};

export const removeTokenFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    console.log('🗑️ Removing token from storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};