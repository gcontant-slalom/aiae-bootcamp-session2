import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

/**
 * FilterSort component for filtering and sorting items
 */
const FilterSort = ({ filter, sort, order, search, onFilterChange, onSortChange, onSearchChange }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: '#F8F9FA',
        border: '1px solid #E8E8E8',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9E9E9E' }} />
              </InputAdornment>
            ),
          }}
          data-testid="search-input"
        />

        {/* Filter */}
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(e, newFilter) => {
            if (newFilter !== null) {
              onFilterChange(newFilter);
            }
          }}
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <ToggleButton value="all" data-testid="filter-all">
            All
          </ToggleButton>
          <ToggleButton value="incomplete" data-testid="filter-incomplete">
            Active
          </ToggleButton>
          <ToggleButton value="complete" data-testid="filter-complete">
            Completed
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Sort */}
        <FormControl size="small" sx={{ minWidth: 200, flexShrink: 0 }}>
          <InputLabel id="sort-select-label">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SortIcon fontSize="small" />
              Sort By
            </Box>
          </InputLabel>
          <Select
            labelId="sort-select-label"
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [newSort, newOrder] = e.target.value.split('-');
              onSortChange(newSort, newOrder);
            }}
            label="Sort By"
            data-testid="sort-select"
          >
            <MenuItem value="created-desc">Newest First</MenuItem>
            <MenuItem value="created-asc">Oldest First</MenuItem>
            <MenuItem value="date-asc">Due Date (Earliest)</MenuItem>
            <MenuItem value="date-desc">Due Date (Latest)</MenuItem>
            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

FilterSort.propTypes = {
  filter: PropTypes.oneOf(['all', 'complete', 'incomplete']).isRequired,
  sort: PropTypes.oneOf(['created', 'date', 'name']).isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  search: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default FilterSort;
