
# Angular IndexedDB Helper

`angular-indexed-db-helper` is an Angular library designed to simplify interaction with IndexedDB in Angular applications. It provides a clean API for performing CRUD operations on IndexedDB, with support for cache expiration, data storage, and retrieval.

This library is ideal for managing client-side storage with IndexedDB, offering enhanced performance and flexibility.

## Features

- **Easy-to-use CRUD operations** for IndexedDB.
- **Automatic cache expiration** based on a configurable time-to-live (TTL).
- Support for **standalone Angular components** (Angular 16+).
- **Typed API** with TypeScript support.
- **Flexible configuration** with injectable DB name, store name, and cache time.

## Installation

To install the package, run the following command:

```bash
npm install angular-indexed-db-helper
```

## Usage

### 1. Import the Library in Your Angular Application

In your Angular component or service, you can import and inject the `IndexedDbHandler` to interact with IndexedDB.

Example usage:

```typescript
import { Component } from '@angular/core';
import { IndexedDbHandler, DB_NAME, STORE_NAME } from 'angular-indexed-db-helper';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: DB_NAME, useValue: 'MyCustomDB' },
    { provide: STORE_NAME, useValue: 'MyCustomStore' },
    { provide: CACHED_TIME, useValue: 3600000 }  // Cache time in milliseconds (e.g., 1 hour)
  ]
})
export class AppComponent {
  constructor(private indexedDbHandler: IndexedDbHandler) {}

  // Example to save data
  saveData() {
    const data = { id: 'user1', name: 'John Doe' };
    this.indexedDbHandler.saveData(data.id, data);
  }

  // Example to retrieve data
  getData() {
    this.indexedDbHandler.getData('user1').then(data => console.log(data));
  }
}
```

### 2. Basic CRUD Operations

#### Save Data

```typescript
this.indexedDbHandler.saveData('user1', { id: 'user1', name: 'John Doe' });
```

#### Get Data

```typescript
this.indexedDbHandler.getData('user1').then(data => console.log(data));
```

#### Remove Data

```typescript
this.indexedDbHandler.removeData('user1');
```

#### Get All Data

```typescript
this.indexedDbHandler.getAll().then(data => console.log(data));
```

#### Clear Store

```typescript
this.indexedDbHandler.clearStore();
```

### 3. Configuration

- **DB_NAME**: The name of your IndexedDB database.
- **STORE_NAME**: The name of your IndexedDB object store.
- **CACHED_TIME**: Optional. Defines the cache expiration time in milliseconds. If not provided, the default cache time (in milliseconds) will be used.

### Example: Set Cache Expiration Time

```typescript
this.indexedDbHandler.setCachedTime(7200000);  // Set to 2 hours in milliseconds
```

## License

MIT License

## Keywords

- `angular`
- `indexeddb`
- `storage`
- `client-side`
- `cache`
- `angular-library`
- `indexeddb-helper`
- `angular-16`
- `angular-18`
- `crud-operations`
- `ng`
- `schema`
- `index`

