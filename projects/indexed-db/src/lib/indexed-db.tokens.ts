import { InjectionToken } from '@angular/core';

// Define InjectionTokens for dbName and storeName
export const DB_NAME = new InjectionToken<string>('DB_NAME');
export const STORE_NAME = new InjectionToken<string>('STORE_NAME');
export const CACHED_TIME = new InjectionToken<number>('CACHED_TIME');  // Add new token for cached time
