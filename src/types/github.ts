// src/types/github.ts

export interface Repository {
  id: number;
  name: string;
  full_name: string;
}

export interface CodeScanningAlert {
  number: number;
  created_at: string;
  state: 'open' | 'dismissed' | 'fixed';
  dismissed_at?: string;
  dismissed_reason?: string;
  rule: {
    id: string;
    severity: 'none' | 'note' | 'warning' | 'error';
    description: string;
  };
}

export type CodeScanningAlertState = 'open' | 'dismissed' | 'fixed' | null;

export interface SecretScanningAlert {
  number: number;
  created_at: string;
  state: 'open' | 'resolved';
  resolution?: 'false_positive' | 'revoked' | 'used_in_tests' | 'wont_fix';
  secret_type: string;
}

export type SecretScanningAlertState = 'open' | 'resolved';

export interface AlertsMetrics {
  totalAlerts: number;
  openAlerts: number;
  fixedAlerts: number;
  alertsBySeverity: {
    error: number;
    warning: number;
    note: number;
    none: number;
  };
  averageTimeToResolution: number; // in days
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
}

// Error types
export interface GitHubAPIError {
  name: string;
  message: string;
  status?: number;
  response?: unknown;
}