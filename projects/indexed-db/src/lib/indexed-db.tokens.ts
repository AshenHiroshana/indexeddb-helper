import { InjectionToken } from '@angular/core';

// Define InjectionTokens for dbName and storeName
export const DB_NAME = new InjectionToken<string>('DB_NAME');
export const STORE_NAME = new InjectionToken<string>('STORE_NAME');
