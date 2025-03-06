import {Injectable, Inject} from '@angular/core';

// Injection tokens for dbName and storeName (these will be injected dynamically)
import {DB_NAME, STORE_NAME, CACHED_TIME} from './indexed-db.tokens';
import {DataToStore} from './indexed-db.model'; // Import the tokens

@Injectable({
  providedIn: 'root',
})
export class IndexedDbHandler {
  private dbName: string;
  private storeName: string;
  private cachedTime: number;
  private dbInitialized: Promise<IDBDatabase>;

  constructor(
    @Inject(DB_NAME) dbName: string,
    @Inject(STORE_NAME) storeName: string,
    @Inject(CACHED_TIME) cachedTime: number
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.cachedTime = cachedTime;
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
          db.createObjectStore(this.storeName, {keyPath: 'id'});
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


  public async saveData(key: string, value: any, cacheTime: number | null = null): Promise<void> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);

    // Create a new instance of the DataToStore class
    const dataToStore = new DataToStore(key, value);
    dataToStore.cachedTime = cacheTime;  // Set the cacheTime (null if not provided)
    console.log(key, cacheTime)
    return new Promise((resolve, reject) => {
      const request = store.put(dataToStore); // Save the object

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

      request.onsuccess = async () => {
        if (request.result === undefined) {
          resolve(null); // Return null if no data found
        } else {
          // Check expiration based on cachedTime or CACHED_TIME
          const cachedTime = request.result.cachedTime;
          let isExpired = false;

          if (cachedTime === null) {
            // If cachedTime is null, use the default CACHED_TIME for expiration check
            isExpired = await this.checkIfExpired(request.result.savedTime, this.cachedTime);
          } else {
            // If cachedTime exists, check against it
            isExpired = await this.checkIfExpired(request.result.savedTime, cachedTime);
          }

          if (isExpired) {
            resolve(null);  // Return null if data is expired
          } else {
            resolve(request.result.value); // Return the value if not expired
          }
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

    // Create a new instance of the DataToStore class
    const dataToStore = new DataToStore(key, value);

    return new Promise((resolve, reject) => {
      const request = store.put(dataToStore); // Save the object

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
      getRequest.onsuccess = async () => {
        const result = getRequest.result;
        if (result === undefined || result.length === 0) {
          resolve([]); // Return an empty array if no data found
        } else {
          // Filter out expired items using cachedTime or CACHED_TIME
          const filteredResults = await Promise.all(result.map(async (item) => {
            let isExpired = false;

            const cachedTime = item.cachedTime;
            if (cachedTime === null) {
              // If cachedTime is null, compare against CACHED_TIME
              isExpired = await this.checkIfExpired(item.savedTime, this.cachedTime);
            } else {
              // Compare against cachedTime
              isExpired = await this.checkIfExpired(item.savedTime, cachedTime);
            }

            return isExpired ? null : item.value; // Exclude expired items
          }));

          // Filter out null values (expired data)
          resolve(filteredResults.filter(item => item !== null));
        }
      };

      // Handle error
      getRequest.onerror = (event) => {
        reject(`Error retrieving all data from IndexedDB: ${event}`);
      };
    });
  }

  public async clearStore(): Promise<void> {
    await this.whenInitialized(); // Ensure DB is initialized
    const db = await this.whenInitialized();
    const transaction = db.transaction(this.storeName, 'readwrite'); // Open a transaction in 'readwrite' mode
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.clear(); // Clear all records in the store

      request.onsuccess = () => {
        resolve(); // Resolve if the store is cleared successfully
      };

      request.onerror = (event) => {
        reject(`Error clearing the store: ${event}`); // Reject if there's an error
      };
    });
  }


// Getter for cachedTime
  public getCachedTime(): number {
    return this.cachedTime;
  }

  // Setter for cachedTime
  public setCachedTime(newCachedTime: number): void {
    this.cachedTime = newCachedTime; // Update the cachedTime value
  }

  private async checkIfExpired(savedTime: string, comparisonTimeInMs: number): Promise<boolean> {
    if (comparisonTimeInMs === 0) {
      return false;  // If comparisonTime is 0, data never expires
    }

    const currentTime = new Date().getTime();  // Get current time in milliseconds
    const savedTimeStamp = new Date(savedTime).getTime();  // Convert savedTime to milliseconds

    const difference = currentTime - savedTimeStamp;  // Calculate time difference

    console.log('Time difference:', difference, 'Comparison time (ms):', comparisonTimeInMs);

    // Check if the time difference exceeds the comparisonTime (in milliseconds)
    return difference > comparisonTimeInMs;
  }

}
