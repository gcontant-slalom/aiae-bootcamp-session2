const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables with extended schema
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial data with extended fields
const initialItems = [
  { 
    name: 'Sample Task 1', 
    description: 'This is a sample task', 
    completed: 0,
    due_date: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  { 
    name: 'Sample Task 2', 
    description: 'Another sample task', 
    completed: 1,
    due_date: null
  },
  { 
    name: 'Sample Task 3', 
    description: 'Very important task', 
    completed: 0,
    due_date: new Date(Date.now() - 86400000).toISOString()
  }
];

const insertStmt = db.prepare(
  'INSERT INTO items (name, description, completed, due_date) VALUES (?, ?, ?, ?)'
);

initialItems.forEach(item => {
  insertStmt.run(item.name, item.description, item.completed, item.due_date);
});

console.log('In-memory database initialized with sample data');

// API Routes

// Helper function to build sort clause
function getSortClause(sort, order) {
  const validSorts = {
    date: 'due_date',
    name: 'name',
    created: 'created_at'
  };
  
  const sortField = validSorts[sort] || 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
  
  // Handle NULL values for due_date - put them last regardless of order
  if (sortField === 'due_date') {
    return `${sortField} IS NULL, ${sortField} ${sortOrder}`;
  }
  
  return `${sortField} ${sortOrder}`;
}

// Helper function to apply filters
function applyFilters(items, filter, search) {
  let filtered = items;
  
  // Apply completion filter
  if (filter === 'complete') {
    filtered = filtered.filter(item => item.completed === 1);
  } else if (filter === 'incomplete') {
    filtered = filtered.filter(item => item.completed === 0);
  }
  
  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    filtered = filtered.filter(item => {
      const nameMatch = item.name && item.name.toLowerCase().includes(searchLower);
      const descMatch = item.description && item.description.toLowerCase().includes(searchLower);
      return nameMatch || descMatch;
    });
  }
  
  return filtered;
}

// GET /api/items - Get all items with optional filtering and sorting
app.get('/api/items', (req, res) => {
  try {
    const { sort, order, filter, search } = req.query;
    
    // Build the query with sorting
    const sortClause = getSortClause(sort, order);
    const query = `SELECT * FROM items ORDER BY ${sortClause}`;
    
    let items = db.prepare(query).all();
    
    // Apply filters (done in-memory for simplicity with search)
    items = applyFilters(items, filter, search);
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get a single item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }
    
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create a new item
app.post('/api/items', (req, res) => {
  try {
    const { name, description, due_date } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    
    if (name.trim().length > 200) {
      return res.status(400).json({ error: 'Item name must not exceed 200 characters' });
    }
    
    // Validate due_date if provided
    if (due_date && due_date !== null) {
      const date = new Date(due_date);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid due date format' });
      }
    }
    
    const stmt = db.prepare(
      'INSERT INTO items (name, description, completed, due_date) VALUES (?, ?, ?, ?)'
    );
    
    const result = stmt.run(
      name.trim(),
      description || null,
      0,
      due_date || null
    );
    
    const id = result.lastInsertRowid;
    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id - Update an item
app.put('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, completed, due_date } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }
    
    // Check if item exists
    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    
    if (name.trim().length > 200) {
      return res.status(400).json({ error: 'Item name must not exceed 200 characters' });
    }
    
    // Validate due_date if provided
    if (due_date && due_date !== null) {
      const date = new Date(due_date);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid due date format' });
      }
    }
    
    // Validate completed
    const completedValue = completed === true || completed === 1 ? 1 : 0;
    
    const stmt = db.prepare(
      `UPDATE items 
       SET name = ?, description = ?, completed = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    );
    
    stmt.run(
      name.trim(),
      description || null,
      completedValue,
      due_date || null,
      id
    );
    
    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// PATCH /api/items/:id - Toggle completion status
app.patch('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }
    
    // Check if item exists
    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Toggle completion
    const newCompletedValue = existingItem.completed === 1 ? 0 : 1;
    
    const stmt = db.prepare(
      'UPDATE items SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    
    stmt.run(newCompletedValue, id);
    
    const updatedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error toggling item completion:', error);
    res.status(500).json({ error: 'Failed to toggle item completion' });
  }
});

// DELETE /api/items/:id - Delete an item
app.delete('/api/items/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db };