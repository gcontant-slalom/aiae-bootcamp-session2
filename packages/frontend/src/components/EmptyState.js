import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { AddCircleOutline as AddIcon } from '@mui/icons-material';

/**
 * EmptyState component shown when no items are present
 */
const EmptyState = ({ onAddClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          fontSize: 80,
          color: '#E6D5F7',
          mb: 2,
        }}
      >
        📝
      </Box>
      <Typography variant="h2" sx={{ mb: 1 }}>
        No Items Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Start organizing your tasks by adding your first item!
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={onAddClick}
        data-testid="empty-add-button"
      >
        Add Your First Item
      </Button>
    </Box>
  );
};

EmptyState.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};

export default EmptyState;
