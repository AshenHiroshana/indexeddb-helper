
# Angular IndexedDB Helper

## Overview

**Angular IndexedDB Helper** is an Angular library designed to simplify interaction with the **IndexedDB** API in Angular applications. It allows you to store and manage data in the browser's **client-side storage**, providing easy-to-use methods for CRUD operations while supporting cache expiration based on time.

The library is designed to handle various scenarios like:
- Saving data to IndexedDB
- Retrieving data
- Checking data expiration based on cache time
- Handling errors and clearing the database

This package helps Angular developers integrate client-side storage without worrying about the complexities of the native IndexedDB API.

## Features
- **CRUD Operations**: Provides methods to create, read, update, and delete data.
- **Cache Expiration**: Supports cache expiration based on configurable cache time (in milliseconds).
- **Support for Angular Versions**: Supports Angular 11, 16, and 18.
- **Custom DB and Store Names**: Dynamic database name and store name injection through Angular’s dependency injection system.

## Installation

You can install the package via npm:

```bash
npm install @ashenhiroshana/angular-indexed-db-helper
```

## Usage

### Example of Using the Library

1. **Create an Angular App and Use the Library**

   In your **Angular 18**, **Angular 16**, or **Angular 11** app, follow these steps:

   **app.component.ts:**

   ```typescript
   import { Component } from '@angular/core';
   import { IndexedDbHandler, DB_NAME, STORE_NAME, CACHED_TIME } from 'angular-indexed-db-helper';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.scss'],
     providers: [
       { provide: DB_NAME, useValue: 'MyCustomDB' },
       { provide: STORE_NAME, useValue: 'MyCustomStore' },
       { provide: CACHED_TIME, useValue: 3600000 }  // Cache expiration time in milliseconds (1 hour)
     ]
   })
   export class AppComponent {
     constructor(private indexedDbHandler: IndexedDbHandler) {}

     title = 'Angular IndexedDB Example';
   }
   ```

2. **Using the Service Methods**

   You can now use the service methods to interact with the IndexedDB in your component. The methods include `saveData()`, `getData()`, `removeData()`, `updateData()`, and `getAll()`.

   **Example:**

   ```typescript
   // Save data
   this.indexedDbHandler.saveData('user1', { id: 'user1', name: 'John Doe' });

   // Get data
   const userData = await this.indexedDbHandler.getData('user1');
   console.log(userData);

   // Remove data
   await this.indexedDbHandler.removeData('user1');
   ```

3. **Clearing the Store**

   You can clear the entire store with the `clearStore()` method:

   ```typescript
   await this.indexedDbHandler.clearStore();
   ```

## Angular Version Support

This library supports **Angular versions 11, 16, and 18**.

- **Angular 11 Support**: Ensure that you are using the correct setup as per the Angular 11 specifications. Older Angular versions (like 11) have different handling for modules and providers.
- **Angular 16 Support**: Angular 16 introduced some changes related to dependency injection and standalone components. The library fully supports these changes.
- **Angular 18 Support**: The latest version of Angular is fully supported, and all methods are compatible with Angular 18’s updated features and optimizations.

## Testing the Library

The library comes with comprehensive test cases for various use cases, including:

### Test Case Scenarios

- **Data Saving**: Tests that data is saved correctly in IndexedDB.
- **Data Retrieval**: Ensures that saved data can be retrieved correctly.
- **Data Removal**: Verifies that data can be removed from the database.
- **Expiration Logic**: Ensures that data expires correctly based on the specified cache time.
- **Get All Data**: Tests retrieval of all data from the store.
- **Error Handling**: Ensures that errors are handled correctly during interactions with IndexedDB.

### Running Tests

To run the tests, simply use the following command in your project:

```bash
ng test
```

This will trigger the tests and provide results in your terminal or browser window.

### Example Test Case (Jasmine)

Here’s an example test case for saving and retrieving data:

```typescript
it('should save and retrieve data from IndexedDB', async () => {
  const data = { id: 'user1', name: 'John Doe' };
  await service.saveData(data.id, data);  // Save data
  const retrievedData = await service.getData(data.id);  // Retrieve data
  expect(retrievedData).toEqual(data);  // Check if saved and retrieved data match
});
```

## Contributing

We welcome contributions to this project! If you find bugs or would like to add features, feel free to create a pull request. Please follow these steps:

1. Fork the repository
2. Create a new branch
3. Implement your changes or fixes
4. Write tests to ensure your changes work as expected
5. Submit a pull request with a detailed explanation of your changes

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
