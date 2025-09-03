import React from 'react';
import { Box, Typography, Link, Paper } from '@mui/material';
import PrintButton from './PrintButton';

interface BottomBarProps {
  selectedTraditions?: string[];
}

const BottomBar: React.FC<BottomBarProps> = ({ selectedTraditions = [] }) => {
  return (
    <Paper 
      component="footer"
      elevation={3}
      sx={{ 
        mt: 4, 
        p: 2,
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PrintButton selectedTraditions={selectedTraditions} />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Copyright © 2025{' '}
          <Link 
            href="https://sum1solutions.com" 
            target="_blank" 
            rel="noopener noreferrer"
            color="primary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Sum1Solutions, LLC
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default BottomBar;