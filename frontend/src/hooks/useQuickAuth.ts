import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface QuickAuthResult {
  token: string | null;
  fid: number | null;
  username: string | null;
  displayName: string | null;
  pfpUrl: string | null;

  location: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
  logout: () => void;
}

export function useQuickAuth(): QuickAuthResult {
  const [token, setToken] = useState<string | null>(null);
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);

  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // Check for existing session in localStorage
      const savedToken = localStorage.getItem('fc_auth_token');
      const savedFid = localStorage.getItem('fc_fid');
      const savedUsername = localStorage.getItem('fc_username');
      const savedDisplayName = localStorage.getItem('fc_display_name');
      const savedPfpUrl = localStorage.getItem('fc_pfp_url');

      const savedLocation = localStorage.getItem('fc_location');

      if (savedToken && savedFid) {
        setToken(savedToken);
        setFid(parseInt(savedFid));
        setUsername(savedUsername);
        setDisplayName(savedDisplayName);
        setPfpUrl(savedPfpUrl);

        setLocation(savedLocation);
      }

      // Also try to get context data from SDK (if in mini app)
      try {
        const context = await sdk.context;
        const user = context.user;
        if (user) {
          setFid(user.fid);
          setUsername(user.username || null);
          setDisplayName(user.displayName || null);
          setPfpUrl(user.pfpUrl || null);

          setLocation(user.location?.description || null);
        }
      } catch (err) {
        // Not in mini app context, that's okay
        console.log('Not in mini app context');
      }
    };

    initAuth();
  }, []);

  const authenticate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user data from context (user is already authenticated in mini app)
      const context = await sdk.context;
      const user = context.user;

      if (user) {
        // Store user data
        const newFid = user.fid;
        const newUsername = user.username || null;
        const newDisplayName = user.displayName || null;
        const newPfpUrl = user.pfpUrl || null;
        const newLocation = user.location?.description || null;

        setFid(newFid);
        setUsername(newUsername);
        setDisplayName(newDisplayName);
        setPfpUrl(newPfpUrl);
        setLocation(newLocation);
        setToken('authenticated');

        // Save to localStorage
        localStorage.setItem('fc_fid', newFid.toString());
        if (newUsername) localStorage.setItem('fc_username', newUsername);
        if (newDisplayName) localStorage.setItem('fc_display_name', newDisplayName);
        if (newPfpUrl) localStorage.setItem('fc_pfp_url', newPfpUrl);
        if (newLocation) localStorage.setItem('fc_location', newLocation);
        localStorage.setItem('fc_auth_token', 'authenticated');
      } else {
        setError('No user data available');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setFid(null);
    setUsername(null);
    setDisplayName(null);
    setPfpUrl(null);

    setLocation(null);
    localStorage.removeItem('fc_auth_token');
    localStorage.removeItem('fc_fid');
    localStorage.removeItem('fc_username');
    localStorage.removeItem('fc_display_name');
    localStorage.removeItem('fc_pfp_url');

    localStorage.removeItem('fc_location');
  };

  return {
    token,
    fid,
    username,
    displayName,
    pfpUrl,

    location,
    isAuthenticated: !!token || !!fid,
    isLoading,
    error,
    authenticate,
    logout,
  };
}

