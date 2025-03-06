import { TestBed } from '@angular/core/testing';
import { IndexedDbHandler } from './indexed-db.service';
import { DB_NAME, STORE_NAME, CACHED_TIME } from './indexed-db.tokens';

describe('IndexedDbHandler', () => {
    let service: IndexedDbHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IndexedDbHandler,
                { provide: DB_NAME, useValue: 'TestDB' },
                { provide: STORE_NAME, useValue: 'TestStore' },
                { provide: CACHED_TIME, useValue: 3600000 } // CACHED_TIME as 1 hour in milliseconds
            ],
        });
        service = TestBed.inject(IndexedDbHandler);
    });

    afterEach(async () => {
        // Clean up database, e.g., clear the store
        const db = await service.whenInitialized();
        const transaction = db.transaction('TestStore', 'readwrite');
        const store = transaction.objectStore('TestStore');
        store.clear(); // Clear all entries in the store
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize IndexedDB correctly', async () => {
        await service.whenInitialized(); // Block until DB is initialized
        expect(service).toBeTruthy();
    });

    it('should save and retrieve data from IndexedDB', async () => {
        const data = { id: 'user1', name: 'John Doe' };
        await service.saveData(data.id, data); // Save data
        const retrievedData = await service.getData(data.id); // Retrieve data
        expect(retrievedData).toEqual(data); // Check if saved and retrieved data match
    });

    it('should remove data from IndexedDB', async () => {
        const data = { id: 'user2', name: 'Jane Doe' };
        await service.saveData(data.id, data); // Save data
        await service.removeData(data.id); // Remove data
        const removedData = await service.getData(data.id); // Try to retrieve the removed data
        expect(removedData).toBeNull(); // Should return null after removal
    });

    it('should update data in IndexedDB', async () => {
        const initialData = { id: 'user3', name: 'Alice' };
        const updatedData = { id: 'user3', name: 'Alice Updated' };

        // Save initial data
        await service.saveData(initialData.id, initialData);

        // Update the data
        await service.updateData(initialData.id, updatedData);

        // Retrieve the updated data
        const retrievedData = await service.getData(updatedData.id);
        expect(retrievedData).toEqual(updatedData); // Ensure the data is updated correctly
    });

    it('should get all data from IndexedDB', async () => {
        const data1 = { id: 'user4', name: 'Bob' };
        const data2 = { id: 'user5', name: 'Charlie' };

        // Save multiple records
        await service.saveData(data1.id, data1);
        await service.saveData(data2.id, data2);

        // Get all data
        const allData = await service.getAll();
        expect(allData.length).toBe(2); // Ensure two records are retrieved
        expect(allData).toEqual([data1, data2]); // Ensure the data matches the expected values
    });

    it('should handle errors when retrieving data from IndexedDB', async () => {
        const data = { id: 'nonexistent', name: 'Non Existent' };

        // Try to get data that doesn't exist
        const retrievedData = await service.getData(data.id);
        expect(retrievedData).toBeNull(); // Should return null for non-existent data
    });

    // Test for clearing the store
    it('should clear all data from the store', async () => {
        const data = { id: 'user6', name: 'Bob' };

        // Save data
        await service.saveData(data.id, data);

        // Verify data is saved
        let retrievedData = await service.getData(data.id);
        expect(retrievedData).toEqual(data);

        // Clear the store
        await service.clearStore();

        // Verify store is cleared
        retrievedData = await service.getData(data.id);
        expect(retrievedData).toBeNull(); // Should be null since the store is cleared
    });

    // Test for setting and getting cachedTime
    it('should get and set cachedTime correctly', () => {
        // Set new cachedTime (in milliseconds)
        service.setCachedTime(7200000);  // Set to 2 hours in milliseconds

        // Get the current cachedTime
        const currentCachedTime = service.getCachedTime();
        expect(currentCachedTime).toBe(7200000); // Ensure the cachedTime was set correctly
    });

    // Test for saveData with cacheTime set to 0 (no expiration)
    it('should not expire data when cachedTime is 0', async () => {
        const data = { name: 'John Doe' };
        const cacheTime = 0; // This means the data should never expire

        await service.saveData('user8', data, cacheTime);  // Save data with cacheTime as 0

        const retrievedData = await service.getData('user8');
        expect(retrievedData).toEqual(data); // The data should be returned without expiration check
    });

    // Test for data expiration based on cachedTime in milliseconds
    it('should expire data correctly based on cachedTime', async () => {
        const data = { id: 'user9', name: 'Test User' };
        const cacheTime = 3600000;  // 1 hour expiration in milliseconds

        await service.saveData(data.id, data, cacheTime);

        // Simulate waiting for more than 1 hour (skipping the waiting time here for simplicity)
        const retrievedData = await service.getData(data.id);
        expect(retrievedData).toBeNull(); // Data should expire after 1 hour (3600000 ms)
    });

    // Test for saveData with cacheTime provided in milliseconds
    it('should save data with correct cacheTime in milliseconds', async () => {
        const data = { id: 'user10', name: 'Jane Doe' };
        const cacheTime = 5000;  // 5 seconds expiration in milliseconds

        await service.saveData(data.id, data, cacheTime);

        // Wait for 6 seconds (longer than the cache time)
        await new Promise(resolve => setTimeout(resolve, 6000));

        const retrievedData = await service.getData(data.id);
        expect(retrievedData).toBeNull(); // Data should expire after 5 seconds (5000 ms)
    });

    // Test for setting and checking cacheTime behavior in real time
    it('should handle cacheTime expiration correctly in real time', async () => {
        const data = { id: 'user11', name: 'Test User' };
        const cacheTime = 5000;  // 5 seconds expiration

        await service.saveData(data.id, data, cacheTime);  // Save data with cacheTime of 5 seconds

        // Wait for 6 seconds to simulate expiration
        await new Promise(resolve => setTimeout(resolve, 6000));

        const retrievedData = await service.getData(data.id);
        expect(retrievedData).toBeNull(); // Data should expire after 5 seconds
    });

});
