// src/hooks/useGitHubApi.ts

import { useQuery } from '@tanstack/react-query';
import { githubService } from '../services/github';
import type { CodeScanningAlert, SecretScanningAlert, AlertsMetrics } from '../types/github';

interface UseGitHubApiOptions {
  owner: string;
  repo: string;
  enabled?: boolean;
}

export function useGitHubApi({ owner, repo, enabled = true }: UseGitHubApiOptions) {
  const codeScanningQuery = useQuery({
    queryKey: ['codeScanningAlerts', owner, repo],
    queryFn: () => githubService.getCodeScanningAlerts(owner, repo),
    enabled: enabled,
    staleTime: Infinity, // Never consider data stale automatically
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const secretScanningQuery = useQuery({
    queryKey: ['secretScanningAlerts', owner, repo],
    queryFn: () => githubService.getSecretScanningAlerts(owner, repo),
    enabled: enabled,
    staleTime: Infinity, // Never consider data stale automatically
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const metrics: AlertsMetrics | undefined = codeScanningQuery.data 
    ? githubService.calculateMetrics(codeScanningQuery.data)
    : undefined;

  const refresh = () => {
    codeScanningQuery.refetch();
    secretScanningQuery.refetch();
  };

  return {
    codeScanningAlerts: codeScanningQuery.data,
    secretScanningAlerts: secretScanningQuery.data,
    metrics,
    isLoading: codeScanningQuery.isLoading || secretScanningQuery.isLoading,
    isError: codeScanningQuery.isError || secretScanningQuery.isError,
    error: codeScanningQuery.error || secretScanningQuery.error,
    refresh
  };
}