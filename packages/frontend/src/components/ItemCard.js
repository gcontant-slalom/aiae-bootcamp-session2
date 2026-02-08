import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Typography,
  IconButton,
  Chip,
  Box,
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  CheckCircleOutline as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { format, isPast, isWithinInterval, addDays } from 'date-fns';

/**
 * ItemCard component displays a single item with actions
 */
const ItemCard = ({ item, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = item.due_date && isPast(new Date(item.due_date)) && !item.completed;
  const isDueSoon = item.due_date && !item.completed && 
    isWithinInterval(new Date(item.due_date), {
      start: new Date(),
      end: addDays(new Date(), 1),
    });

  const getDueDateChip = () => {
    if (!item.due_date) return null;

    const dueDate = new Date(item.due_date);
    const formattedDate = format(dueDate, 'MMM d, yyyy');

    if (isOverdue) {
      return (
        <Chip
          icon={<EventNoteIcon />}
          label={`Overdue: ${formattedDate}`}
          size="small"
          sx={{
            backgroundColor: '#FFB3B3',
            color: '#6B6B6B',
            fontWeight: 500,
          }}
        />
      );
    }

    if (isDueSoon) {
      return (
        <Chip
          icon={<EventNoteIcon />}
          label={`Due Soon: ${formattedDate}`}
          size="small"
          sx={{
            backgroundColor: '#FFE5CC',
            color: '#6B6B6B',
            fontWeight: 500,
          }}
        />
      );
    }

    return (
      <Chip
        icon={<EventNoteIcon />}
        label={formattedDate}
        size="small"
        variant="outlined"
        sx={{ color: '#9E9E9E' }}
      />
    );
  };

  return (
    <Card
      sx={{
        backgroundColor: item.completed ? '#C8E6C9' : '#F8F9FA',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Checkbox
            checked={item.completed === 1}
            onChange={() => onToggleComplete(item.id)}
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            sx={{
              color: '#B4D4FF',
              '&.Mui-checked': {
                color: '#B4D4FF',
              },
              mt: -1,
            }}
            data-testid={`item-checkbox-${item.id}`}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              sx={{
                textDecoration: item.completed ? 'line-through' : 'none',
                color: item.completed ? '#9E9E9E' : '#6B6B6B',
                mb: 0.5,
              }}
            >
              {item.name}
            </Typography>
            {item.description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#9E9E9E',
                  mb: 1,
                }}
              >
                {item.description}
              </Typography>
            )}
            {getDueDateChip()}
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton
          size="small"
          onClick={() => onEdit(item)}
          aria-label="edit item"
          data-testid={`edit-item-${item.id}`}
          sx={{ color: '#B4D4FF' }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(item.id)}
          aria-label="delete item"
          data-testid={`delete-item-${item.id}`}
          sx={{ color: '#FFB3B3' }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.number.isRequired,
    due_date: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ItemCard;
