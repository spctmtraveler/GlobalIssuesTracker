import { useState, useEffect } from "react";

// Simple data caching hook to store API responses in session
export function useDataCache<T>(key: string, fetcher: () => Promise<T>, expiration: number = 3600000) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to load data, using cache if available
  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check session storage for cached data
      const cachedData = sessionStorage.getItem(key);
      
      if (cachedData && !forceRefresh) {
        const { value, timestamp } = JSON.parse(cachedData);
        
        // Check if cache is still valid
        if (Date.now() - timestamp < expiration) {
          setData(value);
          setIsLoading(false);
          return value;
        }
      }
      
      // Cache miss or forced refresh, fetch new data
      const freshData = await fetcher();
      
      // Cache the result
      sessionStorage.setItem(
        key,
        JSON.stringify({
          value: freshData,
          timestamp: Date.now()
        })
      );
      
      setData(freshData);
      return freshData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, [key]);
  
  return {
    data,
    isLoading,
    error,
    refresh: () => loadData(true)
  };
}
