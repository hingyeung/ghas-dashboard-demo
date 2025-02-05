// src/services/github.ts

import { Octokit } from '@octokit/rest';
import type { 
  CodeScanningAlert, 
  SecretScanningAlert, 
  AlertsMetrics
} from '../types/github';

// Define the error class in the service file where it's used
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubService {
  private octokit: Octokit;
  private static instance: GitHubService;

  private constructor() {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token not found in environment variables. Create a .env file with VITE_GITHUB_TOKEN=your_token');
    }
    
    this.octokit = new Octokit({
      auth: token,
      request: {
        timeout: 10000 // 10 second timeout
      }

    });
  }

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  async getCodeScanningAlerts(owner: string, repo: string): Promise<CodeScanningAlert[]> {
    if (!owner || !repo) {
      throw new GitHubAPIError('Owner and repository names are required');
    }

    try {
      const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/code-scanning/alerts', {
        owner,
        repo,
        state: 'open',
        per_page: 100,
        sort: 'created',
        direction: 'desc'
      });
      
      return data as CodeScanningAlert[];
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 404) {
        throw new GitHubAPIError(
          'Code scanning is not enabled for this repository or you do not have access',
          status,
          error?.response
        );
      }
      throw new GitHubAPIError(
        `Failed to fetch code scanning alerts for ${owner}/${repo}: ${error.message}`,
        status,
        error?.response
      );
    }
  }

  async getSecretScanningAlerts(owner: string, repo: string): Promise<SecretScanningAlert[]> {
    if (!owner || !repo) {
      throw new GitHubAPIError('Owner and repository names are required');
    }

    try {
      const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/secret-scanning/alerts', {
        owner,
        repo,
        state: 'open', // fetch all states
        per_page: 100,
        sort: 'created',
        direction: 'desc'
      });
      
      return data as SecretScanningAlert[];
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      if (status === 404) {
        throw new GitHubAPIError(
          'Secret scanning is not enabled for this repository or you do not have access',
          status,
          error?.response
        );
      }
      throw new GitHubAPIError(
        `Failed to fetch secret scanning alerts for ${owner}/${repo}: ${error.message}`,
        status,
        error?.response
      );
    }
  }

  calculateMetrics(alerts: CodeScanningAlert[]): AlertsMetrics {
    // const now = new Date();
    
    const alertsBySeverity = {
      error: 0,
      warning: 0,
      note: 0,
      none: 0
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    alerts.forEach(alert => {
      // Count by severity
      alertsBySeverity[alert.rule.severity]++;

      // Calculate resolution time for fixed/dismissed alerts
      if (alert.state !== 'open' && alert.dismissed_at) {
        const createdDate = new Date(alert.created_at);
        const resolvedDate = new Date(alert.dismissed_at);
        const resolutionTime = Math.max(0, resolvedDate.getTime() - createdDate.getTime());
        totalResolutionTime += resolutionTime;
        resolvedCount++;
      }
    });

    const averageTimeToResolution = resolvedCount > 0
      ? (totalResolutionTime / resolvedCount) / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    return {
      totalAlerts: alerts.length,
      openAlerts: alerts.filter(a => a.state === 'open').length,
      fixedAlerts: alerts.filter(a => a.state === 'fixed').length,
      alertsBySeverity,
      averageTimeToResolution
    };
  }
}

export const githubService = GitHubService.getInstance();