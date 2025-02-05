import { FC } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertsMetrics } from '../../types/github';

interface AlertsBySecurityChartProps {
  metrics?: AlertsMetrics;
  isLoading?: boolean;
}

const AlertsBySecurityChart: FC<AlertsBySecurityChartProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!metrics) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  const data = [
    { name: 'Error', value: metrics.alertsBySeverity.error, color: '#d32f2f' },
    { name: 'Warning', value: metrics.alertsBySeverity.warning, color: '#ed6c02' },
    { name: 'Note', value: metrics.alertsBySeverity.note, color: '#0288d1' },
    { name: 'None', value: metrics.alertsBySeverity.none, color: '#9e9e9e' },
  ];

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Alerts by Severity
      </Typography>
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} alerts`, 'Count']}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Alerts" 
              fill="#0288d1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default AlertsBySecurityChart;