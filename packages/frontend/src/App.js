import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Fab,
  Box,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import theme from './theme';
import { useItems } from './hooks/useItems';
import { useDebounce } from './hooks/useDebounce';
import ItemCard from './components/ItemCard';
import ItemDialog from './components/ItemDialog';
import ConfirmDialog from './components/ConfirmDialog';
import FilterSort from './components/FilterSort';
import EmptyState from './components/EmptyState';

function App() {
  const {
    items,
    loading,
    error,
    setError,
    fetchItems,
    createItem,
    updateItem,
    toggleComplete,
    deleteItem,
  } = useItems();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter and sort states
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created');
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');

  // Success message
  const [successMessage, setSuccessMessage] = useState('');

  // Debounce search for API calls
  const debouncedSearch = useDebounce(search, 300);

  // Fetch items when filters change
  useEffect(() => {
    const queryParams = {
      filter,
      sort,
      order,
    };

    if (debouncedSearch) {
      queryParams.search = debouncedSearch;
    }

    fetchItems(queryParams);
  }, [filter, sort, order, debouncedSearch, fetchItems]);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedFilter = localStorage.getItem('itemFilter');
    const savedSort = localStorage.getItem('itemSort');
    const savedOrder = localStorage.getItem('itemOrder');

    if (savedFilter) setFilter(savedFilter);
    if (savedSort) setSort(savedSort);
    if (savedOrder) setOrder(savedOrder);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('itemFilter', filter);
    localStorage.setItem('itemSort', sort);
    localStorage.setItem('itemOrder', order);
  }, [filter, sort, order]);

  const handleOpenDialog = (item = null) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemData);
        setSuccessMessage('Item updated successfully');
      } else {
        await createItem(itemData);
        setSuccessMessage('Item added successfully');
      }
      handleCloseDialog();
    } catch (err) {
      // Error is already set in the hook
      console.error('Error saving item:', err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await toggleComplete(id);
    } catch (err) {
      console.error('Error toggling item:', err);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(itemToDelete);
      setSuccessMessage('Item deleted successfully');
      setConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSortChange = (newSort, newOrder) => {
    setSort(newSort);
    setOrder(newOrder);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h1" component="h1" sx={{ fontSize: 24 }}>
              📝 TODO App
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Filter and Sort Controls */}
          <FilterSort
            filter={filter}
            sort={sort}
            order={order}
            search={search}
            onFilterChange={setFilter}
            onSortChange={handleSortChange}
            onSearchChange={setSearch}
          />

          {/* Items List or Loading/Empty State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <EmptyState onAddClick={() => handleOpenDialog()} />
          ) : (
            <Stack spacing={2}>
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenDialog}
                  onDelete={handleDeleteClick}
                />
              ))}
            </Stack>
          )}
        </Container>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add item"
          onClick={() => handleOpenDialog()}
          data-testid="add-item-fab"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
          }}
        >
          <AddIcon />
        </Fab>

        {/* Item Dialog */}
        <ItemDialog
          open={dialogOpen}
          item={editingItem}
          onClose={handleCloseDialog}
          onSave={handleSaveItem}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={confirmDialogOpen}
          title="Delete Item?"
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setSuccessMessage('')}
            severity="success"
            variant="filled"
            sx={{ backgroundColor: '#C8E6C9', color: '#6B6B6B' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            variant="filled"
            sx={{ backgroundColor: '#FFB3B3', color: '#6B6B6B' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;