import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDbHandler } from 'indexed-db';
import {NgForOf} from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'angular-18-app';
  testResults: string[] = [];

  constructor(private indexedDbHandler: IndexedDbHandler) {}

  ngOnInit(): void {
    this.runTests();  // Call the test runner when the app initializes
  }

  async runTests() {
    await this.testSaveRetrieveData();
    await this.testDataExpiration();
    await this.testOverwritingData();
    await this.testMultipleSaves();
    await this.testCacheTimeZero();
    await this.testLargeDataHandling();
    await this.testClearStore();
    await this.testGetAndSetCacheTime();
    await this.testInvalidKey();
    await this.testConcurrentRequests();
    await this.testNullCacheTime();
  }

  // Test for saving and retrieving data
  async testSaveRetrieveData() {
    const data = { id: 'user1', name: 'John Doe' };
    await this.indexedDbHandler.saveData(data.id, data);
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (JSON.stringify(retrievedData) === JSON.stringify(data)) {
      this.testResults.push('Save and Retrieve Data Test Passed');
    } else {
      this.testResults.push('Save and Retrieve Data Test Failed');
    }
  }

  // Test for data expiration
  async testDataExpiration() {
    const data = { id: 'user2', name: 'Jane Doe' };
    const cacheTime = 1000;  // 1 second expiration time
    await this.indexedDbHandler.saveData(data.id, data, cacheTime);
    await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for expiration
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (retrievedData === null) {
      this.testResults.push('Data Expiration Test Passed');
    } else {
      this.testResults.push('Data Expiration Test Failed');
    }
  }

  // Test for overwriting data
  async testOverwritingData() {
    const initialData = { id: 'user3', name: 'Alice' };
    const updatedData = { id: 'user3', name: 'Updated Alice' };
    await this.indexedDbHandler.saveData(initialData.id, initialData, 5000);
    await this.indexedDbHandler.saveData(updatedData.id, updatedData, 5000);
    const retrievedData = await this.indexedDbHandler.getData(updatedData.id);
    if (JSON.stringify(retrievedData) === JSON.stringify(updatedData)) {
      this.testResults.push('Overwrite Data Test Passed');
    } else {
      this.testResults.push('Overwrite Data Test Failed');
    }
  }

  // Test for multiple saves with different cache times
  async testMultipleSaves() {
    const data = { id: 'user4', name: 'Bob' };
    const cacheTime = 1000;  // 1 second expiration
    await this.indexedDbHandler.saveData(data.id, data, cacheTime);
    await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for expiration
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (retrievedData === null) {
      this.testResults.push('Multiple Saves Test Passed');
    } else {
      this.testResults.push('Multiple Saves Test Failed');
    }
  }

  // Test for cacheTime set to 0 (data should never expire)
  async testCacheTimeZero() {
    const data = { id: 'user5', name: 'Charlie' };
    const cacheTime = 0;  // No expiration
    await this.indexedDbHandler.saveData(data.id, data, cacheTime);
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (JSON.stringify(retrievedData) === JSON.stringify(data)) {
      this.testResults.push('Cache Time Zero Test Passed');
    } else {
      this.testResults.push('Cache Time Zero Test Failed');
    }
  }

  // Test for handling large data
  async testLargeDataHandling() {
    const largeData = { id: 'userLarge', name: 'A'.repeat(10000) };  // Very large data
    await this.indexedDbHandler.saveData(largeData.id, largeData, 5000);
    const retrievedData = await this.indexedDbHandler.getData(largeData.id);
    if (JSON.stringify(retrievedData) === JSON.stringify(largeData)) {
      this.testResults.push('Large Data Handling Test Passed');
    } else {
      this.testResults.push('Large Data Handling Test Failed');
    }
  }

  // Test for clearing the store
  async testClearStore() {
    const data = { id: 'user6', name: 'Daisy' };
    await this.indexedDbHandler.saveData(data.id, data, 5000);
    await this.indexedDbHandler.clearStore();
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (retrievedData === null) {
      this.testResults.push('Clear Store Test Passed');
    } else {
      this.testResults.push('Clear Store Test Failed');
    }
  }

  // Test for setting and getting cachedTime
  async testGetAndSetCacheTime() {
    const initialCacheTime = this.indexedDbHandler.getCachedTime();
    this.indexedDbHandler.setCachedTime(7200000);  // Set new cache time
    const updatedCacheTime = this.indexedDbHandler.getCachedTime();
    if (updatedCacheTime === 7200000) {
      this.testResults.push('Get and Set Cache Time Test Passed');
    } else {
      this.testResults.push('Get and Set Cache Time Test Failed');
    }
  }

  // Test for invalid key retrieval
  async testInvalidKey() {
    const retrievedData = await this.indexedDbHandler.getData('invalidId');
    if (retrievedData === null) {
      this.testResults.push('Invalid Key Test Passed');
    } else {
      this.testResults.push('Invalid Key Test Failed');
    }
  }

  // Test for handling concurrent requests
  async testConcurrentRequests() {
    const data1 = { id: 'user7', name: 'David' };
    const data2 = { id: 'user8', name: 'Eve' };

    const savePromises = [
      this.indexedDbHandler.saveData(data1.id, data1, 5000),
      this.indexedDbHandler.saveData(data2.id, data2, 5000)
    ];

    await Promise.all(savePromises);
    const retrievedData1 = await this.indexedDbHandler.getData(data1.id);
    const retrievedData2 = await this.indexedDbHandler.getData(data2.id);

    if (JSON.stringify(retrievedData1) === JSON.stringify(data1) &&
      JSON.stringify(retrievedData2) === JSON.stringify(data2)) {
      this.testResults.push('Concurrent Requests Test Passed');
    } else {
      this.testResults.push('Concurrent Requests Test Failed');
    }
  }

  // Test for cacheTime null value (no expiration)
  async testNullCacheTime() {
    const data = { id: 'user9', name: 'Frank' };
    await this.indexedDbHandler.saveData(data.id, data, null); // cacheTime is null
    const retrievedData = await this.indexedDbHandler.getData(data.id);
    if (JSON.stringify(retrievedData) === JSON.stringify(data)) {
      this.testResults.push('Null Cache Time Test Passed');
    } else {
      this.testResults.push('Null Cache Time Test Failed');
    }
  }
}
