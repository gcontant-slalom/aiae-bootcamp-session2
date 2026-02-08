const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createItem = async (name = 'Temp Item to Delete') => {
  const response = await request(app)
    .post('/api/items')
    .send({ name })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if items have the expected structure
      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('completed');
      expect(item).toHaveProperty('created_at');
      expect(item).toHaveProperty('updated_at');
    });

    it('should filter items by completion status - complete', async () => {
      const response = await request(app).get('/api/items?filter=complete');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(item => {
        expect(item.completed).toBe(1);
      });
    });

    it('should filter items by completion status - incomplete', async () => {
      const response = await request(app).get('/api/items?filter=incomplete');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(item => {
        expect(item.completed).toBe(0);
      });
    });

    it('should sort items by name ascending', async () => {
      const response = await request(app).get('/api/items?sort=name&order=asc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Verify items are sorted by name
      for (let i = 0; i < response.body.length - 1; i++) {
        const current = response.body[i].name.toLowerCase();
        const next = response.body[i + 1].name.toLowerCase();
        expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
      }
    });

    it('should sort items by name descending', async () => {
      const response = await request(app).get('/api/items?sort=name&order=desc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Verify items are sorted by name descending
      for (let i = 0; i < response.body.length - 1; i++) {
        const current = response.body[i].name.toLowerCase();
        const next = response.body[i + 1].name.toLowerCase();
        expect(current.localeCompare(next)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort items by created_at', async () => {
      const response = await request(app).get('/api/items?sort=created&order=desc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should sort items by due_date', async () => {
      const response = await request(app).get('/api/items?sort=date&order=asc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should search items by name', async () => {
      const response = await request(app).get('/api/items?search=Sample');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(item => {
        expect(
          item.name.toLowerCase().includes('sample') ||
          (item.description && item.description.toLowerCase().includes('sample'))
        ).toBe(true);
      });
    });

    it('should search items by description', async () => {
      const response = await request(app).get('/api/items?search=important');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(item => {
        expect(
          item.name.toLowerCase().includes('important') ||
          (item.description && item.description.toLowerCase().includes('important'))
        ).toBe(true);
      });
    });

    it('should handle combined filters and sorting', async () => {
      const response = await request(app).get('/api/items?filter=incomplete&sort=name&order=asc');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(item => {
        expect(item.completed).toBe(0);
      });
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a single item by ID', async () => {
      const allItems = await request(app).get('/api/items');
      const firstItemId = allItems.body[0].id;

      const response = await request(app).get(`/api/items/${firstItemId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstItemId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('completed');
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).get('/api/items/999999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid item ID', async () => {
      const response = await request(app).get('/api/items/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'Test Item' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body.completed).toBe(0);
    });

    it('should create a new item with description and due_date', async () => {
      const dueDate = new Date(Date.now() + 86400000).toISOString();
      const newItem = {
        name: 'Test Item with Details',
        description: 'This is a detailed test item',
        due_date: dueDate
      };
      
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.description).toBe(newItem.description);
      expect(response.body.due_date).toBe(dueDate);
      expect(response.body.completed).toBe(0);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name exceeds 200 characters', async () => {
      const longName = 'a'.repeat(201);
      const response = await request(app)
        .post('/api/items')
        .send({ name: longName })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name must not exceed 200 characters');
    });

    it('should return 400 for invalid due_date format', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test Item', due_date: 'invalid-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid due date format');
    });

    it('should accept name at exactly 200 characters', async () => {
      const exactName = 'a'.repeat(200);
      const response = await request(app)
        .post('/api/items')
        .send({ name: exactName })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(exactName);
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      const item = await createItem('Item to Update');
      
      const updatedData = {
        name: 'Updated Item Name',
        description: 'Updated description',
        completed: 1,
        due_date: new Date(Date.now() + 86400000).toISOString()
      };

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send(updatedData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(item.id);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.description).toBe(updatedData.description);
      expect(response.body.completed).toBe(1);
      expect(response.body.due_date).toBe(updatedData.due_date);
    });

    it('should update only name and keep other fields', async () => {
      const item = await createItem('Another Item');
      
      const updatedData = {
        name: 'Just Name Updated',
        description: item.description,
        completed: item.completed
      };

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send(updatedData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

    it('should return 404 when updating non-existent item', async () => {
      const response = await request(app)
        .put('/api/items/999999')
        .send({ name: 'Updated Name', completed: 0 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid item ID', async () => {
      const response = await request(app)
        .put('/api/items/invalid')
        .send({ name: 'Updated Name' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });

    it('should return 400 if name is missing', async () => {
      const item = await createItem('Item for Validation Test');

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ description: 'Only description' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const item = await createItem('Item for Empty Name Test');

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: '   ', completed: 0 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Item name is required');
    });

    it('should return 400 if name exceeds 200 characters', async () => {
      const item = await createItem('Item for Long Name Test');
      const longName = 'a'.repeat(201);

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: longName, completed: 0 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Item name must not exceed 200 characters');
    });

    it('should return 400 for invalid due_date format', async () => {
      const item = await createItem('Item for Invalid Date Test');

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: 'Valid Name', due_date: 'invalid-date', completed: 0 })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid due date format');
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('should toggle item completion from incomplete to complete', async () => {
      const item = await createItem('Item to Complete');
      expect(item.completed).toBe(0);

      const response = await request(app).patch(`/api/items/${item.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(item.id);
      expect(response.body.completed).toBe(1);
    });

    it('should toggle item completion from complete to incomplete', async () => {
      const item = await createItem('Item to Uncomplete');
      
      // First, mark it as complete
      await request(app).patch(`/api/items/${item.id}`);
      
      // Then toggle it back to incomplete
      const response = await request(app).patch(`/api/items/${item.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(item.id);
      expect(response.body.completed).toBe(0);
    });

    it('should return 404 when toggling non-existent item', async () => {
      const response = await request(app).patch('/api/items/999999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid item ID', async () => {
      const response = await request(app).patch('/api/items/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const item = await createItem('Item To Be Deleted');

      const deleteResponse = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Item deleted successfully', id: item.id });

      const deleteAgain = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteAgain.status).toBe(404);
      expect(deleteAgain.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).delete('/api/items/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/items/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });
});