#!/bin/bash

# Create directory structure
mkdir -p src/{components/{charts,common,metrics,layout},hooks,services,types,utils,views}
mkdir -p .github/workflows

# Create component files
cat > src/components/charts/AlertsBySecurityChart.tsx << 'EOL'
import { FC } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// @filepath: src/components/charts/AlertsBySecurityChart.tsx
const AlertsBySecurityChart: FC = () => {
  // TODO: Implement alerts by security type chart
  return <div>Alerts By Security Chart Component</div>
}

export default AlertsBySecurityChart
EOL

cat > src/components/charts/ResolutionTrendChart.tsx << 'EOL'
import { FC } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// @filepath: src/components/charts/ResolutionTrendChart.tsx
const ResolutionTrendChart: FC = () => {
  // TODO: Implement resolution trend chart
  return <div>Resolution Trend Chart Component</div>
}

export default ResolutionTrendChart
EOL

cat > src/components/common/RepositorySelector.tsx << 'EOL'
import { FC } from 'react'

// @filepath: src/components/common/RepositorySelector.tsx
const RepositorySelector: FC = () => {
  // TODO: Implement repository selector
  return <div>Repository Selector Component</div>
}

export default RepositorySelector
EOL

cat > src/components/metrics/CodeScanningMetrics.tsx << 'EOL'
import { FC } from 'react'

// @filepath: src/components/metrics/CodeScanningMetrics.tsx
const CodeScanningMetrics: FC = () => {
  // TODO: Implement code scanning metrics
  return <div>Code Scanning Metrics Component</div>
}

export default CodeScanningMetrics
EOL

# Create hooks
cat > src/hooks/useGitHubApi.ts << 'EOL'
// @filepath: src/hooks/useGitHubApi.ts
import { useQuery } from '@tanstack/react-query'
import type { GitHubApiResponse } from '../types/github'

export const useGitHubApi = (endpoint: string) => {
  // TODO: Implement GitHub API hook
  return useQuery({
    queryKey: ['github', endpoint],
    queryFn: async () => {
      // Implementation
      return {} as GitHubApiResponse
    }
  })
}
EOL

# Create services
cat > src/services/github.ts << 'EOL'
// @filepath: src/services/github.ts
import { Octokit } from '@octokit/rest'

export class GitHubService {
  private octokit: Octokit

  constructor() {
    // TODO: Initialize Octokit with auth
    this.octokit = new Octokit()
  }

  // TODO: Implement GitHub API methods
}
EOL

# Create types
cat > src/types/github.ts << 'EOL'
// @filepath: src/types/github.ts
export interface GitHubApiResponse {
  // TODO: Define GitHub API response types
}

export interface SecurityAlert {
  // TODO: Define security alert types
}
EOL

# Create views
cat > src/views/Dashboard.tsx << 'EOL'
import { FC } from 'react'
import CodeScanningMetrics from '../components/metrics/CodeScanningMetrics'
import RepositorySelector from '../components/common/RepositorySelector'

// @filepath: src/views/Dashboard.tsx
const Dashboard: FC = () => {
  return (
    <div>
      <RepositorySelector />
      <CodeScanningMetrics />
      {/* TODO: Add other metric components */}
    </div>
  )
}

export default Dashboard
EOL

# Update App.tsx
cat > src/App.tsx << 'EOL'
import { FC } from 'react'
import Dashboard from './views/Dashboard'
import './App.css'

const App: FC = () => {
  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}

export default App
EOL

# Create GitHub Actions workflow
cat > .github/workflows/ci.yml << 'EOL'
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - run: npm run lint
EOL

# Update package.json with new dependencies
npm install @octokit/rest @tanstack/react-query recharts
npm install -D @types/recharts

# Update README.md
cat > README.md << 'EOL'
# GHAS Dashboard

A dashboard for GitHub Advanced Security metrics visualization.

## Features

- Repository selection and filtering
- Code scanning metrics visualization
- Secret scanning metrics display
- Auto-fix statistics tracking

## Setup

```bash
npm install
npm run dev
```

## Technology Stack

- React with TypeScript
- Vite
- React Query
- Recharts
- Octokit
EOL

echo "Project structure created successfully!"