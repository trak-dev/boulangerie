import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { loadingReducer } from './services/global/loading.state';
import { userReducer } from './services/global/user.state';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideStore({ loading: loadingReducer, user: userReducer }),
    provideHttpClient(), // Provide HttpClient
  ]
};
