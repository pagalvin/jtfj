import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

try {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
catch (appException) {
    console.error("main.ts: Error! Caught an exception, details:", appException);
}