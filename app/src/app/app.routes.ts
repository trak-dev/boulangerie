import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard, NeedToActivate }  from  './guards/auth-guard.guard';
import { PrizesComponent } from './pages/prizes/prizes.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NeedToActivate]},
    { path: 'register', component: RegisterComponent, canActivate: [NeedToActivate]},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'prizes', component: PrizesComponent, canActivate: [AuthGuard]},
    { path: 'leaderboard', component: LeaderboardComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
