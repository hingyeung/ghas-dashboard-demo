// src/components/metrics/SecretScanningMetrics.tsx
import { FC } from 'react';
import { Paper, Grid, Typography, Skeleton } from '@mui/material';
import { SecretScanningAlert } from '../../types/github';

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

interface SecretScanningMetricsProps {
  alerts?: SecretScanningAlert[];
  isLoading?: boolean;
}

const SecretScanningMetrics: FC<SecretScanningMetricsProps> = ({ alerts = [], isLoading }) => {
  // Calculate metrics
  const totalAlerts = alerts.length;
  const openAlerts = alerts.filter(alert => alert.state === 'open').length;
  const resolvedAlerts = alerts.filter(alert => alert.state === 'resolved').length;
  const uniqueSecretTypes = new Set(alerts.map(alert => alert.secret_type)).size;

  if (!alerts.length && !isLoading) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography color="text.secondary" align="center">
          No secret scanning alerts available
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Secrets Found"
          value={totalAlerts}
          description="Total number of exposed secrets detected"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Open Alerts"
          value={openAlerts}
          description="Secrets requiring immediate attention"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Resolved Alerts"
          value={resolvedAlerts}
          description="Successfully resolved secret alerts"
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Secret Types"
          value={uniqueSecretTypes}
          description="Different types of secrets detected"
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
};

export default SecretScanningMetrics;