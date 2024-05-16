import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { GlobalService } from '../global/global.service';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class AccountsService {

  constructor(private _http: HttpClient, private _global: GlobalService) { }

  /**
   * Function to verify the authenticity of a token.
   * 
   * @param token - The token to verify.
   * 
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the token is invalid.
   * 
   */
  verifyToken(token: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      this._http.get(`${environment.api}/users/isUserConnected`, { headers })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });

  }

  /**
   * Function to log in a user.
   * 
   * @param email - The email of the user.
   * @param password - The password of the user.
   * 
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the username or password is invalid.
   * 
   */
  login(email: string, password: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.post<User>(`${environment.api}/users/password-login`, { email, password }, { headers })
        .subscribe({
          next: (user) => {
            this._global.setUser(user);
            localStorage.setItem('token', user.token);
            resolve(user);
          },
          error: (err) => reject(err)
        });
    });
  }

  /**
   * Function to log out a user.
   * 
   */
  logout():void {
    this._global.setUser(undefined);
    localStorage.removeItem('token');
  }

  /**
   * Function to send a magic link to the user.
   * 
   * @param email - The email of the user.
   * 
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the email is invalid.
   * 
   */
  sendMagicLink(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.post(`${environment.api}/users/send-magic-link`, { email }, { headers })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  };

  /**
   * Function to register a user using magic link.
   * 
   * @param email - The email of the user.
   * @param name - The name of the user.
   * 
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the email or name is invalid.
   * 
   */
  register(email: string, name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.post(`${environment.api}/users/register`, { email, name }, { headers })
        .subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
    });
  }

  /**
   * Function to register a user using a password.
   * 
   * @param email - The email of the user.
   * @param name - The name of the user.
   * @param password - The password of the user.
   * 
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the email, name, or password is invalid.
   * 
   */
  registerWithPassword(email: string, name: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.put<User>(`${environment.api}/users/password-register`, { email, name, password }, { headers })
        .subscribe({
          next: (user) => {
            this._global.setUser(user);
            localStorage.setItem('token', user.token);
            resolve();
          },
          error: (err) => reject(err)
        });
    });
  }

  /**
   * Function to log in a user using the magicLink token.
   *  
   * @param magicLink - The magicLink token.
   *  
   * @returns A Promise that resolves to void.
   * 
   * @throws An error if the magicLink is invalid.
   * 
   * */
  loginWithMagicLink(magicLink: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.post<User>(`${environment.api}/users/magic-login`, { magicLink }, { headers })
        .subscribe({
          next: (user) => {
            this._global.setUser(user)
            localStorage.setItem('token', user.token);
            resolve();
          },
          error: (err) => reject(err)
        });
    });
  }
}
