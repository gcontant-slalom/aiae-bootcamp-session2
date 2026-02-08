import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { 
          id: 1, 
          name: 'Test Item 1', 
          description: 'Test description',
          completed: 0,
          due_date: null,
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z'
        },
        { 
          id: 2, 
          name: 'Test Item 2',
          description: '',
          completed: 1,
          due_date: null,
          created_at: '2023-01-02T00:00:00.000Z',
          updated_at: '2023-01-02T00:00:00.000Z'
        },
      ])
    );
  }),
  
  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Item name is required' })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        description: '',
        completed: 0,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    );
  }),

  // PATCH /api/items/:id handler
  rest.patch('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        name: 'Test Item',
        description: '',
        completed: 1,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    );
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the main app structure', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check for app title
    expect(screen.getByText(/TODO App/i)).toBeInTheDocument();
    
    // Check for filter buttons
    expect(screen.getByTestId('filter-all')).toBeInTheDocument();
    expect(screen.getByTestId('filter-incomplete')).toBeInTheDocument();
    expect(screen.getByTestId('filter-complete')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('opens add item dialog when FAB is clicked', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Test Item 1')).toBeInTheDocument();
    });
    
    // Click the floating action button
    const fab = screen.getByTestId('add-item-fab');
    await act(async () => {
      await user.click(fab);
    });
    
    // Check that dialog opens
    await waitFor(() => {
      expect(screen.getByText('Add New Item')).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No Items Yet')).toBeInTheDocument();
    });
  });
});