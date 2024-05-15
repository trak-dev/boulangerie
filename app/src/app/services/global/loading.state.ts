import { createAction, props, createReducer, on, Action } from '@ngrx/store';

export interface LoadingState {
  loading: boolean;
}

const initialLoadingState: LoadingState = {
  loading: false,
};

const loadingFeatureKey = 'loading';

export const setLoading = createAction(
  `[${loadingFeatureKey}] Set Loading`,
  props<{ loading: boolean }>()
);

export const loadingReducer = createReducer(
  initialLoadingState,
  on(setLoading, (state, { loading }) => ({ ...state, loading })),
);

export function reducer(state: LoadingState | undefined, action: Action) {
  return loadingReducer(state, action);
}
