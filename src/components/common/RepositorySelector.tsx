import { FC } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  Box,
  Typography
} from '@mui/material';
import { Repository } from '../../types/github';

// Fixed list of repositories (should be moved to a configuration file in practice)
const AVAILABLE_REPOSITORIES: Repository[] = [
  { id: 1, name: 'ghas-demo-python', full_name: 'hingyeung/ghas-demo-python' },
  // Add more repositories as needed
];

interface RepositorySelectorProps {
  selectedRepo?: Repository;
  onSelectRepository: (repo: Repository) => void;
}

const RepositorySelector: FC<RepositorySelectorProps> = ({
  selectedRepo,
  onSelectRepository,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Repository Selection</Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="repository-select-label">Select Repository</InputLabel>
        <Select
          labelId="repository-select-label"
          id="repository-select"
          value={selectedRepo?.full_name || ''}
          label="Select Repository"
          onChange={(e) => {
            const repo = AVAILABLE_REPOSITORIES.find(r => r.full_name === e.target.value);
            if (repo) {
              onSelectRepository(repo);
            }
          }}
        >
          <MenuItem value="">
            <em>Select a repository</em>
          </MenuItem>
          {AVAILABLE_REPOSITORIES.map((repo) => (
            <MenuItem key={repo.id} value={repo.full_name}>
              {repo.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default RepositorySelector;