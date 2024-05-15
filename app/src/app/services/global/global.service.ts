import { Injectable } from '@angular/core';
import { Store, createAction, props } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { setLoading, LoadingState } from './loading.state';

interface GlobalState {
  user: User | undefined;
}

const globalFeatureKey = 'global';

export const setUser = createAction(
  `[${globalFeatureKey}] Set User`,
  props<{ user: User | undefined }>()
);

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  user$: Observable<User | undefined>;
  loading$: Observable<boolean>;

  constructor(private store: Store<{ global: GlobalState, loading: LoadingState }>) {
    this.user$ = this.store.select('global', 'user');
    this.loading$ = this.store.select('loading', 'loading');
  }

  setUser(user: User | undefined) {
    this.store.dispatch(setUser({ user }));
  }

  setLoading(loading: boolean) {
    this.store.dispatch(setLoading({ loading }));
  }

  getLoading() {
    return this.store.select('loading', 'loading');
  }
}
