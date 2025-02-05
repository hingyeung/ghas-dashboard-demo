// src/views/Dashboard.tsx
import { FC, useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Alert, 
  Box,
  Grid,
  Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeScanningMetrics from '../components/metrics/CodeScanningMetrics';
import SecretScanningMetrics from '../components/metrics/SecretScanningMetrics';
import RepositorySelector from '../components/common/RepositorySelector';
import AlertsBySecurityChart from '../components/charts/AlertsBySecurityChart';
import ResolutionTrendChart from '../components/charts/ResolutionTrendChart';
import SecretsByTypeChart from '../components/charts/SecretsByTypeChart';
import { Repository } from '../types/github';
import { useGitHubApi } from '../hooks/useGitHubApi';

const Dashboard: FC = () => {
  const [selectedRepo, setSelectedRepo] = useState<Repository>();

  const { 
    codeScanningAlerts,
    secretScanningAlerts,
    metrics,
    isLoading,
    isError,
    error,
    refresh
  } = useGitHubApi({
    owner: selectedRepo?.full_name.split('/')[0] ?? '',
    repo: selectedRepo?.full_name.split('/')[1] ?? '',
    enabled: !!selectedRepo,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          GHAS Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={refresh}
          disabled={isLoading || !selectedRepo}
        >
          Refresh Data
        </Button>
      </Box>

      <RepositorySelector
        selectedRepo={selectedRepo}
        onSelectRepository={setSelectedRepo}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to fetch data'}
        </Alert>
      )}

      {!selectedRepo && !isLoading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select a repository to view security metrics
        </Alert>
      )}

      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
        Code Scanning Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CodeScanningMetrics
            metrics={metrics}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertsBySecurityChart
            metrics={metrics}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ResolutionTrendChart
            alerts={codeScanningAlerts}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Secret Scanning Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SecretScanningMetrics
            alerts={secretScanningAlerts}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SecretsByTypeChart
            alerts={secretScanningAlerts}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;