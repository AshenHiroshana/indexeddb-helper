import { TestBed } from '@angular/core/testing';
import { IndexedDbHandler } from './indexed-db.service';
import { DB_NAME, STORE_NAME } from './indexed-db.tokens';


describe('IndexedDbHandler', () => {
  let service: IndexedDbHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IndexedDbHandler,
        { provide: DB_NAME, useValue: 'TestDB' },
        { provide: STORE_NAME, useValue: 'TestStore' },
      ],
    });
    service = TestBed.inject(IndexedDbHandler);

    // Replace real IndexedDB with mock implementation during tests
    // global.indexedDB = new MockIndexedDB() as any;
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

  // Add more test cases for update, getAll, and error handling
});
