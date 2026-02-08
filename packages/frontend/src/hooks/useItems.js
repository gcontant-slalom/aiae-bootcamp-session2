import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing items (CRUD operations)
 */
export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all items
  const fetchItems = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(queryParams);
      const response = await fetch(`/api/items?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new item
  const createItem = useCallback(async (itemData) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }

      const newItem = await response.json();
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update item
  const updateItem = useCallback(async (id, itemData) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }

      const updatedItem = await response.json();
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Toggle completion status
  const toggleComplete = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle item completion');
      }

      const updatedItem = await response.json();
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    setError,
    fetchItems,
    createItem,
    updateItem,
    toggleComplete,
    deleteItem,
  };
};
