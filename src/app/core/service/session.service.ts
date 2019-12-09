import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Password, Session } from '../../class/chat';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public session = new Session();
  public sessionSubject = new Subject<Session>();
  public sessionState = this.sessionSubject.asObservable();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth) {
  }

  // ログイン状況確認
  checkLogin(): void { // 追加
    this.afAuth
      .authState
      .subscribe(auth => {
        // ログイン状態を返り値の有無で判断
        this.session.login = (!!auth);
        this.sessionSubject.next(this.session);
      });
  }


  // ログイン状況確認(State)
  checkLoginState(): Observable<Session> { // 追加
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

  login(account: Password): void { // 変更
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

  logout(): void {// 変更
    this.afAuth
      .auth
      .signOut()
      .then(() => {
        this.sessionSubject.next(this.session.reset());
        return this.router.navigate(['/account/login']);
      })
      .then(() => alert('ログアウトしました。'))
      .catch(err => {
        console.log(err);
        alert('ログアウトに失敗しました。\n' + err);
      });
  }

  // アカウント作成
  signup(account: Password): void {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(account.email, account.password) // アカウント作成
      .then(auth => auth.user.sendEmailVerification()) // メールアドレス確認
      .then(() => alert('メールアドレス確認メールを送信しました。'))
      .catch(err => {
        console.log(err);
        alert('アカウントの作成に失敗しました。\n' + err);
      });
  }

}
