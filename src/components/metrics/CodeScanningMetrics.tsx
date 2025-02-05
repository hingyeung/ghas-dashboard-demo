import { FC } from 'react';
import { Paper, Grid, Typography, Skeleton, Box } from '@mui/material';
import { AlertsMetrics } from '../../types/github';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  isLoading?: boolean;
}

const MetricCard: FC<MetricCardProps> = ({ title, value, description, isLoading }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    {isLoading ? (
      <>
        <Skeleton width="60%" />
        <Skeleton width="40%" height={40} />
        {description && <Skeleton width="80%" />}
      </>
    ) : (
      <>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </>
    )}
  </Paper>
);

interface CodeScanningMetricsProps {
  metrics?: AlertsMetrics;
  isLoading?: boolean;
}

const CodeScanningMetrics: FC<CodeScanningMetricsProps> = ({ metrics, isLoading }) => {
  if (!metrics && !isLoading) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography color="text.secondary" align="center">
          No metrics available
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Alerts"
          value={metrics?.totalAlerts || 0}
          description="Total number of security alerts"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Open Alerts"
          value={metrics?.openAlerts || 0}
          description="Currently open security alerts"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Fixed Alerts"
          value={metrics?.fixedAlerts || 0}
          description="Successfully resolved alerts"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg. Resolution Time"
          value={`${metrics?.averageTimeToResolution.toFixed(1) || 0} days`}
          description="Average time to fix alerts"
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
};

export default CodeScanningMetrics;