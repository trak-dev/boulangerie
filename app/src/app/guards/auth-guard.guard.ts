import { CanActivateFn } from '@angular/router';
import { AccountsService } from '../services/accounts/accounts.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = async (route, state) => {
  
  const _accountsService = inject(AccountsService);
  const _router = inject(Router);
  
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    await _accountsService.verifyToken(token);
    return true;
  } catch (error) {
    console.error(error);
    _router.navigate(['/login']);
    return false;
  }
};

export const NeedToActivate: CanActivateFn = async (route, state) => {
  const _accountsService = inject(AccountsService);
  const _router = inject(Router);
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    await _accountsService.verifyToken(token);
    _router.navigate(['/home']);
    return false;
  } catch (error) {
    console.error(error);
    return true;
  }
};
