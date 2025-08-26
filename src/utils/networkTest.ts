/**
 * Network Test Utility
 * Helps diagnose connectivity and configuration issues
 */

export const testNetworkConnectivity = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {} as Record<string, any>
  };

  // Test 1: Basic internet connectivity
  try {
    const startTime = Date.now();
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    const endTime = Date.now();
    
    results.tests.basicConnectivity = {
      success: response.ok,
      status: response.status,
      responseTime: endTime - startTime,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    results.tests.basicConnectivity = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Test 2: Upload provider connectivity
  try {
    const startTime = Date.now();
    const response = await fetch('https://provider.exmodules.org/api/v1/file-manager/preview/test', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    const endTime = Date.now();
    
    results.tests.uploadProviderConnectivity = {
      success: response.ok,
      status: response.status,
      responseTime: endTime - startTime,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    results.tests.uploadProviderConnectivity = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Test 3: Auth provider connectivity
  try {
    const startTime = Date.now();
    const response = await fetch('https://auth.exmodules.org/api/v1/health', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    const endTime = Date.now();
    
    results.tests.authProviderConnectivity = {
      success: response.ok,
      status: response.status,
      responseTime: endTime - startTime,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    results.tests.authProviderConnectivity = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Test 4: Local storage availability
  try {
    if (typeof window !== 'undefined') {
      const testKey = '__network_test__';
      const testValue = 'test_value';
      
      localStorage.setItem(testKey, testValue);
      const retrievedValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      results.tests.localStorage = {
        success: retrievedValue === testValue,
        available: true
      };
    } else {
      results.tests.localStorage = {
        success: false,
        available: false,
        reason: 'Not in browser environment'
      };
    }
  } catch (error) {
    results.tests.localStorage = {
      success: false,
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Test 5: Authentication token status
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const hasToken = !!token;
      
      if (hasToken) {
        // Try to decode the token to check if it's valid
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp ? Date.now() / 1000 >= payload.exp : false;
          
          results.tests.authToken = {
            success: true,
            hasToken: true,
            isExpired,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiration',
            payload: {
              sub: payload.sub,
              role: payload.role,
              exp: payload.exp,
              iat: payload.iat
            }
          };
        } catch (decodeError) {
          results.tests.authToken = {
            success: false,
            hasToken: true,
            error: 'Failed to decode token',
            decodeError: decodeError instanceof Error ? decodeError.message : 'Unknown error'
          };
        }
      } else {
        results.tests.authToken = {
          success: false,
          hasToken: false,
          reason: 'No token found in localStorage'
        };
      }
    } else {
      results.tests.authToken = {
        success: false,
        available: false,
        reason: 'Not in browser environment'
      };
    }
  } catch (error) {
    results.tests.authToken = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return results;
};

export const logNetworkTestResults = (results: any) => {
  console.group('🌐 Network Connectivity Test Results');
  console.log('Timestamp:', results.timestamp);
  
  Object.entries(results.tests).forEach(([testName, testResult]) => {
    console.group(`📡 ${testName}`);
    console.log(testResult);
    console.groupEnd();
  });
  
  console.groupEnd();
  
  return results;
};
