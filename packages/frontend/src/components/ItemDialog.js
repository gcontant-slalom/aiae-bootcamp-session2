import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';

/**
 * ItemDialog component for creating and editing items
 */
const ItemDialog = ({ open, item = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    due_date: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        due_date: item.due_date ? new Date(item.due_date) : null,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        due_date: null,
      });
    }
    setErrors({});
  }, [item, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    } else if (formData.name.trim().length > 200) {
      newErrors.name = 'Item name must not exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const dataToSave = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      due_date: formData.due_date ? formData.due_date.toISOString() : null,
    };

    // For update, include completed status
    if (item) {
      dataToSave.completed = item.completed;
    }

    onSave(dataToSave);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>
        {item ? 'Edit Item' : 'Add New Item'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Item Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onKeyPress={handleKeyPress}
            error={!!errors.name}
            helperText={errors.name}
            required
            autoFocus
            fullWidth
            inputProps={{ maxLength: 200 }}
            data-testid="item-name-input"
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            fullWidth
            data-testid="item-description-input"
          />
          <TextField
            label="Due Date"
            type="date"
            value={formData.due_date ? formData.due_date.toISOString().split('T')[0] : ''}
            onChange={(e) => {
              const dateValue = e.target.value ? new Date(e.target.value) : null;
              handleChange('due_date', dateValue);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            data-testid="item-due-date-input"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          data-testid="cancel-button"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          data-testid="save-button"
        >
          {item ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    completed: PropTypes.number,
    due_date: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ItemDialog;
