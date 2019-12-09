import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import {
  SessionActionTypes,
  LoadSessions,
  LoadSessionsSuccess,
  LoadSessionsFail,
  LogoutSessions,
  LogoutSessionsSuccess,
  LogoutSessionsFail,
  LoginSessions,
  LoginSessionsSuccess,
  LoginSessionsFail,
} from '../actions/session.actions';
import { Session, User } from '../../../class/chat';
import { User as fbUser } from 'firebase';


@Injectable()
export class SessionEffects {

  constructor(
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
  }

  /**
   * Load Sessions
   */

  @Effect()
  loadSession$: Observable<Action> =
    this.actions$.pipe(
      ofType<LoadSessions>(SessionActionTypes.LoadSessions),
      // ユーザーの認証状況を取得
      switchMap(() => {
        return this.afAuth.authState
          .pipe(
            take(1),
            map((result: fbUser | null) => {
              if (!result) {
                // ユーザーが存在しなかった場合は、空のセッションを返す
                return new LoadSessionsSuccess({ session: new Session() });
              } else {
                return result;
              }
            }),
            catchError(this.handleLoginError<LoadSessionsFail>(
              'fetchAuth', new LoadSessionsFail())
            )
          );
      }),
      // ユーザーの認証下情報を取得
      switchMap((auth: fbUser | LoadSessionsSuccess | LoadSessionsFail) => {
        // ユーザーが存在しなかった場合は、認証下情報を取得しない
        if (auth instanceof LoadSessionsSuccess || auth instanceof LoadSessionsFail) {
          return of(auth);
        }
        return this.afs
          .collection<User>('users')
          .doc(auth.uid)
          .valueChanges()
          .pipe(
            take(1),
            map((result: User) => {
              return new LoadSessionsSuccess({
                session: new Session(result)
              });
            }),
            catchError(this.handleLoginError<LoadSessionsFail>(
              'fetchUser', new LoadSessionsFail())
            )
          );
      })
    );

  /**
   * Login Session
   */

  @Effect()
  loginSession$: Observable<Action> =
    this.actions$.pipe(
      ofType<LoginSessions>(SessionActionTypes.LoginSessions),
      map(action => action.payload),
      switchMap((payload: { email: string, password: string }) => {
        return this.afAuth
          .auth
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then(auth => {
            // ユーザーが存在しなかった場合は、空のセッションを返す
            if (!auth.user.emailVerified) {
              alert('メールアドレスが確認できていません。');
              this.afAuth.auth.signOut()
                .then(() => this.router.navigate(['/account/login']));
              return new LoginSessionsSuccess({ session: new Session() });
            } else {
              return auth.user;
            }
          })
          .catch(err => {
            alert('ログインに失敗しました。\n' + err);
            return new LoginSessionsFail({ error: err });
          }
          );
      }),
      switchMap((auth: fbUser | LoginSessionsSuccess | LoginSessionsFail) => {
        // ユーザーが存在しなかった場合は、空のセッションを返す
        if (auth instanceof LoginSessionsSuccess || auth instanceof LoginSessionsFail) {
          return of(auth);
        }
        return this.afs
          .collection<User>('users')
          .doc(auth.uid)
          .valueChanges()
          .pipe(
            take(1),
            map((result: User) => {
              alert('ログインしました。');
              this.router.navigate(['/']);
              return new LoginSessionsSuccess({
                session: new Session(result)
              });
            }),
            catchError(this.handleLoginError<LoginSessionsFail>(
              'loginUser', new LoginSessionsFail(), 'login'
            ))
          );
      })
    );

  /**
   * Logout Session
   */

  @Effect()
  logoutSession$: Observable<Action> =
    this.actions$.pipe(
      ofType<LogoutSessions>(SessionActionTypes.LogoutSessions),
      switchMap(() => this.afAuth.auth.signOut()),
      switchMap(() => {
        return this.router.navigate(['/account/login'])
          .then(() => {
            alert('ログアウトしました。');
            return new LogoutSessionsSuccess({
              session: new Session()
            });
          });
      }),
      catchError(this.handleLoginError<LogoutSessionsFail>(
        'logoutUser', new LogoutSessionsFail(), 'logout'
      ))
    );


  // エラー発生時の処理
  private handleLoginError<T>(operation = 'operation', result: T, dialog?: 'login' | 'logout') {
    return (error: any): Observable<T> => {

      // 失敗した操作の名前、エラーログをconsoleに出力
      console.error(`${operation} failed: ${error.message}`);

      // アラートダイアログの表示
      if (dialog === 'login') {
        alert('ログインに失敗しました。\n' + error);
      }

      if (dialog === 'logout') {
        alert('ログアウトに失敗しました。\n' + error);
      }

      // ログアウト処理
      this.afAuth.auth.signOut()
        .then(() => this.router.navigate(['/account/login']));

      // 結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }
}
