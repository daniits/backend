const request = require('supertest');
const app = require('../app');
const Item = require('../models/itemModel');

jest.mock('../models/itemModel');

describe('Item CRUD Operations', () => {
    // Test for Create Item
    it('should create a new item', async () => {
        const mockItem = { name: 'Test Item', price: 100, description: 'Test Description' };

        // Correctly mocking the save method
        Item.mockImplementation(() => {
            return {
                save: jest.fn().mockResolvedValue(mockItem)
            };
        });

        const res = await request(app)
            .post('/api/item')  // Ensure this route matches your actual route
            .send(mockItem)
            .expect(201);

        // Expect the response body to match the mockItem
        expect(res.body).toMatchObject(mockItem);
    });

    // Test for Get Items
    it('should get all items', async () => {
        const mockItems = [
            { name: 'Item 1', price: 50, description: 'Description 1' },
            { name: 'Item 2', price: 100, description: 'Description 2' },
        ];

        Item.find.mockResolvedValue(mockItems);

        const res = await request(app).get('/api/item').expect(200); // Fixed route

        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0]).toMatchObject({ name: 'Item 1', price: 50 });
    });

    // Test for Update Item
    it('should update an item', async () => {
        const mockItem = { name: 'Updated Item', price: 120, description: 'Updated Description' };

        Item.findByIdAndUpdate.mockResolvedValue(mockItem);

        const res = await request(app)
            .put('/api/item/6140e4c3a8f9a3f726f22e2e') // Valid MongoDB Object ID
            .send(mockItem)
            .expect(200);

        expect(res.body).toMatchObject(mockItem);
    });

    // Test for Delete Item
    it('should delete an item', async () => {
        Item.findByIdAndDelete.mockResolvedValue(true);

        const res = await request(app).delete('/api/item/6140e4c3a8f9a3f726f22e2e').expect(200); // Valid MongoDB Object ID

        expect(res.body.message).toBe('Item has been deleted');
    });

    // Edge case for Item Not Found during update or delete
    it('should return 404 if item is not found for update', async () => {
        Item.findByIdAndUpdate.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/item/6140e4c3a8f9a3f726f22e2e') // Valid MongoDB Object ID
            .send({ name: 'New Name', price: 100 })
            .expect(404);

        expect(res.body.message).toBe('Item not found');
    });
});
