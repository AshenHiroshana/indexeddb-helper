import {Injectable, Inject} from '@angular/core';

// Injection tokens for dbName and storeName (these will be injected dynamically)
import { DB_NAME, STORE_NAME } from './indexed-db.tokens'; // Import the tokens

@Injectable({
  providedIn: 'root',
})
export class IndexedDbHandler {
  private dbName: string;
  private storeName: string;
  private dbInitialized: Promise<IDBDatabase>;

  constructor(@Inject(DB_NAME) dbName: string, @Inject(STORE_NAME) storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbInitialized = this.initDB();
  }

  // Method to block execution until DB is initialized
  public async whenInitialized(): Promise<IDBDatabase> {
    return this.dbInitialized;
  }

  // Initialize IndexedDB
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
          console.info(`Object store '${this.storeName}' created.`);
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event: Event) => {
        console.error('Error opening IndexedDB:', event);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public async saveData(key: string, value: any): Promise<void> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(value); // Save data

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(`Error saving data: ${event}`);
      };
    });
  }

  public async getData(key: string): Promise<any> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key); // Retrieve data by key

      request.onsuccess = () => {
        if (request.result === undefined) {
          resolve(null); // Return null if no data found
        } else {
          resolve(request.result); // Return the result if data is found
        }
      };

      request.onerror = (event) => {
        reject(`Error retrieving data: ${event}`);
      };
    });
  }



  // CRUD operation - Remove data
  public async removeData(key: string): Promise<void> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(key); // Delete data by key

      request.onsuccess = () => {
        resolve(); // Resolve when the data is removed
      };

      request.onerror = (event) => {
        reject(`Error removing data: ${event}`);
      };
    });
  }


  // CRUD operation - Update data
  public async updateData(key: string, value: any): Promise<void> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(value); // Save data

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject(`Error saving data: ${event}`);
      };
    });
  }

// CRUD operation - Get all data in the store
  public async getAll(): Promise<any[]> {
    await this.whenInitialized(); // Ensure DB is initialized

    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const getRequest = store.getAll(); // Get all records from the store

      // Handle success
      getRequest.onsuccess = () => {
        resolve(getRequest.result); // Resolve with the result of the request
      };

      // Handle error
      getRequest.onerror = () => {
        reject('Error retrieving all data from IndexedDB');
      };
    });
  }

}
