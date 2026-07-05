import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js';
import { provideClientHydration } from '@angular/platform-browser';

bootstrapApplication(App, appConfig,)
  .catch((err) => console.error(err));
