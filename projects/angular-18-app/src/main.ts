import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DB_NAME, STORE_NAME, CACHED_TIME } from 'indexed-db';  // Import the tokens

const appConfig = {
  providers: [
    { provide: DB_NAME, useValue: 'MyCustomDB' },  // Provide dynamic dbName
    { provide: STORE_NAME, useValue: 'MyCustomStore' },  // Provide dynamic storeName
    { provide: CACHED_TIME, useValue: 3600000 } // Provide cache time (1 hour in milliseconds)
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
