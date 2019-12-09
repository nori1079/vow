import { Action } from '@ngrx/store';
import { Session } from '../../../class/chat';
import { SessionActions, SessionActionTypes } from '../actions/session.actions';


export interface State {
  loading: boolean;
  session: Session;
}

export const initialState: State = {
  loading: false,
  session: new Session()
};

export function reducer(
  state = initialState,
  action: SessionActions
): State {
  switch (action.type) {
    case SessionActionTypes.LoadSessions: {
      return { ...state, loading: true };
    }
    case SessionActionTypes.LoadSessionsSuccess: {
      return { ...state, loading: false, session: action.payload.session };
    }
    case SessionActionTypes.LoadSessionsFail: {
      return { ...state, loading: false };
    }
    case SessionActionTypes.LoginSessions: {
      return { ...state, loading: true };
    }
    case SessionActionTypes.LoginSessionsSuccess: {
      return { ...state, loading: false, session: action.payload.session };
    }
    case SessionActionTypes.LoginSessionsFail: {
      return { ...state, loading: false };
    }
    case SessionActionTypes.LogoutSessions: {
      return { ...state, loading: true };
    }
    case SessionActionTypes.LogoutSessionsSuccess: {
      return { ...state, loading: false, session: action.payload.session };
    }
    case SessionActionTypes.LogoutSessionsFail: {
      return { ...state, loading: false };
    }
    default:
      return state;
  }
}

export const getSessionLoading = (state: State) => state.loading;
export const getSessionData = (state: State) => state.session;
