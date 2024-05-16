import { createAction, props, createReducer, on, Action } from '@ngrx/store';
import { User } from '../../models/user.model';

export interface UserState {
  user: User | undefined;
}

const initialUserState: UserState = {
  user: undefined,
};

const userFeatureKey = 'user';

export const setUser = createAction(
  `[${userFeatureKey}] Set User`,
  props<{ user: User | undefined }>()
);

export const clearUser = createAction(
  `[${userFeatureKey}] Clear User`
);

export const userReducer = createReducer(
  initialUserState,
  on(setUser, (state, { user }) => ({
    ...state,
    user
  })),
  on(clearUser, (state) => ({
    ...state,
    user: undefined
  }))
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}