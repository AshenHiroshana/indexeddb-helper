# Angular 11 IndexedDB Library

A powerful and flexible Angular 11 library for managing client-side storage using IndexedDB with support for cache expiration and CRUD operations.

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete operations for IndexedDB
- **Cache Expiration**: Built-in support for data expiration with configurable cache times
- **Angular 11 Compatible**: Built specifically for Angular 11 projects
- **TypeScript Support**: Full TypeScript support with proper typing
- **Injectable Service**: Easy to integrate into Angular applications
- **Promise-based API**: Modern async/await support

## Installation

```bash
npm install angular-11-indexeddb
```

## Usage

### 1. Import the library in your module

```typescript
import { NgModule } from '@angular/core';
import { IndexedDbHandler, DB_NAME, STORE_NAME, CACHED_TIME } from 'angular-11-indexeddb';

@NgModule({
  providers: [
    {
      provide: DB_NAME,
      useValue: 'myAppDB'
    },
    {
      provide: STORE_NAME,
      useValue: 'myStore'
    },
    {
      provide: CACHED_TIME,
      useValue: 300000 // 5 minutes in milliseconds
    },
    IndexedDbHandler
  ]
})
export class AppModule { }
```

### 2. Use in your component

```typescript
import { Component } from '@angular/core';
import { IndexedDbHandler } from 'angular-11-indexeddb';

@Component({
  selector: 'app-my-component',
  template: '<div>IndexedDB Component</div>'
})
export class MyComponent {
  constructor(private indexedDb: IndexedDbHandler) {}

  async saveData() {
    await this.indexedDb.saveData('key1', { name: 'John', age: 30 });
  }

  async getData() {
    const data = await this.indexedDb.getData('key1');
    console.log(data);
  }
}
```

## API Reference

### IndexedDbHandler

#### Methods

- `saveData(key: string, value: any, cacheTime?: number): Promise<void>`
- `getData(key: string): Promise<any>`
- `updateData(key: string, value: any): Promise<void>`
- `removeData(key: string): Promise<void>`
- `getAll(): Promise<any[]>`
- `clearStore(): Promise<void>`
- `whenInitialized(): Promise<IDBDatabase>`

## License

MIT
