import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Pastrywon } from '../../models/pastry.model';
import { setLoading, LoadingState } from './loading.state';
import { UserState, setUser, clearUser } from './user.state';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  user$: Observable<User | undefined>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ loading: LoadingState, user: UserState }>) {
    this.user$ = this.store.select(state => state.user.user);
    this.loading$ = this.store.select(state => state.loading.loading);

    // Load user from local storage on service initialization
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser) as User;
      this.setUser(user);
    }
  }

  setUser(user: User | undefined) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.store.dispatch(setUser({ user }));
  }

  setLoading(loading: boolean) {
    this.store.dispatch(setLoading({ loading }));
  }

  clearUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.store.dispatch(clearUser());
  }

  getLoading() {
    return this.store.select(state => state.loading.loading);
  }

  addPastries(pastries: Pastrywon[]) {
    // get the user from the local storage
    const user = JSON.parse(localStorage.getItem('user') as string) as User;
    // update the user pastries
    user.pastriesWon = pastries;
    // update the local storage
    localStorage.setItem('user', JSON.stringify(user));
    // update the store
    this.setUser(user);
  }
}