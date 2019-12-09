import { Action } from '@ngrx/store';
import { Session } from '../../../class/chat';

export enum SessionActionTypes {
  LoadSessions = '[Session] Load',
  LoadSessionsSuccess = '[Session] Load Success',
  LoadSessionsFail = '[Session] Load Fail',
  LoginSessions = '[Session] Login',
  LoginSessionsSuccess = '[Session] Login Success',
  LoginSessionsFail = '[Session] Login Fail',
  LogoutSessions = '[Session] Logout',
  LogoutSessionsSuccess = '[Session] Logout Success',
  LogoutSessionsFail = '[Session] Logout Fail',
}

export class LoadSessions implements Action {
  readonly type = SessionActionTypes.LoadSessions;
}

export class LoadSessionsSuccess implements Action {
  readonly type = SessionActionTypes.LoadSessionsSuccess;

  constructor(public payload: { session: Session }) {
  }
}

export class LoadSessionsFail implements Action {
  readonly type = SessionActionTypes.LoadSessionsFail;

  constructor(public payload?: { error: any }) {
  }
}

export class LoginSessions implements Action {
  readonly type = SessionActionTypes.LoginSessions;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class LoginSessionsSuccess implements Action {
  readonly type = SessionActionTypes.LoginSessionsSuccess;

  constructor(public payload: { session: Session }) {
  }
}

export class LoginSessionsFail implements Action {
  readonly type = SessionActionTypes.LoginSessionsFail;

  constructor(public payload?: { error: any }) {
  }
}

export class LogoutSessions implements Action {
  readonly type = SessionActionTypes.LogoutSessions;
}

export class LogoutSessionsSuccess implements Action {
  readonly type = SessionActionTypes.LogoutSessionsSuccess;

  constructor(public payload: { session: Session }) {
  }
}

export class LogoutSessionsFail implements Action {
  readonly type = SessionActionTypes.LogoutSessionsFail;

  constructor(public payload?: { error: any }) {
  }
}

export type SessionActions =
  | LoadSessions
  | LoadSessionsSuccess
  | LoadSessionsFail
  | LoginSessions
  | LoginSessionsSuccess
  | LoginSessionsFail
  | LogoutSessions
  | LogoutSessionsSuccess
  | LogoutSessionsFail;
