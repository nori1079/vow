import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap, take } from 'rxjs/operators'; // 追加
import { AngularFirestore } from '@angular/fire/firestore'; // 追加

import { Password, Session, User } from '../../class/chat';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public session = new Session();
  public sessionSubject = new Subject<Session>();
  public sessionState = this.sessionSubject.asObservable();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { // 追加
  }

  // ログイン状況確認
  checkLogin(): void { // 変更
    this.afAuth
      .authState
      .pipe(
        switchMap(auth => {
          // authの有無でObservbleを変更
          if (!auth) {
            return of(null);
          } else {
            return this.getUser(auth.uid);
          }
        })
      )
      .subscribe(auth => {
        this.session.login = (!!auth);
        this.session.user = (auth) ? auth : new User();
        this.sessionSubject.next(this.session);
      });
  }

  // ログイン状況確認(State)
  checkLoginState(): Observable<Session> {
    return this.afAuth
      .authState
      .pipe(
        map(auth => {
          // ログイン状態を返り値の有無で判断
          this.session.login = (!!auth);
          return this.session;
        })
      );
  }

  login(account: Password): void {
    this.afAuth
      .auth
      .signInWithEmailAndPassword(account.email, account.password)
      .then(auth => {
        // メールアドレス確認が済んでいるかどうか
        if (!auth.user.emailVerified) {
          this.afAuth.auth.signOut();
          return Promise.reject('メールアドレスが確認できていません。');
        } else {
          this.session.login = true;
          this.sessionSubject.next(this.session);
          return this.router.navigate(['/']);
        }
      })
      .then(() => alert('ログインしました。'))
      .catch(err => {
        console.log(err);
        alert('ログインに失敗しました。\n' + err);
      });
  }

  logout(): void {
    this.afAuth
      .auth
      .signOut()
      .then(() => {
        return this.router.navigate(['/account/login']);
      })
      .then(() => {
        this.sessionSubject.next(this.session.reset()); // 変更
        alert('ログアウトしました。');
      })
      .catch(err => {
        console.log(err);
        alert('ログアウトに失敗しました。\n' + err);
      });
  }

  // アカウント作成
  signup(account: Password): void {
    let auth;
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(account.email, account.password) // アカウント作成
      .then(_AUTH => {
        auth = _AUTH;
        return auth.user.sendEmailVerification(); // メールアドレス確認
      })
      .then(() => { // 追加
        return this.createUser(new User(auth.user.uid, account.name));
      })
      .then(() => this.afAuth.auth.signOut()) // 追加
      .then(() => {
        account.reset(); // 追加
        alert('メールアドレス確認メールを送信しました。');
      })
      .catch(err => {
        console.log(err);
        alert('アカウントの作成に失敗しました。\n' + err);
      });
  }

  // ユーザーを作成
  private createUser(user: User): Promise<void> { // 追加
    return this.afs
      .collection('users')
      .doc(user.uid)
      .set(user.deserialize());
  }

  // ユーザーを取得
  private getUser(uid: string): Observable<any> { // 追加
    return this.afs
      .collection('users')
      .doc(uid)
      .valueChanges()
      .pipe(
        take(1),
        switchMap((user: User) => of(new User(uid, user.name)))
      );
  }

}
