import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard, NeedToActivate }  from  './guards/auth-guard.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NeedToActivate]},
    { path: 'register', component: RegisterComponent, canActivate: [NeedToActivate]},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
