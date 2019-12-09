import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromSession from './session.reducer';

export interface State {
  session: fromSession.State;
}

export const reducers: ActionReducerMap<State> = {
  session: fromSession.reducer,
};


export function logger(reducer: ActionReducer<State>) { // 追加
  return (state, action) => {
    const newState = reducer(state, action);
    console.log('action', action);
    console.log('state', newState);
    return newState;
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : []; // 変更

export const selectSession = (state: State) => state.session;
export const getLoading = createSelector(selectSession, fromSession.getSessionLoading);
export const getSession = createSelector(selectSession, fromSession.getSessionData);
