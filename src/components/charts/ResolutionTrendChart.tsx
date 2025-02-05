import { FC, useMemo } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CodeScanningAlert } from '../../types/github';

interface ResolutionTrendChartProps {
  alerts?: CodeScanningAlert[];
  isLoading?: boolean;
}

const ResolutionTrendChart: FC<ResolutionTrendChartProps> = ({ alerts, isLoading }) => {
  const trendData = useMemo(() => {
    if (!alerts) return [];

    // Group alerts by month and count resolutions
    const monthlyData = alerts.reduce((acc, alert) => {
      const date = new Date(alert.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, open: 0, resolved: 0 };
      }

      if (alert.state === 'open') {
        acc[monthKey].open++;
      } else {
        acc[monthKey].resolved++;
      }

      return acc;
    }, {} as Record<string, { month: string; open: number; resolved: number; }>);

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }, [alerts]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Resolution Trend
      </Typography>
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return `${month}/${year.slice(2)}`;
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                return `${month}/${year}`;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="open" 
              name="Open Alerts" 
              stroke="#d32f2f"
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              name="Resolved Alerts" 
              stroke="#2e7d32"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ResolutionTrendChart;