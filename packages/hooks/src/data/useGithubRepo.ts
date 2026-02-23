'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GithubRepoData } from '@aazucena/types';

export interface UseGithubRepoOptions {
  /** Optional callback triggered when data is successfully fetched */
  onSuccess?: (data: GithubRepoData) => void;
  /** Optional callback triggered when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * A reusable hook to fetch metadata for a GitHub repository.
 * Returns the full repository data as defined by the GitHub REST API v3.
 */
export function useGithubRepo(
  owner: string,
  repo: string,
  options: UseGithubRepoOptions = {}
) {
  const [data, setData] = useState<GithubRepoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use refs for callbacks to avoid unnecessary re-renders or infinite loops
  // if the user passes inline functions as options.
  const onSuccessRef = useRef(options.onSuccess);
  const onErrorRef = useRef(options.onError);

  useEffect(() => {
    onSuccessRef.current = options.onSuccess;
    onErrorRef.current = options.onError;
  }, [options.onSuccess, options.onError]);

  const fetchData = useCallback(async () => {
    if (!owner || !repo) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      const json = (await response.json()) as GithubRepoData;
      
      setData(json);
      onSuccessRef.current?.(json);
    } catch (err: any) {
      const errorObject = err instanceof Error ? err : new Error(String(err));
      setError(errorObject);
      onErrorRef.current?.(errorObject);
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
